import { DaySchedule, WeeklyGoal } from '../types';

export interface AssistantResponse {
  answer: string;
  category: 'food' | 'english' | 'productivity' | 'general';
  suggestedActions?: { label: string; actionType: string; payload?: unknown }[];
}

export function queryAiAssistant(userQuery: string): AssistantResponse {
  const query = userQuery.toLowerCase().trim();

  // Food & Nutrition
  if (query.includes('protein') || query.includes('how much protein')) {
    return {
      answer: "For building muscle and staying lean, aim for 1.6 to 2.2 grams of protein per kg of bodyweight (about 0.8–1.0g per lb). Prioritize chicken breast, whole eggs, Greek yogurt, whey isolate, and legumes!",
      category: 'food',
      suggestedActions: [
        { label: '🍗 Quick Log 40g Protein', actionType: 'ADD_PROTEIN_SNACK' },
        { label: '📊 View Nutrition Goals', actionType: 'GOTO_FOOD' }
      ]
    };
  }

  if (query.includes('creatine') || query.includes('timing')) {
    return {
      answer: "Creatine Monohydrate is best taken daily at 5 grams with plenty of water. Timing is flexible, but taking it post-workout with carbs and protein enhances absorption and muscle saturation!",
      category: 'food',
      suggestedActions: [
        { label: '⚡ Log 5g Creatine', actionType: 'ADD_CREATINE_5' }
      ]
    };
  }

  if (query.includes('dinner') || query.includes('suggest dinner') || query.includes('healthy dinner')) {
    return {
      answer: "How about Pan-Seared Salmon (180g) with Steamed Quinoa (1 cup) and Grilled Asparagus or Broccoli? Total ~580 kcal, 48g Protein, 22g Healthy Fats, 42g Complex Carbs. Clean, anti-inflammatory, and easy to digest before sleep!",
      category: 'food',
      suggestedActions: [
        { label: '📸 Open Food Scanner', actionType: 'GOTO_FOOD' }
      ]
    };
  }

  if (query.includes('breakfast') || query.includes('healthy breakfast')) {
    return {
      answer: "Top superhero breakfast: 3 Whole Eggs scrambled with a pinch of spinach, 1 slice of toasted sourdough with 1/4 avocado, and a black coffee or green tea. Total: ~420 kcal, 24g Protein, 28g Carbs, 22g Fats.",
      category: 'food',
      suggestedActions: [
        { label: '🍳 Quick Add Eggs & Toast', actionType: 'GOTO_FOOD' }
      ]
    };
  }

  if (query.includes('water') || query.includes('hydration') || query.includes('how much water')) {
    return {
      answer: "Drink at least 3,000ml to 3,500ml of water daily, especially if exercising. Hydration keeps cognitive focus sharp and avoids false hunger signals. Sip throughout the day!",
      category: 'food',
      suggestedActions: [
        { label: '💧 Drink 500ml Water Now', actionType: 'ADD_WATER_500' }
      ]
    };
  }

  // English Partner
  if (query.includes('english') || query.includes('speak') || query.includes('grammar') || query.includes('fluency') || query.includes('interview')) {
    return {
      answer: "To boost conversational fluency rapidly: 1) Practice 15-20 minutes daily speaking aloud, 2) Focus on clear intonation and breath pauses, 3) Use transition words like 'Furthermore', 'On the other hand', and 'Specifically'. Ready to jump into a 20-min session?",
      category: 'english',
      suggestedActions: [
        { label: '🎙 Start 20-Min English Session', actionType: 'GOTO_ENGLISH' }
      ]
    };
  }

  // Tasks & Productivity
  if (query.includes('task') || query.includes('priorit') || query.includes('overwhelm') || query.includes('focus')) {
    return {
      answer: "Use the Spider-Priority rule: Pick your TOP 1 High-Priority mission and execute it with a 25-minute Pomodoro focus block before checking messages. Knock out that big win first, then tackle Medium and Low tasks!",
      category: 'productivity',
      suggestedActions: [
        { label: '⚡ Go to Daily Missions', actionType: 'GOTO_DASHBOARD' }
      ]
    };
  }

  if (query.includes('streak') || query.includes('xp') || query.includes('level')) {
    return {
      answer: "You earn XP for logging meals (+30 XP), hitting water goals (+40 XP), completing daily missions (+50-100 XP), and doing English sessions (+100 XP). Tap 'Complete Today' on the dashboard each evening to solidify your streak and unlock bonus multipliers!",
      category: 'productivity',
      suggestedActions: [
        { label: '🏆 Check XP & Level', actionType: 'GOTO_DASHBOARD' }
      ]
    };
  }

  // Default intelligent assistant response
  return {
    answer: `I'm on it! To keep your momentum strong: crush your high-priority daily tasks, log your meals with the AI camera, and get your 20-min English practice in today. Every action powers up your level and builds unbreakable discipline!`,
    category: 'general',
    suggestedActions: [
      { label: '🏠 Dashboard', actionType: 'GOTO_DASHBOARD' },
      { label: '🍽 Food Scanner', actionType: 'GOTO_FOOD' },
      { label: '🎙 English Partner', actionType: 'GOTO_ENGLISH' },
      { label: '📅 Weekly Planner', actionType: 'GOTO_PLANNER' }
    ]
  };
}

