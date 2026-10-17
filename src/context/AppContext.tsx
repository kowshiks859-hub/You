import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveTab,
  AuthState,
  Badge,
  DailyNutritionRecord,
  FoodItem,
  MealReminder,
  NotificationItem,
  NutritionGoal,
  ReminderSetting,
  Task,
  TaskPriority,
  UserProfile,
  DailyRecord,
  normalizePriority
} from '../types';
import {
  ALL_AVAILABLE_BADGES,
  DEFAULT_MEAL_REMINDERS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_NUTRITION_GOAL,
  DEFAULT_NUTRITION_HISTORY,
  DEFAULT_REMINDER_SETTINGS,
  DEFAULT_TASKS,
  DEFAULT_USER_PROFILE,
} from '../data/defaultData';
import { soundFx } from '../services/soundEffects';

interface LevelUpInfo {
  newLevel: number;
  oldLevel: number;
  unlockedBadge?: Badge;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function addDays(str: string, days: number): string {
  const d = parseDate(str);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function getEffectiveDate(offset = 0): string {
  const now = new Date();
  // Late-night grace window: 12:00 AM - 3:59 AM is treated as part of the previous day's consistency cycle
  if (now.getHours() < 4) {
    now.setDate(now.getDate() - 1);
  }
  if (offset !== 0) {
    now.setDate(now.getDate() + offset);
  }
  return formatDate(now);
}

export function cleanTasks(taskList: Task[]): Task[] {
  return (taskList || [])
    .filter(t => {
      const title = (t.title || '').trim().toLowerCase();
      return title !== 'complete nutrition tracking' && title !== 'complete nutrition tracker';
    })
    .map(t => ({
      ...t,
      priority: normalizePriority(t.priority)
    }));
}

interface AppContextType {
  nextDayAction: () => void;
  todayStr: string;
  dayOffset: number;
  setDayOffset: React.Dispatch<React.SetStateAction<number>>;
  isAuthenticated: boolean;
  currentUser: { name: string; username?: string; phone?: string } | null;
  loginUser: (data: { type: 'username' | 'phone'; identifier: string; name?: string }) => void;
  logoutUser: () => void;

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  addXp: (amount: number, reason: string) => void;
  levelUpInfo: LevelUpInfo | null;
  dismissLevelUp: () => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'date'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  toggleStarTask: (id: string) => void;

  nutritionGoal: NutritionGoal;
  setNutritionGoal: (goal: NutritionGoal) => void;
  loggedFoods: FoodItem[];
  addFoodLog: (food: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  deleteFoodLog: (id: string) => void;
  updateFoodLog: (id: string, updates: Partial<FoodItem>) => void;
  todayNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  waterMl: number;
  addWater: (amount: number) => void;
  creatineGrams: number;
  addCreatine: (amount: number) => void;
  nutritionHistory: DailyNutritionRecord[];
  setNutritionHistory: React.Dispatch<React.SetStateAction<DailyNutritionRecord[]>>;
  
  dailyData: Record<string, DailyRecord>;
  getHistoricalData: () => DailyRecord[];
  updateDailyProtein: (date: string, amount: number) => boolean;

  reminderSettings: ReminderSetting[];
  updateReminderSetting: (key: ReminderSetting['key'], time: string, enabled: boolean) => void;
  mealReminders: MealReminder[];
  updateMealReminder: (id: string, time: string, enabled: boolean) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;

  exportAppData: () => string;
  importAppData: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  vaultTasks: Task[];
  deleteVaultTask: (id: string) => void;
  resurrectVaultTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'spider_tracker_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() =>
    loadFromStorage('auth', {
      isAuthenticated: true,
      user: { name: 'Spider Hero', username: 'spiderhero' }
    })
  );

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    const loaded = loadFromStorage('user_profile', DEFAULT_USER_PROFILE);
    return {
      ...DEFAULT_USER_PROFILE,
      ...loaded,
      hp: loaded.hp !== undefined ? Math.max(0, loaded.hp) : 100,
      maxHp: loaded.maxHp || 100,
      currentStreak: loaded.currentStreak ?? 0
    };
  });

  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>(() => loadFromStorage('nutrition_goal', DEFAULT_NUTRITION_GOAL));
  const [nutritionHistory, setNutritionHistory] = useState<DailyNutritionRecord[]>(() =>
    loadFromStorage('nutrition_history', DEFAULT_NUTRITION_HISTORY)
  );
  const [reminderSettings, setReminderSettings] = useState<ReminderSetting[]>(() =>
    loadFromStorage('reminder_settings', DEFAULT_REMINDER_SETTINGS)
  );
  const [mealReminders, setMealReminders] = useState<MealReminder[]>(() => loadFromStorage('meal_reminders', DEFAULT_MEAL_REMINDERS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', DEFAULT_NOTIFICATIONS));

  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const [dayOffset, setDayOffset] = useState(() => loadFromStorage('day_offset', 0));
  const [completedUntilDate, setCompletedUntilDate] = useState<string | null>(() => loadFromStorage('completed_until_date', null));

  const [vaultTasks, setVaultTasks] = useState<Task[]>(() => {
    const loaded = loadFromStorage('vault_tasks', [] as Task[]);
    return cleanTasks(loaded);
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Authoritative todayStr calculation with late-night completion window and completion-based cycle
  const rawEffectiveDate = useMemo(() => getEffectiveDate(dayOffset), [dayOffset]);

  const todayStr = useMemo(() => {
    // If the raw effective date was already completed (e.g., late-night or late submission),
    // the active cycle advances to the next day
    if (completedUntilDate && rawEffectiveDate <= completedUntilDate) {
      return addDays(completedUntilDate, 1);
    }
    return rawEffectiveDate;
  }, [completedUntilDate, rawEffectiveDate]);

  // --- DAILY DATE-BASED STATE ---
  const [dailyData, setDailyData] = useState<Record<string, DailyRecord>>(() => {
    const loaded = loadFromStorage('daily_records', {} as Record<string, DailyRecord>);
    const normalized: Record<string, DailyRecord> = {};
    for (const [k, v] of Object.entries(loaded)) {
      normalized[k] = {
        ...v,
        tasks: cleanTasks(v.tasks)
      };
    }
    return normalized;
  });

  const currentDayNumber = user.currentDayNumber || 1;

  // Initialize today's record if it doesn't exist
  useEffect(() => {
    setDailyData(prev => {
      if (!prev[todayStr]) {
        const isMigration = Object.keys(prev).length === 0;
        const initialTasks = cleanTasks(isMigration ? loadFromStorage('tasks', DEFAULT_TASKS) : DEFAULT_TASKS);
        return {
          ...prev,
          [todayStr]: {
            date: todayStr,
            dayNumber: currentDayNumber,
            tasks: initialTasks,
            loggedFoods: isMigration ? loadFromStorage('logged_foods', []) : [],
            waterMl: isMigration ? loadFromStorage('water_ml', 0) : 0,
            creatineGrams: isMigration ? loadFromStorage('creatine_g', 0) : 0,
            hasAwardedStreak: false,
            hasPenalizedHp: false,
          }
        };
      }
      return prev;
    });
  }, [todayStr, currentDayNumber]);

  // Derived current day data
  const todayRecord = dailyData[todayStr] || {
    date: todayStr,
    dayNumber: currentDayNumber,
    tasks: cleanTasks(DEFAULT_TASKS),
    loggedFoods: [],
    waterMl: 0,
    creatineGrams: 0,
    hasAwardedStreak: false,
    hasPenalizedHp: false,
  };

  const tasks = todayRecord.tasks;
  const loggedFoods = todayRecord.loggedFoods;
  const waterMl = todayRecord.waterMl;
  const creatineGrams = todayRecord.creatineGrams;

  // Update helper
  const updateTodayRecord = (updates: Partial<DailyRecord>) => {
    setDailyData(prev => ({
      ...prev,
      [todayStr]: {
        ...prev[todayStr],
        ...updates
      }
    }));
  };

  // CHECK STREAK, MISSED DAYS, AND HP PENALTIES (PHASE 2 & PHASE 6)
  useEffect(() => {
    const dates = Object.keys(dailyData).sort();
    if (dates.length <= 1) return; // Need at least 1 concluded day to evaluate missed days

    let hpDeductionTotal = 0;
    let anyPenalized = false;
    const recordsToUpdate: Record<string, Partial<DailyRecord>> = {};
    const fallenTasksToAdd: Task[] = [];

    // Check all past days that concluded before todayStr
    for (const d of dates) {
      if (d >= todayStr) continue; // Today or future is not concluded
      const rec = dailyData[d];
      if (!rec) continue;

      // Missed day: concluded without streak completion and hasn't been penalized yet
      if (!rec.hasAwardedStreak && !rec.hasPenalizedHp) {
        anyPenalized = true;
        recordsToUpdate[d] = { hasPenalizedHp: true };
        hpDeductionTotal += 10; // Exactly 10 HP deducted per missed day

        // Move uncompleted major and medium tasks to Vault (Fallen Tasks)
        const uncompleted = (rec.tasks || []).filter(
          t => !t.completed && (normalizePriority(t.priority) === 'major' || normalizePriority(t.priority) === 'medium')
        );
        if (uncompleted.length > 0) {
          fallenTasksToAdd.push(...uncompleted);
        }
      }
    }

    if (anyPenalized) {
      // 1. Update daily records idempotently
      setDailyData(prev => {
        const next = { ...prev };
        for (const [d, updates] of Object.entries(recordsToUpdate)) {
          if (next[d]) {
            next[d] = { ...next[d], ...updates };
          }
        }
        return next;
      });

      // 2. Add fallen tasks to Vault (preventing duplicates)
      if (fallenTasksToAdd.length > 0) {
        setVaultTasks(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const newFallen = cleanTasks(fallenTasksToAdd.filter(t => !existingIds.has(t.id)));
          return [...newFallen, ...prev];
        });
      }

      // 3. Deduct exactly 10 HP per missed day, clamp at 0, reset streak at 0 HP
      setUser(prev => {
        const currentHp = prev.hp ?? 100;
        const newHp = Math.max(0, currentHp - hpDeductionTotal);
        const hitZero = newHp === 0;

        if (hitZero && prev.currentStreak > 0) {
          soundFx.playPunch();
        }

        return {
          ...prev,
          hp: newHp,
          // Streak reset to 0 when HP reaches zero
          currentStreak: hitZero ? 0 : prev.currentStreak,
          todayXp: hitZero ? 0 : prev.todayXp
        };
      });
    }
  }, [todayStr, dailyData]);

  // Storage synchronization
  useEffect(() => saveToStorage('day_offset', dayOffset), [dayOffset]);
  useEffect(() => saveToStorage('completed_until_date', completedUntilDate), [completedUntilDate]);
  useEffect(() => saveToStorage('vault_tasks', vaultTasks), [vaultTasks]);
  useEffect(() => saveToStorage('auth', auth), [auth]);
  useEffect(() => saveToStorage('user_profile', user), [user]);
  useEffect(() => saveToStorage('nutrition_goal', nutritionGoal), [nutritionGoal]);
  useEffect(() => saveToStorage('nutrition_history', nutritionHistory), [nutritionHistory]);
  useEffect(() => saveToStorage('reminder_settings', reminderSettings), [reminderSettings]);
  useEffect(() => saveToStorage('meal_reminders', mealReminders), [mealReminders]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('daily_records', dailyData), [dailyData]);

  useEffect(() => {
    soundFx.setEnabled(user.soundEnabled);
  }, [user.soundEnabled]);

  // NEXT DAY ACTION (COMPLETING TODAY'S CYCLE)
  const nextDayAction = () => {
    const todayRec = dailyData[todayStr] || todayRecord;
    const currentTasks = todayRec.tasks || [];
    const completedTasksList = currentTasks.filter(t => t.completed);
    const incompleteTasksList = currentTasks.filter(t => !t.completed);
    const requiredCount = Math.min(5, currentTasks.length);

    if (currentTasks.length === 0 || completedTasksList.length < requiredCount) {
      return;
    }

    // 1. Move incomplete tasks of priority 'major' or 'medium' to Vault as Fallen Tasks
    const vaultEligible = incompleteTasksList.filter(t => {
      const norm = normalizePriority(t.priority);
      return norm === 'major' || norm === 'medium';
    });

    if (vaultEligible.length > 0) {
      setVaultTasks(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const newTasks = vaultEligible
          .filter(t => !existingIds.has(t.id))
          .map(t => ({
            ...t,
            priority: normalizePriority(t.priority)
          }));
        return [...newTasks, ...prev];
      });
    }

    // 2. Award streak & update daily record
    const wasAwarded = todayRec.hasAwardedStreak;
    const newStreak = wasAwarded ? user.currentStreak : user.currentStreak + 1;
    const newBestStreak = Math.max(user.bestStreak, newStreak);
    const nextDayNum = user.currentDayNumber + 1;

    setDailyData(prev => ({
      ...prev,
      [todayStr]: {
        ...prev[todayStr],
        completedAt: new Date().toISOString(),
        hasAwardedStreak: true
      }
    }));

    let claim30 = user.milestone30Claimed;
    if (newStreak >= 30 && !claim30) {
      addXp(100, "30-Day Streak Bonus! 🔥");
      claim30 = true;
    }

    setUser(prev => ({
      ...prev,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      currentDayNumber: nextDayNum,
      milestone30Claimed: claim30
    }));

    // Record completion through todayStr so next cycle starts cleanly and late-night submissions never reset prematurely
    setCompletedUntilDate(todayStr);

    soundFx.playLevelUp();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#e52521', '#facc15', '#1d4ed8', '#15803d']
    });
  };

