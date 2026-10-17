const fs = require('fs');
const path = 'src/pages/WeeklyPlannerPage.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Save, Edit3, Target } from 'lucide-react';
import { ComicCard } from '../components/common/ComicCard';

export const WeeklyPlannerPage: React.FC = () => {
  const { tasks } = useApp();
  
  const [weeklyText, setWeeklyText] = useState(() => {
    return localStorage.getItem('spider_tracker_weekly_text') || 
      'Goal 1: Drink 3L Water\nGoal 2: Complete Nutrition Tracking\nGoal 3: Eat Green Stuff';
  });

  const [monthlyText, setMonthlyText] = useState(() => {
    return localStorage.getItem('spider_tracker_monthly_text') || 
      'Build a project\nComplete course';
  });

  // Track checked states by line index (naive but works for simple text)
  const [weeklyChecks, setWeeklyChecks] = useState<Record<number, boolean>>(() => {
    return JSON.parse(localStorage.getItem('spider_tracker_weekly_checks') || '{}');
  });

  const [monthlyChecks, setMonthlyChecks] = useState<Record<number, boolean>>(() => {
    return JSON.parse(localStorage.getItem('spider_tracker_monthly_checks') || '{}');
  });

  useEffect(() => {
    localStorage.setItem('spider_tracker_weekly_text', weeklyText);
    localStorage.setItem('spider_tracker_monthly_text', monthlyText);
    localStorage.setItem('spider_tracker_weekly_checks', JSON.stringify(weeklyChecks));
    localStorage.setItem('spider_tracker_monthly_checks', JSON.stringify(monthlyChecks));
  }, [weeklyText, monthlyText, weeklyChecks, monthlyChecks]);

  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);

  const weeklyLines = weeklyText.split('\n');
  const monthlyLines = monthlyText.split('\n');

  const renderLines = (lines: string[], checks: Record<number, boolean>, setChecks: (val: any) => void) => {
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-5"></div>;
      
      const cleanLine = line.trim().toLowerCase();
      // Auto-strikethrough logic from daily tasks
      const isAutoCompleted = tasks.some(t => t.completed && (cleanLine.includes(t.title.toLowerCase()) || t.title.toLowerCase().includes(cleanLine)));
      
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
            className="mt-1 w-4 h-4 rounded border-comic-black text-comic-yellow focus:ring-comic-yellow cursor-pointer flex-shrink-0"
          />
          <span className={\`text-sm font-medium \${(isAutoCompleted || isChecked) ? 'line-through text-stone-400' : 'text-stone-900'}\`}>
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
              Planner
            </h1>
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-700 font-comic">
            Weekly & Monthly Ops
          </p>
        </div>
      </div>

      {/* WEEKLY PLANNER */}
      <ComicCard variant="white" title="Weekly Objectives" bodyClassName="p-3 relative min-h-[250px]" className="mt-2"
        badge={<span className="px-2 py-0.5 bg-comic-yellow text-comic-black font-comic text-[10px] font-black rounded border border-comic-black">THIS WEEK</span>}>
        {isEditingWeekly ? (
           <div className="h-full flex flex-col animate-pop-in">
              <textarea 
                className="w-full flex-1 min-h-[200px] p-3 text-sm font-medium bg-stone-50 border-2 border-comic-black rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-yellow resize-none"
                value={weeklyText}
                onChange={(e) => setWeeklyText(e.target.value)}
                autoFocus
                placeholder="Type your weekly goals here..."
              />
              <button 
                onClick={() => setIsEditingWeekly(false)}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-comic-green text-white font-comic text-sm font-black uppercase tracking-wider rounded-lg border-2 border-comic-black comic-shadow-sm active:scale-95 transition-transform"
              >
                <Save className="w-4 h-4 stroke-[3]" /> Save Weekly Plan
              </button>
           </div>
        ) : (
           <div 
             className="w-full min-h-[200px] p-3 bg-paper-cream border-2 border-comic-black rounded-lg flex flex-col relative group animate-pop-in"
           >
             <button 
               onClick={() => setIsEditingWeekly(true)}
               className="absolute top-2 right-2 p-1.5 bg-white border border-comic-black rounded opacity-50 group-hover:opacity-100 transition-opacity active:scale-95"
             >
               <Edit3 className="w-4 h-4 text-stone-600" />
             </button>
             {renderLines(weeklyLines, weeklyChecks, setWeeklyChecks)}
           </div>
        )}
      </ComicCard>

      {/* MONTHLY PLANNER */}
      <ComicCard variant="cream" title="Monthly Objectives" bodyClassName="p-3 relative min-h-[250px]" className="mt-4"
         badge={<span className="px-2 py-0.5 bg-comic-blue text-white font-comic text-[10px] font-black rounded border border-comic-black">THIS MONTH</span>}>
        {isEditingMonthly ? (
           <div className="h-full flex flex-col animate-pop-in">
              <textarea 
                className="w-full flex-1 min-h-[200px] p-3 text-sm font-medium bg-white border-2 border-comic-black rounded-lg focus:outline-none focus:ring-2 focus:ring-comic-blue resize-none"
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
             className="w-full min-h-[200px] p-3 bg-white border-2 border-comic-black rounded-lg flex flex-col relative group animate-pop-in"
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
`;

fs.writeFileSync(path, replacement, 'utf8');`;
