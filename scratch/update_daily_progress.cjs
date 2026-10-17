const fs = require('fs');
const path = 'src/components/dashboard/DailyProgressCard.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
export const DailyProgressCard: React.FC = () => {
  const {
    tasks,
    todayNutrition,
    nutritionGoal,
    waterMl,
    setActiveTab
  } = useApp();

  // Task completion calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Nutrition completion
  const proteinRate = Math.min(100, Math.round((todayNutrition.protein / nutritionGoal.protein) * 100));

  // Water completion
  const waterRate = Math.min(100, Math.round((waterMl / nutritionGoal.water) * 100));

  // Overall today completion rate
  const overallRate = Math.round((taskRate + proteinRate + waterRate) / 3);

  return (
    <ComicCard variant="white" className="mt-3" bodyClassName="p-3">
      <div className="flex items-center justify-between border-b-[1.5px] border-comic-black/15 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-comic-red animate-pulse" />
          <h3 className="font-comic text-sm uppercase text-stone-900 tracking-wide">
            Today's Mission Status
          </h3>
        </div>
        <div className="px-2 py-0.5 bg-comic-yellow text-comic-black border border-comic-black rounded-md font-comic text-[10px] font-black">
          {overallRate}% DONE
        </div>
      </div>

      {/* 3 Core Pillars Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Pillar 1: Tasks Completion */}
        <div
          onClick={() => {}}
          className="p-2 bg-red-50/80 border border-comic-black/40 rounded-lg transition-transform active:scale-95"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-comic uppercase font-bold text-red-900 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-comic-red" /> Tasks
            </span>
            <span className="text-[10px] font-black font-comic text-stone-900">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <div className="w-full h-1.5 bg-red-200 rounded-full overflow-hidden border border-comic-black/20">
            <div
              className="h-full bg-comic-red rounded-full transition-all duration-500"
              style={{ width: \`\${taskRate}%\` }}
            />
          </div>
        </div>

        {/* Pillar 2: Nutrition */}
        <div
          onClick={() => setActiveTab('food')}
          className="p-2 bg-emerald-50/80 border border-comic-black/40 rounded-lg cursor-pointer transition-transform active:scale-95"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-comic uppercase font-bold text-emerald-900 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-comic-green" /> Protein
            </span>
            <span className="text-[10px] font-black font-comic text-stone-900">
              {Math.round(todayNutrition.protein)}g
            </span>
          </div>
          <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden border border-comic-black/20">
            <div
              className="h-full bg-comic-green rounded-full transition-all duration-500"
              style={{ width: \`\${proteinRate}%\` }}
            />
          </div>
        </div>

        {/* Pillar 3: Water Intake */}
        <div
          onClick={() => setActiveTab('food')}
          className="p-2 bg-blue-50/80 border border-comic-black/40 rounded-lg cursor-pointer transition-transform active:scale-95"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-comic uppercase font-bold text-blue-900 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-comic-blue" /> Water
            </span>
            <span className="text-[10px] font-black font-comic text-stone-900">
              {waterMl}ml
            </span>
          </div>
          <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden border border-comic-black/20">
            <div
              className="h-full bg-comic-blue rounded-full transition-all duration-500"
              style={{ width: \`\${waterRate}%\` }}
            />
          </div>
        </div>
      </div>
    </ComicCard>
  );
};
`;

content = content.replace(/export const DailyProgressCard[\s\S]*?;[\s\S]*?};/, replacement.trim());
fs.writeFileSync(path, content, 'utf8');
