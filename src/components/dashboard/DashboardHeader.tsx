import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Sparkles, Shield } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="py-2 px-1 select-none">
      <div className="flex items-center justify-between bg-white/90 border-2.5 border-comic-black rounded-2xl p-2.5 comic-shadow-sm">
        {/* Profile Avatar & Details */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-11 h-11 rounded-full border-2 border-comic-black object-cover bg-white"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-comic-red text-white text-[9px] font-comic font-black rounded-full border border-comic-black">
              L{user.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-comic text-base tracking-wide uppercase text-stone-900 leading-tight">
                {user.name}
              </h2>
              <Shield className="w-3.5 h-3.5 text-comic-blue" />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-comic-red font-comic">
              {user.title}
            </p>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border-2 border-comic-black rounded-xl comic-shadow-sm flex-shrink-0">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <div className="text-right">
            <span className="font-comic font-black text-xs text-stone-900 leading-none block">
              {user.currentStreak} DAYS
            </span>
            <span className="text-[8px] font-comic uppercase text-orange-600 font-bold leading-none block">
              STREAK 🔥
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
