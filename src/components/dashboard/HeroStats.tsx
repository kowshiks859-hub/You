import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Shield, Flame, Trophy } from 'lucide-react';
import { ComicCard } from '../common/ComicCard';

export const HeroStats: React.FC = () => {
  const { user, setUser } = useApp();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Level progress based on lifetime xp vs threshold (800)
  const xpInCurrentLevel = user.xp % 800;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 800) * 100));

  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Basic client-side resize to prevent huge localStorage sizes
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setUser(prev => ({ ...prev, avatarUrl: compressedBase64 }));
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <ComicCard variant="white" className="mt-2" bodyClassName="p-3">
      <div className="flex items-center justify-between mb-3 border-b-2 border-stone-200 pb-2">
         <h1 className="font-comic text-xl tracking-widest uppercase text-comic-blue">
            DAY {user.currentDayNumber}
         </h1>
         {/* Current Streak Callout */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 border-2 border-comic-black rounded-lg comic-shadow-sm">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500 animate-pulse" />
            <span className="font-comic text-xs font-black text-orange-950 uppercase">
              {user.currentStreak} Days
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Avatar & Info */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-comic-black object-cover bg-white"
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleProfileImageChange} 
              className="hidden" 
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 bg-comic-red text-white text-[9px] font-comic font-black rounded-full border border-comic-black">
              L{user.level}
            </span>
          </div>
          <div>
            <h2 className="font-comic text-sm tracking-wide uppercase text-stone-900 leading-tight flex items-center gap-1">
              {user.name} <Shield className="w-3.5 h-3.5 text-comic-blue" />
            </h2>
            <p className="font-comic text-xs font-black uppercase text-stone-900 tracking-wide mt-0.5">
              {user.xp.toLocaleString()} <span className="text-[10px] text-stone-500 font-sans font-bold">LIFETIME XP</span>
            </p>
          </div>
        </div>
        
        <div className="text-right">
            <span className="block font-comic text-xs font-black text-comic-green">+ {user.todayXp.toLocaleString()} XP</span>
            <span className="block text-[9px] font-extrabold text-stone-500 font-comic uppercase tracking-wider">TODAY</span>
        </div>
      </div>

      {/* Animated Comic XP Bar */}
      <div className="relative w-full h-3 bg-stone-200 border-2 border-comic-black rounded-full overflow-hidden p-px mt-2">
        <div
          className="h-full bg-gradient-to-r from-comic-blue to-cyan-400 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1"
          style={{ width: `${xpPercent}%` }}
        >
          <div className="w-1 h-1 rounded-full bg-white animate-ping" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-1 text-[9px] font-extrabold text-stone-500 font-comic uppercase tracking-wider">
        <span>{xpPercent}% TO LEVEL {user.level + 1}</span>
        <span>{800 - xpInCurrentLevel} XP LEFT</span>
      </div>

      {/* HP Bar */}
      <div className="relative w-full h-3 bg-stone-200 border-2 border-comic-black rounded-full overflow-hidden p-px mt-2">
        <div
          className="h-full bg-gradient-to-r from-comic-red to-orange-500 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1"
          style={{ width: `${(user.hp / user.maxHp) * 100}%` }}
        >
          <div className="w-1 h-1 rounded-full bg-white opacity-50" />
        </div>
      </div>
      <div className="flex justify-between items-center mt-1 text-[9px] font-extrabold text-stone-500 font-comic uppercase tracking-wider">
        <span className="text-comic-red flex items-center gap-1"><Flame className="w-3 h-3"/> HEALTH POINTS</span>
        <span>{user.hp} / {user.maxHp} HP</span>
      </div>
    </ComicCard>
  );
};
