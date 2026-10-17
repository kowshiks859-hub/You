import {
  Badge,
  DailyConsistencyRecord,
  DailyNutritionRecord,
  DaySchedule,
  FoodItem,
  MealReminder,
  NotificationItem,
  NutritionGoal,
  ReminderSetting,
  Task,
  UserProfile,
  WeeklyGoal
} from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Spider Hero',
  title: 'Web-Slinger Supreme',
  level: 1,
  xp: 0,
  todayXp: 0,
  currentDayNumber: 1,
  xpToNextLevel: 800,
  currentStreak: 0,
  hp: 100,
  maxHp: 100,
  bestStreak: 0,
  milestone30Claimed: false,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  soundEnabled: true,
  hapticEnabled: true,
  notificationsEnabled: true,
  weeklyPlannerText: 'THIS WEEK\n\nBuild a website\nComplete Python assignment\nStudy Java',
  monthlyPlannerText: 'THIS MONTH\n\nBuild project\nFinish course\nLearn topic',
  unlockedBadges: [
    {
      id: 'b1',
      title: 'Web Slinger',
      description: 'Reached Level 10 and maintained a 10-day streak.',
      icon: '🕷️',
      unlockedAt: '2026-08-01',
      rarity: 'epic'
    }
  ]
};

export const ALL_AVAILABLE_BADGES: Badge[] = [
  { id: 'b1', title: 'Web Slinger', description: 'Reached Level 10 and maintained a 10-day streak.', icon: '🕷️', rarity: 'epic' },
  { id: 'b2', title: 'Hydration Hero', description: 'Logged 3,000ml of water 5 days in a row.', icon: '💧', rarity: 'rare' },
  { id: 'b3', title: 'Protein Master', description: 'Hit 160g+ daily protein goal 7 times.', icon: '🥩', rarity: 'rare' },
  { id: 'b4', title: 'Polyglot Voice', description: 'Completed 10 interactive English speaking sessions.', icon: '🎙️', rarity: 'epic' },
  { id: 'b5', title: 'Iron Will', description: 'Completed all High-Priority tasks before 5 PM.', icon: '🛡️', rarity: 'legendary' },
  { id: 'b6', title: 'Night Owl Focus', description: 'Completed deep work weekly goals.', icon: '🦉', rarity: 'common' },
  { id: 'b7', title: 'Master Chef AI', description: 'Scanned 15 meals with AI camera.', icon: '📸', rarity: 'rare' }
];

export const DEFAULT_NUTRITION_GOAL: NutritionGoal = {
  protein: 160,
  calories: 2200,
  carbs: 220,
  fat: 65,
  fiber: 30,
  water: 3000,
  creatine: 5
};

export const DEFAULT_REMINDER_SETTINGS: ReminderSetting[] = [
  { id: 'rem-1', key: 'breakfast', label: 'Breakfast Reminder', time: '08:30', enabled: true },
  { id: 'rem-2', key: 'lunch', label: 'High-Protein Lunch', time: '13:00', enabled: true },
  { id: 'rem-3', key: 'snack', label: 'Evening Fuel / Snack', time: '16:30', enabled: true },
  { id: 'rem-4', key: 'dinner', label: 'Clean Dinner & Recovery', time: '20:30', enabled: true },
  { id: 'rem-5', key: 'water', label: 'Hydration Water Ping', time: '11:00', enabled: true },
  { id: 'rem-6', key: 'english', label: '20-Min English Practice', time: '18:00', enabled: true }
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Build a website',
    priority: 'major',
    completed: false,
    hasAwardedXp: false,
    xpReward: 100,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-2',
    title: 'Study Java',
    priority: 'medium',
    completed: false,
    hasAwardedXp: false,
    xpReward: 50,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-default-1',
    title: 'Brush × 2',
    priority: 'low',
    completed: false,
    hasAwardedXp: false,
    isDefaultTask: true,
    xpReward: 25,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-default-2',
    title: 'Drink 3 Liters of Water',
    priority: 'low',
    completed: false,
    hasAwardedXp: false,
    isDefaultTask: true,
    xpReward: 25,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-default-4',
    title: 'Eat Green Stuff',
    priority: 'low',
    completed: false,
    hasAwardedXp: false,
    isDefaultTask: true,
    xpReward: 25,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 't-default-5',
    title: 'Face Exercise',
    priority: 'low',
    completed: false,
    hasAwardedXp: false,
    isDefaultTask: true,
    xpReward: 25,
    date: new Date().toISOString().split('T')[0],
  }
];

