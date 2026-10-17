import { DetectedIngredient, FoodItem } from '../types';

export interface FoodScanResult {
  dishName: string;
  confidence: number;
  totalWeightGrams: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  ingredients: DetectedIngredient[];
  detectedCoin: boolean;
  notes: string;
}

const PRESET_DISHES: FoodScanResult[] = [
  {
    dishName: 'Grilled Chicken, Jasmine Rice & Broccoli',
    confidence: 96,
    totalWeightGrams: 420,
    totalCalories: 580,
    totalProtein: 52,
    totalCarbs: 64,
    totalFat: 12,
    totalFiber: 6,
    detectedCoin: true,
    notes: 'High protein lean meal detected. Portions calibrated using 25mm coin scale reference.',
    ingredients: [
      { id: '1', name: 'Grilled Chicken Breast', grams: 200, calories: 330, protein: 44, carbs: 0, fat: 5, fiber: 0 },
      { id: '2', name: 'Steamed Jasmine Rice', grams: 150, calories: 195, protein: 4, carbs: 45, fat: 1, fiber: 1 },
      { id: '3', name: 'Steamed Broccoli Florets', grams: 70, calories: 25, protein: 2.5, carbs: 4, fat: 0.5, fiber: 3 },
      { id: '4', name: 'Virgin Olive Oil Seasoning', grams: 5, calories: 30, protein: 0, carbs: 0, fat: 3.5, fiber: 0 },
    ]
  },
  {
    dishName: 'Scrambled Eggs & Avocado Sourdough',
    confidence: 94,
    totalWeightGrams: 310,
    totalCalories: 510,
    totalProtein: 24,
    totalCarbs: 38,
    totalFat: 30,
    totalFiber: 8,
    detectedCoin: true,
    notes: 'Healthy fats & balanced micronutrients. Good morning sustained energy profile.',
    ingredients: [
      { id: '1', name: 'Farm Fresh Eggs (3 Large)', grams: 150, calories: 215, protein: 18, carbs: 2, fat: 15, fiber: 0 },
      { id: '2', name: 'Toasted Artisanal Sourdough', grams: 80, calories: 185, protein: 6, carbs: 36, fat: 1, fiber: 2 },
      { id: '3', name: 'Hass Avocado Slices', grams: 70, calories: 110, protein: 1.5, carbs: 6, fat: 10, fiber: 5 },
      { id: '4', name: 'Grass-fed Butter', grams: 5, calories: 36, protein: 0, carbs: 0, fat: 4, fiber: 0 }
    ]
  },
  {
    dishName: 'Whey Protein & Banana Smoothie Bowl',
    confidence: 98,
    totalWeightGrams: 450,
    totalCalories: 460,
    totalProtein: 42,
    totalCarbs: 58,
    totalFat: 8,
    totalFiber: 7,
    detectedCoin: false,
    notes: 'Optimal post-workout recovery blend with rapid amino absorption.',
    ingredients: [
      { id: '1', name: 'Whey Protein Isolate (1 Scoop)', grams: 35, calories: 130, protein: 28, carbs: 2, fat: 1, fiber: 0 },
      { id: '2', name: 'Greek Yogurt 0% Fat', grams: 180, calories: 110, protein: 18, carbs: 7, fat: 0, fiber: 0 },
      { id: '3', name: 'Ripe Banana', grams: 120, calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1 },
      { id: '4', name: 'Peanut Butter Creamy', grams: 15, calories: 95, protein: 4, carbs: 3, fat: 8, fiber: 1 },
      { id: '5', name: 'Chia Seeds Topping', grams: 10, calories: 48, protein: 1.7, carbs: 4.2, fat: 3.1, fiber: 3.4 }
    ]
  },
  {
    dishName: 'Pan-Seared Salmon & Quinoa Medley',
    confidence: 92,
    totalWeightGrams: 380,
    totalCalories: 620,
    totalProtein: 48,
    totalCarbs: 42,
    totalFat: 28,
    totalFiber: 6,
    detectedCoin: true,
    notes: 'Rich in Omega-3 DHA/EPA fatty acids, complete amino acids and complex carbohydrates.',
    ingredients: [
      { id: '1', name: 'Atlantic Salmon Fillet', grams: 180, calories: 375, protein: 38, carbs: 0, fat: 24, fiber: 0 },
      { id: '2', name: 'Steamed Tri-Color Quinoa', grams: 140, calories: 170, protein: 6, carbs: 30, fat: 3, fiber: 4 },
      { id: '3', name: 'Shelled Edamame & Greens', grams: 60, calories: 75, protein: 6, carbs: 6, fat: 2.5, fiber: 3 }
    ]
  }
];

export const STAPLE_FOODS: Omit<FoodItem, 'id' | 'timestamp'>[] = [
  { name: 'Green Stuff (Spinach/Greens)', weightGrams: 100, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, mealType: 'lunch' },
  { name: 'Whole Boiled Eggs (2 pcs)', weightGrams: 100, calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, mealType: 'breakfast' },
  { name: 'Grilled Chicken Breast', weightGrams: 150, calories: 248, protein: 46.5, carbs: 0, fat: 5.4, fiber: 0, mealType: 'lunch' },
  { name: 'White / Brown Rice (1 cup)', weightGrams: 160, calories: 210, protein: 4.5, carbs: 46, fat: 0.5, fiber: 1.5, mealType: 'lunch' },
  { name: 'Whole Milk (250ml)', weightGrams: 250, calories: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, mealType: 'snack' },
  { name: 'Natural Peanut Butter (2 tbsp)', weightGrams: 32, calories: 190, protein: 8, carbs: 6, fat: 16, fiber: 2, mealType: 'snack' },
  { name: 'Fresh Banana (Medium)', weightGrams: 118, calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, mealType: 'snack' },
  { name: 'Pure Water Bottle (500ml)', weightGrams: 500, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, mealType: 'snack' },
];

export async function simulateFoodScan(imageDataUrl?: string): Promise<FoodScanResult> {
  // Simulate AI inference latency with targeting scan animation
  await new Promise(r => setTimeout(r, 1400));
  
  // Pick preset based on random index or seeded sequence
  const result = PRESET_DISHES[Math.floor(Math.random() * PRESET_DISHES.length)];
  return JSON.parse(JSON.stringify(result));
}

export function recalculateDishNutrition(ingredients: DetectedIngredient[]) {
  return ingredients.reduce(
    (acc, ing) => {
      acc.totalWeightGrams += ing.grams;
      acc.totalCalories += ing.calories;
      acc.totalProtein += ing.protein;
      acc.totalCarbs += ing.carbs;
      acc.totalFat += ing.fat;
      acc.totalFiber += ing.fiber;
      return acc;
    },
    { totalWeightGrams: 0, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 }
  );
}
