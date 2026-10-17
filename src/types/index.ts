export type ActiveTab = 'dashboard' | 'food' | 'planner' | 'monthly_planner' | 'vault';

export type TaskPriority = 'major' | 'medium' | 'low';

export function normalizePriority(p: any): TaskPriority {
  if (p === 'major' || p === 'high') return 'major';
  if (p === 'medium' || p === 'hot') return 'medium';
  return 'low';
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  hasAwardedXp?: boolean; // Prevents XP farming
  isDefaultTask?: boolean; // Identifies the 5 default tasks
  starred?: boolean;
  reminderTime?: string; // HH:mm
  xpReward: number;
  date: string; // YYYY-MM-DD
  dayOfWeek?: number; // 0: Sun, 1: Mon, etc.
  completedAt?: string;
}

export interface NutritionGoal {
  protein: number; // in grams
  calories: number; // in kcal
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  water: number; // in ml
  creatine: number; // in grams (default 5g)
}

export interface ReminderSetting {
  id: string;
  key: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'water' | 'english';
  label: string;
  time: string; // HH:mm
  enabled: boolean;
}

export interface DetectedIngredient {
  id: string;
  name: string;
  profileImageUrl?: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  name: string;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  consumed?: boolean; // Only consumed foods count towards totals
  imageUrl?: string;
  ingredients?: DetectedIngredient[];
}

export interface DailyNutritionRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Today", "Yesterday", "Wed 5"
  dayNumber?: number; // e.g. 1 for Day 1
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
  creatineGrams: number;
  bodyWeightKg?: number;
}

export interface WaterLogEntry {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface MealReminder {
  id: string;
  meal: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  label: string;
  time: string; // HH:mm
  enabled: boolean;
}

export interface GrammarFix {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabSuggestion {
  original: string;
  suggested: string;
  context: string;
}

export interface PronunciationTip {
  word: string;
  phonetic: string;
  tip: string;
}

export interface DialogueMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface EnglishSessionReport {
  grammarScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  vocabScore: number;
  confidenceScore: number;
  durationSeconds: number;
  topic: string;
  grammarFixes: GrammarFix[];
  vocabSuggestions: VocabSuggestion[];
  pronunciationTips: PronunciationTip[];
  xpEarned: number;
}

export interface EnglishSession {
  id: string;
  date: string;
  durationSeconds: number; // e.g. up to 1200s (20 mins)
  topic: string;
  confidenceScore: number; // 0-100
  speakingScore: number; // 0-100
  grammarScore?: number;
  pronunciationScore?: number;
  vocabScore?: number;
  grammarFixes: GrammarFix[];
  vocabSuggestions: VocabSuggestion[];
  pronunciationTips: PronunciationTip[];
  messages: DialogueMessage[];
  xpEarned: number;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  category?: 'coding' | 'fitness' | 'english' | 'life';
  targetDays: number;
  completedDays: number;
  xpReward: number;
  completed: boolean;
}

export interface DayTask {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
}

export interface DaySchedule {
  dayName: DayOfWeek;
  tasks: DayTask[];
  nutritionMet: boolean;
  englishMet: boolean;
}

export interface DailyConsistencyRecord {
  date: string; // YYYY-MM-DD
  dayLetter: string; // 'M', 'T', 'W', etc.
  dayName: string; // 'Mon', 'Tue', etc.
  status: 'completed' | 'average' | 'missed';
  xpEarned: number;
  completionRate: number; // 0-100%
  foodMet: boolean;
  waterMet: boolean;
  englishMet: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProfile {
  name: string;
  title: string;
  level: number;
  xp: number; // Will represent lifetimeXp moving forward
  todayXp: number; // Today's XP only
  currentDayNumber: number; // e.g. Day 1, Day 2
  xpToNextLevel: number;
  currentStreak: number;
  hp: number;
  maxHp: number;
  bestStreak: number;
  milestone30Claimed: boolean;
  avatarUrl: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  unlockedBadges: Badge[];
  weeklyPlannerText: string;
  monthlyPlannerText: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'reward' | 'streak' | 'system';
  time: string;
  read: boolean;
  actionUrl?: ActiveTab;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    username?: string;
    phone?: string;
  } | null;
}

export interface DailyRecord {
  date: string;
  dayNumber: number;
  tasks: Task[];
  loggedFoods: FoodItem[];
  waterMl: number;
  creatineGrams: number;
  hasAwardedStreak: boolean;
  hasPenalizedHp?: boolean;
  proteinOverride?: number;
  completedAt?: string;
}