export const DEFAULT_FOOD_LOGS: FoodItem[] = [
  {
    id: 'fl-1',
    name: 'Egg White Omelet with Avocado & Oats',
    weightGrams: 350,
    calories: 480,
    protein: 38,
    carbs: 45,
    fat: 14,
    fiber: 8,
    timestamp: '08:45',
    mealType: 'breakfast',
    ingredients: [
      { id: 'i1', name: 'Egg Whites (6)', grams: 200, calories: 104, protein: 22, carbs: 1, fat: 0, fiber: 0 },
      { id: 'i2', name: 'Rolled Oats', grams: 50, calories: 190, protein: 6, carbs: 34, fat: 3, fiber: 5 },
      { id: 'i3', name: 'Avocado Slices', grams: 60, calories: 96, protein: 1, carbs: 5, fat: 9, fiber: 3 },
      { id: 'i4', name: 'Spinach & Peppers', grams: 40, calories: 90, protein: 9, carbs: 5, fat: 2, fiber: 0 }
    ]
  },
  {
    id: 'fl-2',
    name: 'Grilled Chicken Breast with Brown Rice & Broccoli',
    weightGrams: 420,
    calories: 620,
    protein: 56,
    carbs: 60,
    fat: 12,
    fiber: 6,
    timestamp: '13:15',
    mealType: 'lunch',
    ingredients: [
      { id: 'i5', name: 'Grilled Chicken Breast', grams: 200, calories: 330, protein: 46, carbs: 0, fat: 7, fiber: 0 },
      { id: 'i6', name: 'Brown Rice', grams: 150, calories: 215, protein: 5, carbs: 45, fat: 2, fiber: 2 },
      { id: 'i7', name: 'Steamed Broccoli', grams: 70, calories: 75, protein: 5, carbs: 15, fat: 3, fiber: 4 }
    ]
  },
  {
    id: 'fl-3',
    name: 'Whey Isolate Protein Shake',
    weightGrams: 300,
    calories: 140,
    protein: 30,
    carbs: 2,
    fat: 1,
    fiber: 0,
    timestamp: '16:45',
    mealType: 'snack',
    ingredients: [
      { id: 'i8', name: 'Whey Protein Isolate', grams: 35, calories: 140, protein: 30, carbs: 2, fat: 1, fiber: 0 }
    ]
  }
];

