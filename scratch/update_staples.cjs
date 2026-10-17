const fs = require('fs');
const path = 'src/components/food/QuickAddStaples.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add updateFoodLog
content = content.replace(/const \{ addFoodLog, loggedFoods, deleteFoodLog \} = useApp\(\);/, 'const { addFoodLog, loggedFoods, deleteFoodLog, updateFoodLog } = useApp();');

// Update list rendering to include checkbox
const oldListRender = /<div className="min-w-0 flex-1">[\s\S]*?<\/p>\s*<\/div>/;
const newListRender = `<div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.consumed || false}
                    onChange={() => updateFoodLog(item.id, { consumed: !item.consumed })}
                    className="w-4 h-4 rounded border-comic-black text-comic-green focus:ring-comic-green cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1 py-0.2 bg-comic-black text-white text-[8px] font-comic uppercase rounded">
                        {item.mealType}
                      </span>
                      <span className={\`font-bold text-[11px] truncate \${item.consumed ? 'text-stone-900' : 'text-stone-500 line-through'}\`}>
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-600 mt-0.5">
                      {item.calories} kcal • <strong className="text-comic-red">{item.protein}g P</strong> • {item.carbs}g C • {item.fat}g F
                    </p>
                  </div>
                </div>`;

content = content.replace(oldListRender, newListRender);

// Quick add should add with consumed: false
content = content.replace(/addFoodLog\(\{/, 'addFoodLog({ consumed: false,');
content = content.replace(/addFoodLog\(food\)/, 'addFoodLog({ ...food, consumed: false })');

fs.writeFileSync(path, content, 'utf8');
