const fs = require('fs');
const path = 'src/types/index.ts';
let content = fs.readFileSync(path, 'utf8');

// Add monthly_planner to ActiveTab
content = content.replace(/export type ActiveTab = 'dashboard' \| 'food' \| 'planner';/, "export type ActiveTab = 'dashboard' | 'food' | 'planner' | 'monthly_planner';");

// Add DailyRecord
const dailyRecordType = `
export interface DailyRecord {
  date: string;
  dayNumber: number;
  tasks: Task[];
  loggedFoods: FoodItem[];
  waterMl: number;
  creatineGrams: number;
  hasAwardedStreak: boolean;
}
`;
content += dailyRecordType;

fs.writeFileSync(path, content, 'utf8');