// 30 Days of permanent Historical Nutrition & Weight Data
export const DEFAULT_NUTRITION_HISTORY: DailyNutritionRecord[] = [
  { date: '2026-08-07', dayLabel: 'Today', calories: 1240, protein: 124, carbs: 107, fat: 27, fiber: 14, waterMl: 2250, creatineGrams: 5, bodyWeightKg: 73.8 },
  { date: '2026-08-06', dayLabel: 'Yesterday', calories: 2180, protein: 168, carbs: 215, fat: 62, fiber: 32, waterMl: 3100, creatineGrams: 5, bodyWeightKg: 74.0 },
  { date: '2026-08-05', dayLabel: 'Wed 5', calories: 2240, protein: 162, carbs: 230, fat: 64, fiber: 29, waterMl: 3000, creatineGrams: 5, bodyWeightKg: 73.9 },
  { date: '2026-08-04', dayLabel: 'Tue 4', calories: 1950, protein: 148, carbs: 190, fat: 58, fiber: 25, waterMl: 2700, creatineGrams: 5, bodyWeightKg: 74.1 },
  { date: '2026-08-03', dayLabel: 'Mon 3', calories: 2290, protein: 172, carbs: 240, fat: 66, fiber: 34, waterMl: 3200, creatineGrams: 5, bodyWeightKg: 74.2 },
  { date: '2026-08-02', dayLabel: 'Sun 2', calories: 2100, protein: 155, carbs: 210, fat: 60, fiber: 28, waterMl: 2900, creatineGrams: 5, bodyWeightKg: 74.3 },
  { date: '2026-08-01', dayLabel: 'Sat 1', calories: 2350, protein: 165, carbs: 250, fat: 68, fiber: 31, waterMl: 3300, creatineGrams: 5, bodyWeightKg: 74.4 },
  { date: '2026-07-31', dayLabel: 'Jul 31', calories: 2150, protein: 158, carbs: 220, fat: 61, fiber: 30, waterMl: 3000, creatineGrams: 5, bodyWeightKg: 74.4 },
  { date: '2026-07-30', dayLabel: 'Jul 30', calories: 2210, protein: 164, carbs: 225, fat: 63, fiber: 33, waterMl: 3150, creatineGrams: 5, bodyWeightKg: 74.5 },
  { date: '2026-07-29', dayLabel: 'Jul 29', calories: 2080, protein: 152, carbs: 205, fat: 59, fiber: 27, waterMl: 2800, creatineGrams: 5, bodyWeightKg: 74.6 },
  { date: '2026-07-28', dayLabel: 'Jul 28', calories: 2260, protein: 170, carbs: 235, fat: 65, fiber: 31, waterMl: 3200, creatineGrams: 5, bodyWeightKg: 74.6 },
  { date: '2026-07-27', dayLabel: 'Jul 27', calories: 2190, protein: 160, carbs: 218, fat: 62, fiber: 29, waterMl: 3050, creatineGrams: 5, bodyWeightKg: 74.7 },
  { date: '2026-07-26', dayLabel: 'Jul 26', calories: 2050, protein: 146, carbs: 200, fat: 57, fiber: 26, waterMl: 2750, creatineGrams: 5, bodyWeightKg: 74.8 },
  { date: '2026-07-25', dayLabel: 'Jul 25', calories: 2310, protein: 166, carbs: 245, fat: 67, fiber: 32, waterMl: 3250, creatineGrams: 5, bodyWeightKg: 74.8 }
];

export const DEFAULT_MEAL_REMINDERS: MealReminder[] = [
  { id: 'mr-1', meal: 'breakfast', label: 'Superhero Breakfast', time: '08:30', enabled: true },
  { id: 'mr-2', meal: 'lunch', label: 'High-Protein Lunch', time: '13:00', enabled: true },
  { id: 'mr-3', meal: 'snack', label: 'Afternoon Fuel / Shake', time: '16:30', enabled: true },
  { id: 'mr-4', meal: 'dinner', label: 'Clean Dinner & Recovery', time: '20:30', enabled: true }
];

export const DEFAULT_CONSISTENCY_HISTORY: DailyConsistencyRecord[] = [
  { date: '2026-08-01', dayLetter: 'S', dayName: 'Sat', status: 'completed', xpEarned: 320, completionRate: 95, foodMet: true, waterMet: true, englishMet: true },
  { date: '2026-08-02', dayLetter: 'S', dayName: 'Sun', status: 'completed', xpEarned: 290, completionRate: 90, foodMet: true, waterMet: true, englishMet: true },
  { date: '2026-08-03', dayLetter: 'M', dayName: 'Mon', status: 'completed', xpEarned: 410, completionRate: 100, foodMet: true, waterMet: true, englishMet: true },
  { date: '2026-08-04', dayLetter: 'T', dayName: 'Tue', status: 'average', xpEarned: 220, completionRate: 65, foodMet: true, waterMet: true, englishMet: false },
  { date: '2026-08-05', dayLetter: 'W', dayName: 'Wed', status: 'completed', xpEarned: 380, completionRate: 92, foodMet: true, waterMet: true, englishMet: true },
  { date: '2026-08-06', dayLetter: 'T', dayName: 'Thu', status: 'completed', xpEarned: 350, completionRate: 88, foodMet: true, waterMet: true, englishMet: true },
  { date: '2026-08-07', dayLetter: 'F', dayName: 'Fri', status: 'completed', xpEarned: 275, completionRate: 75, foodMet: true, waterMet: true, englishMet: false }
];

