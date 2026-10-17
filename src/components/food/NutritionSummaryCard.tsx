import React from 'react';
import { useApp } from '../../context/AppContext';
import { ComicCard } from '../common/ComicCard';
import { Utensils, Flame, Droplets, Wheat, Shield, Sparkles, Zap, Plus } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';

export const NutritionSummaryCard: React.FC = () => {
  const { todayNutrition, nutritionGoal, waterMl, creatineGrams, addCreatine } = useApp();

  const macros = [
    {
      name: 'Protein',
      current: Math.round(todayNutrition.protein),
      target: nutritionGoal.protein,
      unit: 'g',
      color: 'bg-comic-red',
      bgColor: 'bg-red-100',
      textColor: 'text-comic-red',
      icon: <Utensils className="w-3.5 h-3.5" />
    },
    {
      name: 'Calories',
      current: Math.round(todayNutrition.calories),
      target: nutritionGoal.calories,
      unit: 'kcal',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      icon: <Flame className="w-3.5 h-3.5" />
    },
    {
      name: 'Carbs',
      current: Math.round(todayNutrition.carbs),
      target: nutritionGoal.carbs,
      unit: 'g',
      color: 'bg-emerald-600',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      icon: <Wheat className="w-3.5 h-3.5" />
    },
    {
      name: 'Fats',
      current: Math.round(todayNutrition.fat),
      target: nutritionGoal.fat,
      unit: 'g',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: <Shield className="w-3.5 h-3.5" />
    },
    {
      name: 'Fiber',
      current: Math.round(todayNutrition.fiber),
      target: nutritionGoal.fiber,
      unit: 'g',
      color: 'bg-stone-700',
      bgColor: 'bg-stone-200',
      textColor: 'text-stone-700',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    {
      name: 'Water',
      current: waterMl,
      target: nutritionGoal.water,
      unit: 'ml',
      color: 'bg-comic-blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-comic-blue',
      icon: <Droplets className="w-3.5 h-3.5" />
    }
  ];

  const creatineTarget = nutritionGoal.creatine || 5;
  const creatinePercent = Math.min(100, Math.round((creatineGrams / creatineTarget) * 100));

  return (
    <ComicCard
      variant="cream"
      title="Today's Macro Blueprint"
      badge={
        <span className="px-2 py-0.5 bg-comic-green text-white font-comic text-xs font-black rounded border border-comic-black">
          SCORPION FUEL
        </span>
      }
      bodyClassName="p-3.5 space-y-3"
    >
      {/* 6 Core Macro & Water Gauges */}
      <div className="grid grid-cols-2 gap-2">
        {macros.map(m => {
          const percent = Math.min(100, Math.round((m.current / m.target) * 100));
          return (
            <div key={m.name} className="p-2 bg-white border border-comic-black rounded-lg comic-shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-comic uppercase font-bold flex items-center gap-1 ${m.textColor}`}>
                  {m.icon} {m.name}
                </span>
                <span className="text-[10px] font-black font-comic text-stone-500">
                  {percent}%
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-0.5">
                <span className="font-comic text-sm font-black text-stone-900 leading-none">
                  {m.current}
                </span>
                <span className="text-[9px] font-bold text-stone-500">
                  / {m.target} {m.unit}
                </span>
              </div>

              {/* Progress bar */}
              <div className={`w-full h-1.5 ${m.bgColor} rounded-full overflow-hidden border border-comic-black/20 mt-1`}>
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Creatine Row */}
      <div className="p-2 bg-purple-50 border border-comic-black rounded-lg flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border border-comic-black bg-purple-600 text-white flex items-center justify-center font-black">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-comic font-black uppercase text-purple-900 leading-none">
                Creatine
              </span>
              <span className="text-[8px] px-1 bg-purple-200 text-purple-900 font-bold rounded">
                5g
              </span>
            </div>
            <span className="text-[9px] font-bold text-purple-700">
              {creatineGrams}g / {creatineTarget}g ({creatinePercent}%)
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playPunch();
            addCreatine(5);
          }}
          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white border border-comic-black rounded-lg font-comic text-[10px] font-black uppercase flex items-center gap-1 active:scale-90 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" /> +5g Dose
        </button>
      </div>
    </ComicCard>
  );
};
