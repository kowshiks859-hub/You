import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, normalizePriority } from '../../types';
import { X, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { ComicButton } from '../common/ComicButton';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; description: string; priority: TaskPriority; xpReward: number; reminderTime?: string }) => void;
  initialTask?: Task | null;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('major');
  const [reminderTime, setReminderTime] = useState('');
  const [xpReward, setXpReward] = useState(100);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(normalizePriority(initialTask.priority));
      setReminderTime(initialTask.reminderTime || '');
      setXpReward(initialTask.xpReward);
    } else {
      setTitle('');
      setDescription('');
      setPriority('major');
      setReminderTime('12:00');
      setXpReward(100);
    }
  }, [initialTask, isOpen]);

  const handlePriorityChange = (p: TaskPriority) => {
    setPriority(p);
    if (!initialTask) {
      if (p === 'major') setXpReward(100);
      else if (p === 'medium') setXpReward(50);
      else setXpReward(30);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      xpReward,
      reminderTime: reminderTime || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-[390px] bg-paper-light border-3 border-comic-black rounded-3xl comic-shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-comic-red text-white px-4 py-3 flex items-center justify-between border-b-3 border-comic-black">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-comic-yellow" />
            <h3 className="font-comic text-lg uppercase tracking-wider">
              {initialTask ? 'Edit Mission' : 'New Daily Mission'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center border border-white/20 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 comic-paper-bg">
          <div>
            <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
              Mission Objective *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 45-min Deep Focus Coding Session"
              className="w-full px-3 py-2 bg-white border-2 border-comic-black rounded-xl font-bold text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-comic-red"
            />
          </div>

          <div>
            <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
              Mission Brief / Details (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Key deliverables, links, or notes..."
              className="w-full px-3 py-2 bg-white border-2 border-comic-black rounded-xl font-medium text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-comic-red"
            />
          </div>

          {/* Priority Picker */}
          <div>
            <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePriorityChange('major')}
                className={`py-2 text-xs font-comic uppercase font-bold rounded-xl border-2 border-comic-black transition-all ${
                  priority === 'major'
                    ? 'bg-purple-600 text-white comic-shadow-sm scale-105'
                    : 'bg-white text-stone-700 opacity-80'
                }`}
              >
                ⭐ Major (+100 XP)
              </button>
              <button
                type="button"
                onClick={() => handlePriorityChange('medium')}
                className={`py-2 text-xs font-comic uppercase font-bold rounded-xl border-2 border-comic-black transition-all ${
                  priority === 'medium'
                    ? 'bg-amber-500 text-white comic-shadow-sm scale-105'
                    : 'bg-white text-stone-700 opacity-80'
                }`}
              >
                ⚡ Medium (+50 XP)
              </button>
              <button
                type="button"
                onClick={() => handlePriorityChange('low')}
                className={`py-2 text-xs font-comic uppercase font-bold rounded-xl border-2 border-comic-black transition-all ${
                  priority === 'low'
                    ? 'bg-comic-blue text-white comic-shadow-sm scale-105'
                    : 'bg-white text-stone-700 opacity-80'
                }`}
              >
                🎯 Low (+30 XP)
              </button>
            </div>
          </div>

          {/* Reminder Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-comic uppercase text-xs text-stone-800 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl font-bold text-xs"
              />
            </div>
            <div>
              <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
                XP Reward
              </label>
              <input
                type="number"
                step="5"
                value={xpReward}
                onChange={e => setXpReward(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl font-bold text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <ComicButton
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              sound="punch"
            >
              {initialTask ? 'UPDATE MISSION' : 'DEPLOY MISSION (+XP)'}
            </ComicButton>
          </div>
        </form>
      </div>
    </div>
  );
};
