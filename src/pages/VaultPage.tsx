import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Flame, RotateCcw, Trash2, CalendarDays } from 'lucide-react';
import { ComicButton } from '../components/common/ComicButton';
import { DailyRecord } from '../types';

export const VaultPage: React.FC = () => {
  const { vaultTasks, deleteVaultTask, resurrectVaultTask, dailyData, todayStr } = useApp();

  // Last 30 days for heatmap based on authoritative todayStr
  const last30Days: string[] = [];
  const [y, m, d] = todayStr.split('-').map(Number);
  const today = new Date(y, m - 1, d, 12, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const cur = new Date(today);
    cur.setDate(today.getDate() - i);
    const dateStr = [
      cur.getFullYear(),
      String(cur.getMonth() + 1).padStart(2, '0'),
      String(cur.getDate()).padStart(2, '0')
    ].join('-');
    last30Days.push(dateStr);
  }

  return (
    <div className="p-4 space-y-6 animate-pop-in pb-20">
      
      {/* HEADER */}
      <div className="comic-panel p-4 bg-comic-black text-white rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 scale-150 -translate-y-4">
          <Shield className="w-32 h-32" />
        </div>
        <h2 className="font-comic text-2xl uppercase tracking-wider relative z-10">THE VAULT</h2>
        <p className="text-stone-300 text-xs font-bold uppercase tracking-wide relative z-10 mt-1">
          Review your legacy and resurrect forgotten tasks.
        </p>
      </div>

      {/* CONSISTENCY HEATMAP */}
      <div className="comic-panel p-4 bg-white rounded-2xl border-4 border-comic-black comic-shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b-2 border-stone-200 pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-comic-green stroke-[2.5]" />
            <h3 className="font-comic text-lg uppercase tracking-wider text-stone-900">Consistency Heatmap</h3>
          </div>
          <span className="text-[10px] font-bold font-comic uppercase text-stone-500">Last 30 Days</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {last30Days.map((dateStr) => {
            const record = dailyData[dateStr];
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;
            
            let colorClass = "bg-stone-200 border-stone-300"; // No data
            let tooltip = `${dateStr}: No data`;

            if (record?.hasAwardedStreak) {
              colorClass = "bg-comic-green border-green-700 comic-shadow-sm"; // Complete
              tooltip = `${dateStr}: Completed 🔥`;
            } else if (isToday) {
              colorClass = "bg-comic-yellow border-comic-black"; // In progress
              tooltip = `${dateStr}: Today (In Progress)`;
            } else if (isPast && (record?.hasPenalizedHp || record)) {
              colorClass = "bg-comic-red border-red-700 opacity-70"; // Missed
              tooltip = `${dateStr}: Missed Day`;
            }
            
            return (
              <div 
                key={dateStr}
                className={`aspect-square rounded-md border-2 transition-transform hover:scale-110 flex items-center justify-center ${colorClass}`}
                title={tooltip}
              >
                {isToday && !record?.hasAwardedStreak && (
                  <div className="w-1.5 h-1.5 rounded-full bg-comic-black animate-ping" />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2.5 mt-3 text-[10px] font-bold font-comic uppercase text-stone-600 flex-wrap">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-stone-200 border-2 border-stone-300"></div> No Data</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-comic-yellow border-2 border-comic-black"></div> Today</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-comic-red border-2 border-red-700 opacity-70"></div> Missed</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-comic-green border-2 border-green-700"></div> Complete</div>
        </div>
      </div>

      {/* VAULT TASKS */}
      <div className="space-y-3">
        <h3 className="font-comic text-xl uppercase tracking-wider text-stone-900 px-2 flex items-center gap-2">
          <Flame className="w-6 h-6 text-comic-red" />
          Fallen Tasks ({vaultTasks.length})
        </h3>
        
        {vaultTasks.length === 0 ? (
          <div className="p-6 text-center border-4 border-dashed border-stone-300 rounded-2xl">
            <p className="font-comic text-stone-500 uppercase font-bold text-sm">No tasks left behind.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vaultTasks.map(task => (
              <div key={task.id} className="comic-panel p-3 bg-paper-cream rounded-xl border-3 border-comic-black flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 line-clamp-1">{task.title}</h4>
                  <p className="text-[10px] font-comic text-stone-500 uppercase tracking-wide mt-0.5">
                    From {task.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => resurrectVaultTask(task.id)}
                    className="p-2 bg-comic-blue text-white rounded-lg border-2 border-comic-black active:scale-95 transition-transform"
                    aria-label="Resurrect Task"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[3]" />
                  </button>
                  <button 
                    onClick={() => deleteVaultTask(task.id)}
                    className="p-2 bg-comic-red text-white rounded-lg border-2 border-comic-black active:scale-95 transition-transform"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
