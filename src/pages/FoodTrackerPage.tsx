import React from 'react';
import { NutritionSummaryCard } from '../components/food/NutritionSummaryCard';
import { QuickAddStaples } from '../components/food/QuickAddStaples';
import { WaterTrackerBottle } from '../components/food/WaterTrackerBottle';
import { Utensils } from 'lucide-react';

export const FoodTrackerPage: React.FC = () => {
  return (
    <div className="space-y-4 animate-pop-in pb-24">
      {/* Top Banner */}
      <div className="py-2 px-1 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-comic-green text-white border border-comic-black">
              <Utensils className="w-4 h-4" />
            </span>
            <h1 className="font-comic text-xl uppercase tracking-wider text-stone-900 leading-none">
              Food Tracker
            </h1>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 font-comic">
            Daily Macro & Fuel Engine
          </p>
        </div>
      </div>

      {/* 1. Today's Macro Blueprint Card */}
      <NutritionSummaryCard />

      {/* 2. Quick Add Staples & Custom Food Builder */}
      <QuickAddStaples />

      {/* 4. Animated Water Tracker Bottle & Creatine */}
      <WaterTrackerBottle />
    </div>
  );
};