export const DEFAULT_WEEKLY_GOALS: WeeklyGoal[] = [
  { id: 'wg-1', title: 'Hit 160g Protein Goal 6 Days', category: 'fitness', targetDays: 6, completedDays: 5, xpReward: 250, completed: false },
  { id: 'wg-2', title: 'Complete 5 English Voice Sessions', category: 'english', targetDays: 5, completedDays: 4, xpReward: 200, completed: false },
  { id: 'wg-3', title: 'Drink 3L Water Every Day', category: 'fitness', targetDays: 7, completedDays: 6, xpReward: 220, completed: false },
  { id: 'wg-4', title: 'Deploy Spider Tracker PWA', category: 'coding', targetDays: 7, completedDays: 6, xpReward: 300, completed: true }
];

export const DEFAULT_DAY_SCHEDULES: DaySchedule[] = [
  {
    dayName: 'Monday',
    tasks: [
      { id: 'dt-1', title: 'Sprint Kickoff & Architecture Planning', time: '09:30', completed: true },
      { id: 'dt-2', title: 'Upper Body Hypertrophy Session', time: '17:30', completed: true }
    ],
    nutritionMet: true,
    englishMet: true
  },
  {
    dayName: 'Tuesday',
    tasks: [
      { id: 'dt-3', title: 'Build Database Indexing & Schemas', time: '11:00', completed: true },
      { id: 'dt-4', title: 'Evening 20-min English Mock Interview', time: '19:00', completed: true }
    ],
    nutritionMet: true,
    englishMet: true
  },
  {
    dayName: 'Wednesday',
    tasks: [
      { id: 'dt-5', title: 'AI Food Scanner Calibration', time: '10:00', completed: true },
      { id: 'dt-6', title: 'Deep Work React Performance Optimization', time: '14:00', completed: false },
      { id: 'dt-7', title: 'Legs & Core Strength Workout', time: '18:00', completed: false }
    ],
    nutritionMet: true,
    englishMet: false
  },
  {
    dayName: 'Thursday',
    tasks: [
      { id: 'dt-8', title: 'PWA Service Worker Cache Audit', time: '10:30', completed: false },
      { id: 'dt-9', title: 'Web Speech API Accent Stress Testing', time: '16:00', completed: false }
    ],
    nutritionMet: false,
    englishMet: false
  },
  {
    dayName: 'Friday',
    tasks: [
      { id: 'dt-10', title: 'Ship Production Release to Live Hosting', time: '11:00', completed: false },
      { id: 'dt-11', title: 'Weekly Performance Review & Debrief', time: '17:00', completed: false }
    ],
    nutritionMet: false,
    englishMet: false
  },
  {
    dayName: 'Saturday',
    tasks: [
      { id: 'dt-12', title: 'Outdoor 5K Run & Mobility Recovery', time: '09:00', completed: false },
      { id: 'dt-13', title: 'Read 2 Tech Whitepapers on Agentic AI', time: '15:00', completed: false }
    ],
    nutritionMet: false,
    englishMet: false
  },
  {
    dayName: 'Sunday',
    tasks: [
      { id: 'dt-14', title: 'Meal Prep & Macro Grocery Run', time: '11:00', completed: false },
      { id: 'dt-15', title: 'AI Sprint Planning for Next Week', time: '18:00', completed: false }
    ],
    nutritionMet: false,
    englishMet: false
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Hydration Target Near! 💧',
    message: 'You have logged 2,250ml of water today. Just 750ml left to complete your daily mission (+40 XP)!',
    type: 'reminder',
    time: '15 mins ago',
    read: false,
    actionUrl: 'food'
  },
  {
    id: 'n-2',
    title: '12-Day Streak Active 🔥',
    message: 'Awesome discipline Spider Hero! Complete today to push your streak to lucky 13.',
    type: 'streak',
    time: '2 hours ago',
    read: false,
    actionUrl: 'dashboard'
  },
  {
    id: 'n-3',
    title: 'Level 14 Milestone Reached! 🏆',
    message: 'You unlocked the Web Slinger badge and 250 bonus XP.',
    type: 'reward',
    time: '1 day ago',
    read: true,
    actionUrl: 'dashboard'
  }
];