export function generateWeeklyPlanAi(focusArea: string = 'balanced'): {
  theme: string;
  goals: WeeklyGoal[];
  schedules: DaySchedule[];
} {
  const baseGoals: Record<string, { title: string; category: WeeklyGoal['category']; xpReward: number }[]> = {
    coding: [
      { title: 'Refactor state engine & add indexedDB caching', category: 'coding', xpReward: 180 },
      { title: 'Build and test offline PWA service worker push', category: 'coding', xpReward: 200 },
      { title: 'Ship 4 pull requests with 100% test coverage', category: 'coding', xpReward: 160 },
      { title: 'Complete 5 English technical standup mocks', category: 'english', xpReward: 140 }
    ],
    fitness: [
      { title: 'Hit 160g+ daily protein 7/7 days straight', category: 'fitness', xpReward: 220 },
      { title: 'Drink 3,200ml water every single day', category: 'fitness', xpReward: 150 },
      { title: 'Complete 4 hypertrophy lifting workouts', category: 'fitness', xpReward: 180 },
      { title: 'AI Food scan every single meal', category: 'fitness', xpReward: 140 }
    ],
    english: [
      { title: 'Complete 7 daily 20-min voice AI sessions', category: 'english', xpReward: 250 },
      { title: 'Practice 20 executive vocabulary upgrades', category: 'english', xpReward: 150 },
      { title: 'Deliver 3 mock system design presentations', category: 'english', xpReward: 180 },
      { title: 'Maintain 92%+ average confidence score', category: 'english', xpReward: 160 }
    ],
    balanced: [
      { title: 'Ship 3 major web app milestones on schedule', category: 'coding', xpReward: 180 },
      { title: 'Hit 160g daily protein & 3L water consistency', category: 'fitness', xpReward: 180 },
      { title: '5x 20-min AI Voice English speaking sessions', category: 'english', xpReward: 180 },
      { title: 'Maintain unbroken 7-day superhero streak', category: 'life', xpReward: 200 }
    ]
  };

  const selected = baseGoals[focusArea] || baseGoals.balanced;

  const fullGoals: WeeklyGoal[] = selected.map((g, idx) => ({
    id: `ai-wg-${Date.now()}-${idx}`,
    title: g.title,
    category: g.category,
    targetDays: 7,
    completedDays: 0,
    xpReward: g.xpReward,
    completed: false
  }));

  const fullSchedules: DaySchedule[] = [
    {
      dayName: 'Monday',
      tasks: [
        { id: `gen-${Date.now()}-1`, title: 'Sprint Kickoff & Core Architecture', time: '09:30', completed: false },
        { id: `gen-${Date.now()}-2`, title: 'Upper Body Workout & 40g Protein Shake', time: '17:30', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Tuesday',
      tasks: [
        { id: `gen-${Date.now()}-3`, title: 'Database Optimization & Indexing', time: '11:00', completed: false },
        { id: `gen-${Date.now()}-4`, title: '20-min English Voice Mock Interview', time: '19:00', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Wednesday',
      tasks: [
        { id: `gen-${Date.now()}-5`, title: 'AI Food Scanner Calibration & Testing', time: '10:00', completed: false },
        { id: `gen-${Date.now()}-6`, title: 'Legs & Core Hypertrophy Session', time: '18:00', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Thursday',
      tasks: [
        { id: `gen-${Date.now()}-7`, title: 'Offline PWA Service Worker Audit', time: '10:30', completed: false },
        { id: `gen-${Date.now()}-8`, title: 'Interactive Fluency Practice', time: '18:30', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Friday',
      tasks: [
        { id: `gen-${Date.now()}-9`, title: 'Ship Production Feature Deployment', time: '11:00', completed: false },
        { id: `gen-${Date.now()}-10`, title: 'Weekly Progress Review & Debrief', time: '17:00', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Saturday',
      tasks: [
        { id: `gen-${Date.now()}-11`, title: 'Outdoor 5K Cardio Run & Mobility', time: '09:00', completed: false },
        { id: `gen-${Date.now()}-12`, title: 'Tech Whitepaper Deep Dive', time: '15:00', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    },
    {
      dayName: 'Sunday',
      tasks: [
        { id: `gen-${Date.now()}-13`, title: 'Meal Prep & Macro Grocery Restock', time: '11:00', completed: false },
        { id: `gen-${Date.now()}-14`, title: 'Weekly Sprint Retrospective', time: '18:00', completed: false }
      ],
      nutritionMet: false,
      englishMet: false
    }
  ];

  return {
    theme: `${focusArea.toUpperCase()} Master Sprint`,
    goals: fullGoals,
    schedules: fullSchedules
  };
}
