import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComicModal } from '../common/ComicModal';
import { ComicButton } from '../common/ComicButton';
import { ComicCard } from '../common/ComicCard';
import { NutritionGoal, ReminderSetting } from '../../types';
import {
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Target,
  Clock,
  LogOut,
  Flame,
  Droplets,
  Zap,
  Activity,
  Utensils
} from 'lucide-react';
import { soundFx } from '../../services/soundEffects';
import { ProteinHistory } from '../food/ProteinHistory';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    user,
    setUser,
    nutritionGoal,
    setNutritionGoal,
    reminderSettings,
    updateReminderSetting,
    exportAppData,
    importAppData,
    resetToDefaults,
    logoutUser,
    addXp
  } = useApp();

  // Local state for goals form
  const [formData, setFormData] = useState<NutritionGoal>({
    protein: nutritionGoal.protein,
    calories: nutritionGoal.calories,
    carbs: nutritionGoal.carbs,
    fat: nutritionGoal.fat,
    fiber: nutritionGoal.fiber,
    water: nutritionGoal.water,
    creatine: nutritionGoal.creatine || 5
  });

  // Local reminders state
  const [reminders, setReminders] = useState<ReminderSetting[]>(reminderSettings);

  const [activeTab, setActiveTab] = useState<'goals' | 'reminders' | 'protein' | 'system'>('goals');
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playPunch();
    setNutritionGoal(formData);

    // Save reminder times
    reminders.forEach(r => {
      updateReminderSetting(r.key, r.time, r.enabled);
    });

    addXp(30, 'Customized Nutrition & Daily Routine Targets 🎯');
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleExport = () => {
    soundFx.playClick();
    const dataStr = exportAppData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spider_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importAppData(importText);
    if (success) {
      soundFx.playLevelUp();
      alert('Spider Tracker profile & data restored successfully!');
      setIsImporting(false);
      setImportText('');
    } else {
      alert('Invalid backup JSON data format.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all stats back to default?')) {
      soundFx.playClick();
      resetToDefaults();
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = () => {
    soundFx.playClick();
    setIsSettingsOpen(false);
    logoutUser();
  };

  const updateLocalReminder = (key: ReminderSetting['key'], time: string, enabled: boolean) => {
    setReminders(prev =>
      prev.map(r => (r.key === key ? { ...r, time, enabled } : r))
    );
  };

  return (
    <ComicModal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="SPIDER HQ SETTINGS"
      variant="paper"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 border-2 border-comic-black rounded-xl">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('goals');
            }}
            className={`py-1.5 px-1 font-comic text-[11px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'goals'
                ? 'bg-comic-red text-white comic-shadow-sm'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Goals
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('reminders');
            }}
            className={`py-1.5 px-1 font-comic text-[11px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'reminders'
                ? 'bg-comic-blue text-white comic-shadow-sm'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Alerts
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('protein');
            }}
            className={`py-1.5 px-1 font-comic text-[11px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'protein'
                ? 'bg-comic-green text-white comic-shadow-sm'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Protein
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('system');
            }}
            className={`py-1.5 px-1 font-comic text-[11px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'system'
                ? 'bg-comic-yellow text-stone-900 comic-shadow-sm'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> System
          </button>
        </div>

        {/* Tab 1: Editable Goals */}
        {activeTab === 'goals' && (
          <form onSubmit={handleSaveGoals} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Protein */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-comic-red mb-1">
                  🥩 Daily Protein (g)
                </label>
                <input
                  type="number"
                  min="50"
                  max="400"
                  value={formData.protein}
                  onChange={e => setFormData({ ...formData, protein: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>

              {/* Calories */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-amber-600 mb-1">
                  🔥 Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="6000"
                  step="50"
                  value={formData.calories}
                  onChange={e => setFormData({ ...formData, calories: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>

              {/* Carbs */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-blue-600 mb-1">
                  🍚 Carbohydrates (g)
                </label>
                <input
                  type="number"
                  min="50"
                  max="600"
                  value={formData.carbs}
                  onChange={e => setFormData({ ...formData, carbs: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>

              {/* Fat */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-amber-700 mb-1">
                  🥑 Healthy Fat (g)
                </label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={formData.fat}
                  onChange={e => setFormData({ ...formData, fat: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>

              {/* Fiber */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-green-700 mb-1">
                  🥦 Daily Fiber (g)
                </label>
                <input
                  type="number"
                  min="10"
                  max="80"
                  value={formData.fiber}
                  onChange={e => setFormData({ ...formData, fiber: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>

              {/* Creatine */}
              <div className="bg-paper-light p-2 border-[1.5px] border-comic-black rounded-lg">
                <label className="block text-[10px] font-comic font-black uppercase text-purple-700 mb-1">
                  ⚡ Creatine (g)
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={formData.creatine}
                  onChange={e => setFormData({ ...formData, creatine: Number(e.target.value) })}
                  className="w-full py-1 px-1.5 bg-white border-[1.5px] border-comic-black rounded-md text-[11px] font-black text-stone-900"
                />
              </div>
            </div>

            {/* Daily Water */}
            <div className="bg-paper-light p-2.5 border-2 border-comic-black rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-comic font-black uppercase text-cyan-700">
                  💧 Daily Hydration Target (ml / Liters)
                </label>
                <span className="text-xs font-comic font-black text-stone-900">
                  {(formData.water / 1000).toFixed(1)} L ({formData.water} ml)
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="250"
                value={formData.water}
                onChange={e => setFormData({ ...formData, water: Number(e.target.value) })}
                className="w-full accent-comic-red"
              />
            </div>

            <ComicButton
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              sound="punch"
              icon={savedFeedback ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            >
              {savedFeedback ? 'SAVED SUCCESSFULLY!' : 'SAVE DAILY TARGETS ⚡'}
            </ComicButton>
          </form>
        )}

        {/* Tab 2: Reminder Times */}
        {activeTab === 'reminders' && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-stone-600 font-bold">
              Adjust your daily alert schedule. Reminders automatically trigger push notifications at these times.
            </p>

            <div className="space-y-2">
              {reminders.map(rem => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-2.5 bg-white border-2 border-comic-black rounded-xl"
                >
                  <div className="flex-1 pr-2">
                    <span className="text-xs font-comic font-black uppercase text-stone-900 block">
                      {rem.label}
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold">
                      {rem.enabled ? `Alert scheduled at ${rem.time}` : 'Reminder paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={rem.time}
                      onChange={e => updateLocalReminder(rem.key, e.target.value, rem.enabled)}
                      className="px-2 py-1 bg-paper-light border-2 border-comic-black rounded-lg text-xs font-black text-stone-900"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        updateLocalReminder(rem.key, rem.time, !rem.enabled);
                      }}
                      className={`w-7 h-7 rounded-lg border-2 border-comic-black flex items-center justify-center font-black text-xs transition-colors ${
                        rem.enabled ? 'bg-comic-green text-white' : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {rem.enabled ? '✓' : '✕'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <ComicButton
              onClick={handleSaveGoals}
              variant="primary"
              size="md"
              fullWidth
              sound="punch"
              icon={<Check className="w-4 h-4" />}
            >
              SAVE REMINDER SCHEDULE ⏰
            </ComicButton>
          </div>
        )}

        {/* Tab 3: Daily Protein History */}
        {activeTab === 'protein' && (
          <div className="space-y-3">
            <ProteinHistory />
          </div>
        )}

        {/* Tab 4: System & Profile */}
        {activeTab === 'system' && (
          <div className="space-y-3">
            {/* Superhero Profile Edit */}
            <div className="p-3 bg-white border-2 border-comic-black rounded-xl">
              <label className="block text-xs font-comic font-black uppercase text-stone-800 mb-1">
                Superhero Name / Title
              </label>
              <input
                type="text"
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                className="w-full py-1.5 px-2 bg-paper-light border-2 border-comic-black rounded-lg text-xs font-black text-stone-900"
              />
            </div>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-white border-2 border-comic-black rounded-xl">
              <div className="flex items-center gap-2">
                {user.soundEnabled ? <Volume2 className="w-4 h-4 text-comic-red" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                <span className="text-xs font-comic font-black uppercase text-stone-900">
                  Comic Sound FX
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !user.soundEnabled;
                  setUser({ ...user, soundEnabled: next });
                  soundFx.setEnabled(next);
                  if (next) soundFx.playClick();
                }}
                className={`px-3 py-1 rounded-lg border-2 border-comic-black font-comic text-xs font-black ${
                  user.soundEnabled ? 'bg-comic-green text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {user.soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Data Backup & Restore */}
            <div className="p-2.5 bg-paper-light border-2 border-comic-black rounded-xl space-y-2">
              <span className="text-[10px] font-comic font-black uppercase tracking-wider text-stone-600 block">
                Data Security & Cloud Sync
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="py-1.5 px-2 bg-white hover:bg-stone-100 border-2 border-comic-black rounded-lg text-xs font-comic font-black uppercase flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" /> Export JSON
                </button>

                <button
                  type="button"
                  onClick={() => setIsImporting(!isImporting)}
                  className="py-1.5 px-2 bg-white hover:bg-stone-100 border-2 border-comic-black rounded-lg text-xs font-comic font-black uppercase flex items-center justify-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5 text-green-600" /> Import Backup
                </button>
              </div>

              {isImporting && (
                <div className="pt-2 space-y-1.5">
                  <textarea
                    rows={3}
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    placeholder="Paste exported backup JSON here..."
                    className="w-full p-2 bg-white border-2 border-comic-black rounded-lg text-[10px] font-mono text-stone-900"
                  />
                  <ComicButton
                    onClick={handleImport}
                    variant="success"
                    size="sm"
                    fullWidth
                    sound="punch"
                  >
                    RESTORE BACKUP DATA
                  </ComicButton>
                </div>
              )}
            </div>

            {/* Reset Defaults */}
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 bg-red-100 hover:bg-red-200 border-2 border-comic-black rounded-xl text-xs font-comic font-black text-red-900 uppercase flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white border-2 border-comic-black rounded-xl text-xs font-comic font-black uppercase flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5 text-comic-red" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </ComicModal>
  );
};
