const fs = require('fs');

const fileContent = `import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
  DailyRecord
} from '../types';
import {
  ALL_AVAILABLE_BADGES,
  DEFAULT_FOOD_LOGS,
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

interface AppContextType {
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
  nutritionHistory: DailyNutritionRecord[]; // Maintained for backward compatibility or general history
  setNutritionHistory: React.Dispatch<React.SetStateAction<DailyNutritionRecord[]>>;
  
  // New daily data architecture
  dailyData: Record<string, DailyRecord>;
  getHistoricalData: () => DailyRecord[];

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'spider_tracker_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(\`Error loading \${key} from storage:\`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(\`Error saving \${key} to storage:\`, e);
  }
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() =>
    loadFromStorage('auth', {
      isAuthenticated: true,
      user: { name: 'Spider Hero', username: 'spiderhero' }
    })
  );

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => loadFromStorage('user_profile', DEFAULT_USER_PROFILE));
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // --- DAILY DATE-BASED STATE ---
  const [dailyData, setDailyData] = useState<Record<string, DailyRecord>>(() => {
    return loadFromStorage('daily_records', {});
  });

  const todayStr = getTodayString();
  const currentDayNumber = user.currentDayNumber || 1;

  // Initialize today's record if it doesn't exist
  useEffect(() => {
    setDailyData(prev => {
      if (!prev[todayStr]) {
        // Did we miss days? If yesterday doesn't exist and the day before doesn't exist, we broke streak?
        // Let's just create an empty state. The streak logic will be verified below.
        
        // Wait, what if we are migrating from the old global state?
        const isMigration = Object.keys(prev).length === 0;
        
        return {
          ...prev,
          [todayStr]: {
            date: todayStr,
            dayNumber: currentDayNumber,
            tasks: isMigration ? loadFromStorage('tasks', DEFAULT_TASKS) : DEFAULT_TASKS,
            loggedFoods: isMigration ? loadFromStorage('logged_foods', []) : [],
            waterMl: isMigration ? loadFromStorage('water_ml', 0) : 0,
            creatineGrams: isMigration ? loadFromStorage('creatine_g', 0) : 0,
            hasAwardedStreak: false,
          }
        };
      }
      return prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayStr]);

  // Derived current day data
  const todayRecord = dailyData[todayStr] || {
    date: todayStr,
    dayNumber: currentDayNumber,
    tasks: DEFAULT_TASKS,
    loggedFoods: [],
    waterMl: 0,
    creatineGrams: 0,
    hasAwardedStreak: false,
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

  // Check streak
  useEffect(() => {
    const todayRec = dailyData[todayStr];
    if (!todayRec || todayRec.hasAwardedStreak) return;

    // Check if yesterday existed. If not, streak is broken, UNLESS it's day 1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayRec = dailyData[yesterdayStr];
    if (!yesterdayRec && user.currentStreak > 0 && Object.keys(dailyData).length > 1) {
       // Streak broken
       setUser(prev => ({ ...prev, currentStreak: 0, todayXp: 0 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayStr]);

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
          id: \`note-\${Date.now()}\`,
          title: \`+\${amount} XP Earned! ⚡\`,
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

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'date'>) => {
    soundFx.playClick();
    const task: Task = {
      ...newTask,
      id: \`t-\${Date.now()}\`,
      completed: false,
      hasAwardedXp: false,
      date: todayStr
    };
    updateTodayRecord({ tasks: [task, ...tasks] });
    addXp(15, \`Added new mission: \${task.title}\`);
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
              addXp(t.xpReward, \`Completed mission: \${t.title}\`);
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
    updateTodayRecord({ tasks: tasks.map(t => (t.id === id ? { ...t, ...updates } : t)) });
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
      id: \`f-\${Date.now()}\`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    updateTodayRecord({ loggedFoods: [newFood, ...loggedFoods] });
    addXp(40, \`Logged food: \${food.name}\`);
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
    return loggedFoods
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
  }, [loggedFoods]);

  const addWater = (amount: number) => {
    soundFx.playWaterDrop();
    const next = Math.min(6000, waterMl + amount);
    if (waterMl < nutritionGoal.water && next >= nutritionGoal.water) {
      soundFx.playLevelUp();
      confetti({ particleCount: 60, spread: 50, colors: ['#3b82f6', '#60a5fa', '#ffffff'] });
      addXp(50, 'Reached daily Hydration Goal! 💧');
    } else {
      addXp(10, \`Drank +\${amount}ml water\`);
    }
    updateTodayRecord({ waterMl: next });
  };

  const addCreatine = (amount: number) => {
    soundFx.playLevelUp();
    updateTodayRecord({ creatineGrams: creatineGrams + amount });
    addXp(20, \`Logged \${amount}g Creatine fuel\`);
  };

  // Automatically check if day requirements are met for streak
  useEffect(() => {
    const todayRec = dailyData[todayStr];
    if (!todayRec) return;
    if (todayRec.hasAwardedStreak) return;

    const nutritionMet = todayNutrition.protein >= nutritionGoal.protein;
    const highTasks = tasks.filter(t => t.priority === 'high');
    const allHighCompleted = highTasks.length > 0 && highTasks.every(t => t.completed);

    if (nutritionMet || allHighCompleted) {
      // Award streak
      let newStreak = user.currentStreak + 1;
      let claim30 = user.milestone30Claimed;
      if (newStreak >= 30 && !claim30) {
        addXp(100, "30-Day Streak Bonus! 🔥");
        claim30 = true;
      }
      
      soundFx.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#e52521', '#facc15', '#1d4ed8', '#15803d']
      });

      setUser(prev => ({
        ...prev,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        milestone30Claimed: claim30
      }));

      updateTodayRecord({ hasAwardedStreak: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayNutrition.protein, nutritionGoal.protein, tasks, todayStr]);

  useEffect(() => {
    const nutritionTask = tasks.find(t => t.isDefaultTask && t.title === 'Complete Nutrition Tracking');
    if (nutritionTask) {
       const isMet = todayNutrition.protein >= nutritionGoal.protein;
       if (isMet && !nutritionTask.completed) {
          toggleTask(nutritionTask.id);
       } else if (!isMet && nutritionTask.completed) {
          updateTodayRecord({ tasks: tasks.map(t => t.id === nutritionTask.id ? { ...t, completed: false } : t) });
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayNutrition.protein, nutritionGoal.protein]);

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
      nutritionGoal,
      nutritionHistory,
      reminderSettings,
      mealReminders,
      notifications,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importAppData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) setUser(data.user);
      if (data.dailyData) setDailyData(data.dailyData);
      if (data.nutritionGoal) setNutritionGoal(data.nutritionGoal);
      if (data.nutritionHistory) setNutritionHistory(data.nutritionHistory);
      if (data.reminderSettings) setReminderSettings(data.reminderSettings);
      if (data.mealReminders) setMealReminders(data.mealReminders);
      if (data.notifications) setNotifications(data.notifications);

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
        resetToDefaults
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
`;

fs.writeFileSync('src/context/AppContext.tsx', fileContent, 'utf8');
