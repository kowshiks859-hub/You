import React from 'react';
import { HeroStats } from '../components/dashboard/HeroStats';
import { DailyProgressCard } from '../components/dashboard/DailyProgressCard';
import { MissionList } from '../components/dashboard/MissionList';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { ComicButton } from '../components/common/ComicButton';

export const DashboardPage: React.FC = () => {
  const { nextDayAction, user, tasks } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const requiredTasks = Math.min(5, totalTasks);
  const isNextDayLocked = totalTasks === 0 || completedTasks < requiredTasks;

  return (
    <div className="space-y-1 animate-pop-in pb-20">
      <HeroStats />
      <DailyProgressCard />
      <MissionList />
      
      <div className="mt-5 mb-3 px-1">
        <ComicButton
          variant={isNextDayLocked ? 'outline' : 'primary'}
          size="xl"
          fullWidth
          sound={isNextDayLocked ? 'click' : 'punch'}
          onClick={() => {
            if (!isNextDayLocked) {
              nextDayAction();
            }
          }}
          icon={<ArrowRight className="w-6 h-6" />}
          className={`py-4 text-xl border-3 comic-shadow-lg ${isNextDayLocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          {isNextDayLocked ? `COMPLETE ${requiredTasks - completedTasks} MORE TASKS` : 'COMPLETE TODAY'}
        </ComicButton>
        <p className="text-[11px] font-bold text-center text-stone-500 font-comic uppercase tracking-wider mt-1.5">
          {isNextDayLocked 
            ? `Requires ${requiredTasks} completed tasks (${completedTasks}/${requiredTasks} to unlock)` 
            : `Moves to Day ${user.currentDayNumber + 1}`}
        </p>
      </div>
    </div>
  );
};
