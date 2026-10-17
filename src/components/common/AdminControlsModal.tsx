import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, TrendingUp, Shield, Calendar } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';

interface AdminControlsModalProps {
  onClose: () => void;
}

export const AdminControlsModal: React.FC<AdminControlsModalProps> = ({ onClose }) => {
  const { user, setUser, setDayOffset } = useApp();

  const [xp, setXp] = useState(user.xp);
  const [streak, setStreak] = useState(user.currentStreak);
  const [dayNumber, setDayNumber] = useState(user.currentDayNumber);

  const handleSave = () => {
    soundFx.playLevelUp();
    const newLevel = Math.floor(xp / 800) + 1;
    setUser(prev => ({
      ...prev,
      xp,
      currentStreak: streak,
      currentDayNumber: dayNumber,
      level: newLevel
    }));
    setDayOffset(Math.max(0, dayNumber - 1));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-[340px] bg-paper-light border-2 border-comic-black rounded-2xl comic-shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-comic-black">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-comic-yellow" />
            <h3 className="font-comic text-sm uppercase tracking-wider">
              Tracker Controls
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 comic-paper-bg">
          {/* XP Control */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-comic text-xs uppercase font-bold text-stone-700">
              <TrendingUp className="w-3.5 h-3.5 text-comic-red" /> Lifetime XP
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={xp}
                onChange={e => setXp(Number(e.target.value))}
                className="w-full p-2 bg-white border-2 border-comic-black rounded-xl font-black text-sm"
              />
              <div className="flex flex-col gap-1">
                <button onClick={() => setXp(p => p + 100)} className="px-2 py-0.5 bg-comic-green text-white border border-comic-black rounded text-[10px] font-black">+100</button>
                <button onClick={() => setXp(p => Math.max(0, p - 100))} className="px-2 py-0.5 bg-comic-red text-white border border-comic-black rounded text-[10px] font-black">-100</button>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 font-bold">Level updates automatically (800 XP / Level)</p>
          </div>

          {/* Streak Control */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-comic text-xs uppercase font-bold text-stone-700">
              <Shield className="w-3.5 h-3.5 text-orange-500" /> Day Streak
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={streak}
                onChange={e => setStreak(Number(e.target.value))}
                className="w-full p-2 bg-white border-2 border-comic-black rounded-xl font-black text-sm"
              />
              <div className="flex flex-col gap-1">
                <button onClick={() => setStreak(p => p + 1)} className="px-2 py-0.5 bg-comic-green text-white border border-comic-black rounded text-[10px] font-black">+1</button>
                <button onClick={() => setStreak(p => Math.max(0, p - 1))} className="px-2 py-0.5 bg-comic-red text-white border border-comic-black rounded text-[10px] font-black">-1</button>
              </div>
            </div>
          </div>

          {/* Day Number Control */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-comic text-xs uppercase font-bold text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-comic-blue" /> Current Day Number
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dayNumber}
                onChange={e => setDayNumber(Number(e.target.value))}
                className="w-full p-2 bg-white border-2 border-comic-black rounded-xl font-black text-sm"
              />
              <div className="flex flex-col gap-1">
                <button onClick={() => setDayNumber(p => p + 1)} className="px-2 py-0.5 bg-comic-green text-white border border-comic-black rounded text-[10px] font-black">+1</button>
                <button onClick={() => setDayNumber(p => Math.max(1, p - 1))} className="px-2 py-0.5 bg-comic-red text-white border border-comic-black rounded text-[10px] font-black">-1</button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-2 py-2.5 bg-comic-black text-white font-comic text-sm font-black uppercase tracking-wider rounded-xl border-2 border-white comic-shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Corrections
          </button>
        </div>
      </div>
    </div>
  );
};