  const loginUser = (data: { type: 'username' | 'phone'; identifier: string; name?: string }) => {
    soundFx.playLevelUp();
    const displayName = data.name || (data.type === 'username' ? data.identifier : 'Spider Agent');
    const newAuth: AuthState = {
      isAuthenticated: true,
      user: {
        name: displayName,
        username: data.type === 'username' ? data.identifier : undefined,
        phone: data.type === 'phone' ? data.identifier : undefined
      }
    };
    setAuth(newAuth);
    setUser(prev => ({ ...prev, name: displayName }));
    setActiveTabState('dashboard');
  };

  const logoutUser = () => {
    soundFx.playClick();
    setAuth({ isAuthenticated: false, user: null });
  };

  const setActiveTab = (tab: ActiveTab) => {
    soundFx.playClick();
    setActiveTabState(tab);
  };

  const addXp = (amount: number, reason: string) => {
    setUser(prev => {
      const currentLifetimeXp = prev.xp + amount;
      const currentTodayXp = prev.todayXp + amount;
      
      const currentLevel = Math.floor(currentLifetimeXp / 800) + 1;
      const xpRequired = 800;
      const didLevelUp = currentLevel > prev.level;
      let newBadge: Badge | undefined;

      if (didLevelUp) {
        soundFx.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e52521', '#facc15', '#1d4ed8', '#15803d', '#ffffff']
        });

        const badgeCandidate = ALL_AVAILABLE_BADGES.find(b => !prev.unlockedBadges.some(ub => ub.id === b.id));
        if (badgeCandidate) {
          newBadge = { ...badgeCandidate, unlockedAt: new Date().toISOString().split('T')[0] };
        }

        setLevelUpInfo({
          newLevel: currentLevel,
          oldLevel: prev.level,
          unlockedBadge: newBadge
        });
      }

      setNotifications(prevNotes => [
        {
          id: `note-${Date.now()}`,
          title: `+${amount} XP Earned! ⚡`,
          message: reason,
          type: 'reward',
          time: 'Just now',
          read: false
        },
        ...prevNotes
      ]);

      return {
        ...prev,
        xp: currentLifetimeXp,
        todayXp: currentTodayXp,
        level: currentLevel,
        xpToNextLevel: xpRequired,
        unlockedBadges: newBadge ? [...prev.unlockedBadges, newBadge] : prev.unlockedBadges
      };
    });
  };

  const dismissLevelUp = () => setLevelUpInfo(null);

  const deleteVaultTask = (id: string) => {
    soundFx.playClick();
    setVaultTasks(prev => prev.filter(t => t.id !== id));
  };

  const resurrectVaultTask = (id: string) => {
    const task = vaultTasks.find(t => t.id === id);
    if (!task) return;
    
    soundFx.playLevelUp();
    setVaultTasks(prev => prev.filter(t => t.id !== id));
    
    // add to today's task list
    const resurrected: Task = { ...task, date: todayStr, completed: false, hasAwardedXp: false };
    updateTodayRecord({ tasks: [resurrected, ...tasks] });
  };

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'date'>) => {
    soundFx.playClick();
    const task: Task = {
      ...newTask,
      priority: normalizePriority(newTask.priority),
      id: `t-${Date.now()}`,
      completed: false,
      hasAwardedXp: false,
      date: todayStr
    };
    updateTodayRecord({ tasks: [task, ...tasks] });
    addXp(15, `Added new mission: ${task.title}`);
  };

  const toggleTask = (id: string) => {
    updateTodayRecord({
      tasks: tasks.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          let nextAwarded = t.hasAwardedXp || false;
          if (nextCompleted) {
            soundFx.playPunch();
            if (!t.hasAwardedXp) {
              addXp(t.xpReward, `Completed mission: ${t.title}`);
              nextAwarded = true;
            }
          } else {
            soundFx.playClick();
          }
          return {
            ...t,
            completed: nextCompleted,
            hasAwardedXp: nextAwarded,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    });
  };

  const deleteTask = (id: string) => {
    soundFx.playClick();
    updateTodayRecord({ tasks: tasks.filter(t => t.id !== id) });
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    soundFx.playClick();
    updateTodayRecord({
      tasks: tasks.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.priority) {
            updated.priority = normalizePriority(updates.priority);
          }
          return updated;
        }
        return t;
      })
    });
  };

  const toggleStarTask = (id: string) => {
    soundFx.playClick();
    updateTodayRecord({ tasks: tasks.map(t => (t.id === id ? { ...t, starred: !t.starred } : t)) });
  };

  const addFoodLog = (food: Omit<FoodItem, 'id' | 'timestamp'>) => {
    soundFx.playPunch();
    const newFood: FoodItem = {
      ...food,
      consumed: food.consumed ?? false,
      id: `f-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateTodayRecord({ loggedFoods: [newFood, ...loggedFoods] });
  };

  const deleteFoodLog = (id: string) => {
    soundFx.playClick();
    updateTodayRecord({ loggedFoods: loggedFoods.filter(f => f.id !== id) });
  };

  const updateFoodLog = (id: string, updates: Partial<FoodItem>) => {
    soundFx.playClick();
    updateTodayRecord({ loggedFoods: loggedFoods.map(f => (f.id === id ? { ...f, ...updates } : f)) });
  };

  const todayNutrition = useMemo(() => {
    const base = loggedFoods
      .filter(item => item.consumed)
      .reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
          fiber: acc.fiber + item.fiber
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );

    if (todayRecord.proteinOverride !== undefined) {
      base.protein = todayRecord.proteinOverride;
    }

    return base;
  }, [loggedFoods, todayRecord.proteinOverride]);

  const addWater = (amount: number) => {
    soundFx.playWaterDrop();
    const next = Math.min(6000, waterMl + amount);
    if (waterMl < nutritionGoal.water && next >= nutritionGoal.water) {
      soundFx.playLevelUp();
      confetti({ particleCount: 60, spread: 50, colors: ['#3b82f6', '#60a5fa', '#ffffff'] });
    }
    updateTodayRecord({ waterMl: next });
  };

  const addCreatine = (amount: number) => {
    soundFx.playLevelUp();
    updateTodayRecord({ creatineGrams: creatineGrams + amount });
  };

  const updateDailyProtein = (date: string, amount: number): boolean => {
    if (amount < 0 || isNaN(amount)) return false;
    soundFx.playPunch();
    setDailyData(prev => {
      const existing = prev[date];
      if (existing) {
        return {
          ...prev,
          [date]: {
            ...existing,
            proteinOverride: amount
          }
        };
      } else {
        return {
          ...prev,
          [date]: {
            date,
            dayNumber: Object.keys(prev).length + 1,
            tasks: [],
            loggedFoods: [],
            waterMl: 0,
            creatineGrams: 0,
            hasAwardedStreak: false,
            proteinOverride: amount
          }
        };
      }
    });
    return true;
  };

  const updateReminderSetting = (key: ReminderSetting['key'], time: string, enabled: boolean) => {
    soundFx.playClick();
    setReminderSettings(prev =>
      prev.map(r => (r.key === key ? { ...r, time, enabled } : r))
    );
  };

  const updateMealReminder = (id: string, time: string, enabled: boolean) => {
    soundFx.playClick();
    setMealReminders(prev =>
      prev.map(mr => (mr.id === id ? { ...mr, time, enabled } : mr))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    soundFx.playClick();
    setNotifications([]);
  };

  const exportAppData = () => {
    const data = {
      auth,
      user,
      dailyData,
      vaultTasks,
      nutritionGoal,
      nutritionHistory,
      reminderSettings,
      mealReminders,
      notifications,
      completedUntilDate,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importAppData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) setUser(data.user);
      if (data.dailyData) {
        const cleaned: Record<string, DailyRecord> = {};
        for (const [k, v] of Object.entries(data.dailyData as Record<string, DailyRecord>)) {
          cleaned[k] = { ...v, tasks: cleanTasks(v.tasks) };
        }
        setDailyData(cleaned);
      }
      if (data.vaultTasks) setVaultTasks(cleanTasks(data.vaultTasks));
      if (data.nutritionGoal) setNutritionGoal(data.nutritionGoal);
      if (data.nutritionHistory) setNutritionHistory(data.nutritionHistory);
      if (data.reminderSettings) setReminderSettings(data.reminderSettings);
      if (data.mealReminders) setMealReminders(data.mealReminders);
      if (data.notifications) setNotifications(data.notifications);
      if (data.completedUntilDate) setCompletedUntilDate(data.completedUntilDate);

      soundFx.playLevelUp();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    soundFx.playClick();
    setUser(DEFAULT_USER_PROFILE);
    setDailyData({});
    setVaultTasks([]);
    setCompletedUntilDate(null);
    setNutritionGoal(DEFAULT_NUTRITION_GOAL);
    setNutritionHistory(DEFAULT_NUTRITION_HISTORY);
    setReminderSettings(DEFAULT_REMINDER_SETTINGS);
    setMealReminders(DEFAULT_MEAL_REMINDERS);
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  const getHistoricalData = () => {
    return Object.values(dailyData).sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated: auth.isAuthenticated,
        currentUser: auth.user,
        loginUser,
        logoutUser,
        activeTab,
        setActiveTab,
        user,
        setUser,
        addXp,
        levelUpInfo,
        dismissLevelUp,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        toggleStarTask,
        nutritionGoal,
        setNutritionGoal,
        loggedFoods,
        addFoodLog,
        deleteFoodLog,
        updateFoodLog,
        todayNutrition,
        waterMl,
        addWater,
        creatineGrams,
        addCreatine,
        nutritionHistory,
        setNutritionHistory,
        dailyData,
        getHistoricalData,
        updateDailyProtein,
        reminderSettings,
        updateReminderSetting,
        mealReminders,
        updateMealReminder,
        notifications,
        markNotificationRead,
        clearNotifications,
        isSettingsOpen,
        setIsSettingsOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        exportAppData,
        importAppData,
        vaultTasks,
        deleteVaultTask,
        resurrectVaultTask,
        resetToDefaults,
        nextDayAction,
        todayStr,
        dayOffset,
        setDayOffset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
