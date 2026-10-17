import React from 'react';
import { useApp } from '../../context/AppContext';
import { ComicCard } from '../common/ComicCard';
import { ComicButton } from '../common/ComicButton';
import { Droplets, Plus, Sparkles, Check } from 'lucide-react';

export const WaterTrackerBottle: React.FC = () => {
  const { waterMl, addWater, nutritionGoal } = useApp();

  const fillPercent = Math.min(100, Math.round((waterMl / nutritionGoal.water) * 100));

  return (
    <ComicCard
      variant="white"
      title="Hydration Chamber"
      subtitle="Interactive Bottle"
      badge={
        <span className="px-2 py-0.5 bg-comic-blue text-white font-comic text-xs font-black rounded border border-comic-black">
          {fillPercent}% FILLED
        </span>
      }
      className="mt-4"
      bodyClassName="p-3.5"
    >
      <div className="flex items-center gap-3">
        {/* Animated Comic Water Bottle SVG */}
        <div
          onClick={() => addWater(250)}
          className="relative w-20 h-32 flex-shrink-0 cursor-pointer group flex flex-col items-center justify-end select-none active:scale-95 transition-transform"
          title="Tap bottle to add +250ml!"
        >
          {/* Bottle Cap */}
          <div className="w-6 h-2 bg-stone-900 border-[1.5px] border-comic-black rounded-t-md z-10" />
          {/* Bottle Neck */}
          <div className="w-4 h-1.5 bg-stone-200 border-x-[1.5px] border-comic-black z-10" />

          {/* Bottle Body */}
          <div className="w-16 h-28 bg-sky-50/90 border-2 border-comic-black rounded-xl relative overflow-hidden comic-shadow-sm">
            {/* Water Wave Level Fill */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-sky-500 to-sky-400 transition-all duration-700 ease-out"
              style={{ height: `${fillPercent}%` }}
            >
              {/* Wave shimmer line */}
              <div className="absolute -top-1 left-0 right-0 h-1.5 bg-white/40 rounded-full animate-pulse" />
            </div>

            {/* Scale markings */}
            <div className="absolute inset-y-2 right-1 flex flex-col justify-between items-end opacity-40 pointer-events-none">
              <span className="w-1.5 h-[1.5px] bg-comic-black" />
              <span className="w-2.5 h-[1.5px] bg-comic-black" />
              <span className="w-1.5 h-[1.5px] bg-comic-black" />
              <span className="w-2.5 h-[1.5px] bg-comic-black" />
            </div>

            {/* Center ML text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="font-comic font-black text-[10px] text-stone-900 drop-shadow-sm">
                {waterMl}
              </span>
              <span className="text-[7px] font-bold uppercase tracking-wider text-stone-700">
                ML
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-comic uppercase text-stone-700 font-bold">
              Current Intake
            </span>
            <span className="font-comic font-black text-xs text-comic-blue">
              {waterMl} <span className="text-[10px] text-stone-500 font-sans font-bold">/ {nutritionGoal.water} ml</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => addWater(250)}
              className="py-1.5 bg-sky-100 hover:bg-sky-200 border-[1.5px] border-comic-black rounded-lg font-comic text-[10px] font-black text-stone-900 transition-all active:scale-90 comic-shadow-sm flex flex-col items-center justify-center"
            >
              <Droplets className="w-3 h-3 text-comic-blue mb-0.5" />
              +250ml
            </button>

            <button
              onClick={() => addWater(500)}
              className="py-1.5 bg-blue-100 hover:bg-blue-200 border-[1.5px] border-comic-black rounded-lg font-comic text-[10px] font-black text-stone-900 transition-all active:scale-90 comic-shadow-sm flex flex-col items-center justify-center"
            >
              <Droplets className="w-3 h-3 text-comic-blue mb-0.5" />
              +500ml
            </button>

            <button
              onClick={() => addWater(1000)}
              className="py-1.5 bg-blue-600 hover:bg-blue-700 border-[1.5px] border-comic-black rounded-lg font-comic text-[10px] font-black text-white transition-all active:scale-90 comic-shadow-sm flex flex-col items-center justify-center"
            >
              <Droplets className="w-3 h-3 text-white mb-0.5" />
              +1.0L
            </button>
          </div>

          <p className="text-[10px] text-stone-500 font-semibold leading-tight pt-1">
            💧 Tap the bottle or buttons to log hydration. Hitting 3,000ml awards +50 XP!
          </p>
        </div>
      </div>
    </ComicCard>
  );
};
