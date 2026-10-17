import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, Award, X } from 'lucide-react';
import { ComicButton } from './ComicButton';

export const LevelUpModal: React.FC = () => {
  const { levelUpInfo, dismissLevelUp, user } = useApp();

  if (!levelUpInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-[360px] bg-paper-light border-3 border-comic-black rounded-3xl comic-shadow-lg p-6 text-center overflow-hidden comic-paper-bg">
        {/* Comic Starburst Background Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-comic-yellow/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-comic-red/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissLevelUp}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-comic-black text-stone-700 hover:text-black flex items-center justify-center comic-shadow-sm active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Action Badge */}
        <div className="inline-block px-4 py-1.5 bg-comic-yellow text-comic-black border-2 border-comic-black comic-shadow-sm font-comic font-black text-sm uppercase tracking-widest -rotate-3 mb-4">
          ⚡ LEVEL UP! ⚡
        </div>

        {/* Level Emblem */}
        <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-tr from-comic-red to-orange-500 border-3 border-comic-black comic-shadow flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 text-yellow-300 stroke-[2.5]" />
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-comic-black text-white text-xs font-comic font-black rounded border border-white">
            LVL {levelUpInfo.newLevel}
          </div>
        </div>

        <h2 className="font-comic text-3xl uppercase tracking-wider text-stone-900 mb-1">
          POWER LEVEL {levelUpInfo.newLevel}!
        </h2>
        <p className="text-stone-700 text-xs font-semibold mb-4">
          Your discipline is unmatched! Kowshik is advancing deeper into web-slinging mastery.
        </p>

        {/* Unlocked Badge if present */}
        {levelUpInfo.unlockedBadge && (
          <div className="p-3 bg-white border-2 border-comic-black rounded-2xl comic-shadow-sm mb-5 text-left flex items-center gap-3">
            <div className="text-3xl p-2 bg-amber-100 rounded-xl border border-comic-black">
              {levelUpInfo.unlockedBadge.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-comic text-xs uppercase bg-comic-red text-white px-1.5 py-0.2 rounded font-bold">
                  NEW BADGE!
                </span>
                <span className="font-bold text-sm text-stone-900">
                  {levelUpInfo.unlockedBadge.title}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                {levelUpInfo.unlockedBadge.description}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <ComicButton
            variant="primary"
            size="lg"
            fullWidth
            sound="punch"
            onClick={dismissLevelUp}
            icon={<Sparkles className="w-5 h-5" />}
          >
            CLAIM REWARDS & CRUSH IT
          </ComicButton>
        </div>
      </div>
    </div>
  );
};
