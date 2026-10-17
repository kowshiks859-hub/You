import React, { useState, useEffect } from 'react';
import { Calendar, Save, Edit3 } from 'lucide-react';
import { ComicCard } from '../components/common/ComicCard';

export const MonthlyPlannerPage: React.FC = () => {
  const [monthlyText, setMonthlyText] = useState(() => {
    return localStorage.getItem('spider_tracker_monthly_text') || 
      'Goal 1: Build a project\nGoal 2: Complete course';
  });

  const [monthlyChecks, setMonthlyChecks] = useState<Record<number, boolean>>(() => {
    return JSON.parse(localStorage.getItem('spider_tracker_monthly_checks') || '{}');
  });

  useEffect(() => {
    localStorage.setItem('spider_tracker_monthly_text', monthlyText);
    localStorage.setItem('spider_tracker_monthly_checks', JSON.stringify(monthlyChecks));
  }, [monthlyText, monthlyChecks]);

  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const monthlyLines = monthlyText.split('\n');

  const renderLines = (lines: string[], checks: Record<number, boolean>, setChecks: (val: any) => void) => {
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-5"></div>;
      
      const isChecked = checks[i] || false;
      const toggleCheck = () => {
        setChecks((prev: any) => ({ ...prev, [i]: !prev[i] }));
      };

      return (
        <div key={i} className="flex items-start gap-2 py-1">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={toggleCheck}
            className="mt-1 w-4 h-4 rounded border-comic-black text-comic-blue focus:ring-comic-blue cursor-pointer flex-shrink-0"
          />
          <span className={`text-sm font-medium ${isChecked ? 'line-through text-stone-400' : 'text-stone-900'}`}>
             {line}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-4 animate-pop-in pb-20">
      <div className="py-2.5 px-1 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-comic-black text-white border border-comic-black">
              <Calendar className="w-4 h-4" />
            </span>
            <h1 className="font-comic text-xl uppercase tracking-wider text-stone-900 leading-none">
              Monthly Task
            </h1>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-700 font-comic">
            Monthly Ops
          </p>
        </div>
      </div>

      {/* MONTHLY PLANNER */}
      <ComicCard variant="cream" title="Monthly Objectives" bodyClassName="p-3 relative min-h-[400px]" className="mt-2"
         badge={<span className="px-2 py-0.5 bg-comic-blue text-white font-comic text-[10px] font-black rounded border border-comic-black">THIS MONTH</span>}>
        {isEditingMonthly ? (
           <div className="h-full flex flex-col animate-pop-in">
              <textarea 
                className="w-full flex-1 min-h-[350px] p-3 text-sm font-medium bg-white border-2 border-comic-black rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-blue resize-none"
                value={monthlyText}
                onChange={(e) => setMonthlyText(e.target.value)}
                autoFocus
                placeholder="Type your monthly goals here..."
              />
              <button 
                onClick={() => setIsEditingMonthly(false)}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-comic-blue text-white font-comic text-sm font-black uppercase tracking-wider rounded-lg border-2 border-comic-black comic-shadow-sm active:scale-95 transition-transform"
              >
                <Save className="w-4 h-4 stroke-[3]" /> Save Monthly Plan
              </button>
           </div>
        ) : (
           <div 
             className="w-full min-h-[350px] p-3 bg-white border-2 border-comic-black rounded-lg flex flex-col relative group animate-pop-in"
           >
             <button 
               onClick={() => setIsEditingMonthly(true)}
               className="absolute top-2 right-2 p-1.5 bg-stone-100 border border-comic-black rounded opacity-50 group-hover:opacity-100 transition-opacity active:scale-95"
             >
               <Edit3 className="w-4 h-4 text-stone-600" />
             </button>
             {renderLines(monthlyLines, monthlyChecks, setMonthlyChecks)}
           </div>
        )}
      </ComicCard>
    </div>
  );
};
