import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, normalizePriority } from '../../types';
import { Plus, Star, Trash2, Edit3, Clock, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ComicButton } from '../common/ComicButton';
import { ComicBadge } from '../common/ComicBadge';
import { MissionModal } from './MissionModal';

export const MissionList: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, editTask, toggleStarTask } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'major' | 'medium' | 'low'>('all');

  const filteredTasks = tasks.filter(t => {
    if (selectedFilter === 'all') return true;
    return normalizePriority(t.priority) === selectedFilter;
  });

  const majorCount = tasks.filter(t => normalizePriority(t.priority) === 'major' && !t.completed).length;
  const mediumCount = tasks.filter(t => normalizePriority(t.priority) === 'medium' && !t.completed).length;
  const lowCount = tasks.filter(t => normalizePriority(t.priority) === 'low' && !t.completed).length;

  const handleSaveMission = (taskData: { title: string; description: string; priority: TaskPriority; xpReward: number; reminderTime?: string }) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
    }
  };

  const priorityConfigs: Record<TaskPriority, { border: string; bg: string; badge: 'red' | 'yellow' | 'blue'; label: string }> = {
    major: {
      border: 'border-purple-600',
      bg: 'bg-purple-50/70',
      badge: 'red',
      label: 'MAJOR TASK'
    },
    medium: {
      border: 'border-amber-500',
      bg: 'bg-amber-50/70',
      badge: 'yellow',
      label: 'MEDIUM TASK'
    },
    low: {
      border: 'border-comic-blue',
      bg: 'bg-blue-50/70',
      badge: 'blue',
      label: 'LOW TASK'
    }
  };

  return (
    <div className="mt-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="font-comic text-xl uppercase tracking-wider text-stone-900">
            Daily Missions
          </h2>
          <span className="px-2 py-0.5 bg-comic-black text-white text-[10px] font-comic font-black rounded-full">
            {tasks.filter(t => t.completed).length}/{tasks.length}
          </span>
        </div>

        <ComicButton
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Mission
        </ComicButton>
      </div>

      {/* Task List Stacked */}
      <div className="space-y-4">
        {[
          { title: 'Major Priority Tasks (+100 XP)', key: 'major', filter: (t: Task) => normalizePriority(t.priority) === 'major' },
          { title: 'Medium Priority Tasks (+50 XP)', key: 'medium', filter: (t: Task) => normalizePriority(t.priority) === 'medium' },
          { title: 'Low Priority Tasks (+30 XP)', key: 'low', filter: (t: Task) => normalizePriority(t.priority) === 'low' },
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
                  const config = priorityConfigs[normalizePriority(task.priority)];
                  return (
                    <div
                      key={task.id}
                      className={`p-2.5 rounded-xl border-[1.5px] border-comic-black transition-all ${config.bg} ${
                        task.completed
                          ? 'opacity-70 bg-stone-100/90 border-stone-400'
                          : 'comic-shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border border-comic-black flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 ${
                            task.completed
                              ? 'bg-comic-green text-white comic-shadow-sm'
                              : 'bg-white hover:bg-amber-100'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <ComicBadge variant={config.badge} size="sm">
                              {config.label}
                            </ComicBadge>

                            <span className="px-1.5 py-0.2 bg-comic-yellow text-comic-black font-comic text-[10px] font-black rounded border border-comic-black">
                              +{task.xpReward} XP
                            </span>

                            {task.reminderTime && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-stone-600">
                                <Clock className="w-3 h-3" /> {task.reminderTime}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-extrabold text-sm text-stone-900 leading-snug font-body ${
                              task.completed ? 'line-through text-stone-500' : ''
                            }`}
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
                              className={`w-4 h-4 ${task.starred ? 'text-amber-500 fill-amber-400' : ''}`}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMission}
        initialTask={editingTask}
      />
    </div>
  );
};
