const fs = require('fs');
const path = 'src/components/dashboard/MissionList.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove Priority Filter Tabs
content = content.replace(
  /\{\/\* Priority Filter Tabs \*\/\}[\s\S]*?\{\/\* Task List \*\/\}/,
  `{/* Task List */}`
);

// We want to map over sections instead of filteredTasks.
// Remove filteredTasks calculation
content = content.replace(
  /const \[selectedFilter, setSelectedFilter\] = useState\('all'\);\s*const filteredTasks = tasks\.filter\([\s\S]*?\);\s*const highCount[\s\S]*?const lowCount.*?;/,
  ``
);

// Inside the return block, replace the filteredTasks.map with a function that renders a section
const renderSectionCode = `
      {/* Task List Stacked */}
      <div className="space-y-4">
        {[
          { title: 'Higher Priority Tasks (+100 XP)', key: 'high', filter: (t) => t.priority === 'high' },
          { title: 'Medium Priority Tasks (+50 XP)', key: 'medium', filter: (t) => t.priority === 'medium' },
          { title: 'Small Tasks (+25 XP)', key: 'low', filter: (t) => t.priority === 'low' },
        ].map(section => {
          const sectionTasks = tasks.filter(section.filter);
          return (
            <div key={section.key} className="space-y-2">
              <h3 className="font-comic text-xs tracking-wider uppercase text-stone-500 border-b border-stone-300 pb-1">
                {section.title}
              </h3>
              {sectionTasks.length === 0 ? (
                <div className="p-3 bg-white/50 border border-stone-200 border-dashed rounded-lg text-center text-stone-400">
                  <p className="text-[10px] uppercase font-bold">No tasks in this tier</p>
                </div>
              ) : (
                sectionTasks.map(task => {
                  const config = priorityConfigs[task.priority];
                  const isNutrition = task.isDefaultTask && task.title === 'Complete Nutrition Tracking';
                  return (
                    <div
                      key={task.id}
                      className={\`p-2.5 rounded-xl border-[1.5px] border-comic-black transition-all \${config.bg} \${
                        task.completed
                          ? 'opacity-70 bg-stone-100/90 border-stone-400'
                          : 'comic-shadow-sm'
                      }\`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isNutrition ? (
                           <div className={\`mt-0.5 w-5 h-5 rounded-md border border-comic-black flex items-center justify-center flex-shrink-0 \${task.completed ? 'bg-comic-green text-white comic-shadow-sm' : 'bg-stone-200'}\`}>
                             {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                           </div>
                        ) : (
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={\`mt-0.5 w-5 h-5 rounded-md border border-comic-black flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 \${
                              task.completed
                                ? 'bg-comic-green text-white comic-shadow-sm'
                                : 'bg-white hover:bg-amber-100'
                            }\`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        )}

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <ComicBadge variant={config.badge} size="sm">
                              {config.label}
                            </ComicBadge>

                            <span className="px-1.5 py-0.2 bg-comic-yellow text-comic-black font-comic text-[10px] font-black rounded border border-comic-black">
                              +\{task.xpReward} XP
                            </span>

                            {task.reminderTime && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-stone-600">
                                <Clock className="w-3 h-3" /> {task.reminderTime}
                              </span>
                            )}
                          </div>

                          <h4
                            className={\`font-extrabold text-sm text-stone-900 leading-snug font-body \${
                              task.completed ? 'line-through text-stone-500' : ''
                            }\`}
                          >
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs text-stone-600 font-medium mt-0.5 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Actions (Star, Edit, Delete) */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => toggleStarTask(task.id)}
                            className="p-1 text-stone-400 hover:text-amber-500 transition-colors"
                            title="Star task"
                          >
                            <Star
                              className={\`w-4 h-4 \${task.starred ? 'text-amber-500 fill-amber-400' : ''}\`}
                            />
                          </button>
                          {!task.isDefaultTask && (
                             <>
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsModalOpen(true);
                                }}
                                className="p-1 text-stone-400 hover:text-stone-800 transition-colors"
                                title="Edit task"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-stone-400 hover:text-comic-red transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                             </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
      <MissionModal
`;

content = content.replace(/\{\/\* Task List \*\/\}[\s\S]*?<MissionModal/, renderSectionCode.trim());

fs.writeFileSync(path, content, 'utf8');
