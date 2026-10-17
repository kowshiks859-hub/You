import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Edit3, Check, X, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';

interface EditingState {
  date: string;
  dayNumber: number;
  value: string;
  error?: string;
}

export const ProteinHistory: React.FC = () => {
  const { dailyData, todayStr, updateDailyProtein } = useApp();
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [successDate, setSuccessDate] = useState<string | null>(null);

  // Sort records by dayNumber ascending, or by date ascending
  const records = Object.values(dailyData).sort((a, b) => {
    if (a.dayNumber && b.dayNumber && a.dayNumber !== b.dayNumber) {
      return a.dayNumber - b.dayNumber;
    }
    return a.date.localeCompare(b.date);
  });

  const getRecordProtein = (record: (typeof records)[0]): number => {
    if (record.proteinOverride !== undefined) {
      return record.proteinOverride;
    }
    return (record.loggedFoods || [])
      .filter(f => f.consumed)
      .reduce((acc, f) => acc + (f.protein || 0), 0);
  };

  const handleStartEdit = (date: string, dayNumber: number, currentProtein: number) => {
    soundFx.playClick();
    setEditing({
      date,
      dayNumber,
      value: String(Math.round(currentProtein))
    });
    setSuccessDate(null);
  };

  const handleCancelEdit = () => {
    soundFx.playClick();
    setEditing(null);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editing) return;

    const trimmed = editing.value.trim();
    if (trimmed === '') {
      setEditing(prev => prev ? { ...prev, error: 'Protein amount cannot be empty.' } : null);
      return;
    }

    const num = Number(trimmed);
    if (isNaN(num)) {
      setEditing(prev => prev ? { ...prev, error: 'Please enter a valid number.' } : null);
      return;
    }

    if (num < 0) {
      setEditing(prev => prev ? { ...prev, error: 'Protein cannot be negative.' } : null);
      return;
    }

    if (num > 1000) {
      setEditing(prev => prev ? { ...prev, error: 'Maximum protein limit is 1000g.' } : null);
      return;
    }

    const ok = updateDailyProtein(editing.date, Math.round(num));
    if (ok) {
      const savedDate = editing.date;
      setEditing(null);
      setSuccessDate(savedDate);
      setTimeout(() => {
        setSuccessDate(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-2">
        <div>
          <h3 className="font-comic text-sm uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-comic-red animate-pulse" />
            Daily Protein History
          </h3>
          <p className="text-[10px] text-stone-500 font-bold font-comic uppercase tracking-wider mt-0.5">
            View & edit historical daily protein records (Day 1 to Day {records.length})
          </p>
        </div>
        <span className="px-2 py-0.5 bg-comic-yellow text-comic-black border border-comic-black rounded text-[10px] font-black font-comic">
          {records.length} {records.length === 1 ? 'DAY' : 'DAYS'}
        </span>
      </div>

      {/* Inline Editor Card */}
      {editing && (
        <form
          onSubmit={handleSaveEdit}
          className="p-3 bg-amber-50 border-2 border-comic-black rounded-xl comic-shadow-sm space-y-2 animate-pop-in"
        >
          <div className="flex items-center justify-between">
            <span className="font-comic text-xs font-black uppercase text-amber-950 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-comic-red" />
              Editing Day {editing.dayNumber} ({editing.date})
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 hover:bg-amber-100 rounded text-stone-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min="0"
                max="1000"
                step="1"
                autoFocus
                value={editing.value}
                onChange={e => {
                  const val = e.target.value;
                  setEditing(prev => prev ? { ...prev, value: val, error: undefined } : null);
                }}
                className={`w-full py-1.5 px-3 bg-white border-2 rounded-lg font-comic text-sm font-black text-stone-900 ${
                  editing.error ? 'border-comic-red bg-red-50' : 'border-comic-black'
                }`}
                placeholder="Protein in grams (e.g. 150)"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-comic text-xs font-bold text-stone-500">
                g
              </span>
            </div>

            <button
              type="submit"
              className="py-1.5 px-3 bg-comic-green text-white font-comic text-xs font-black uppercase rounded-lg border-2 border-comic-black comic-shadow-sm active:scale-95 transition-transform flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="py-1.5 px-2 bg-stone-200 text-stone-700 font-comic text-xs font-bold uppercase rounded-lg border-2 border-comic-black active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>

          {editing.error && (
            <p className="text-[11px] font-comic font-bold text-comic-red flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {editing.error}
            </p>
          )}
        </form>
      )}

      {/* Success Notification */}
      {successDate && (
        <div className="p-2 bg-emerald-100 border border-emerald-600 rounded-lg text-emerald-900 font-comic text-xs font-black flex items-center gap-1.5 animate-pop-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Protein amount updated successfully!
        </div>
      )}

      {/* Horizontal Scrollable Cards */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 px-0.5 scrollbar-thin scrollbar-thumb-stone-400 snap-x">
        {records.length === 0 ? (
          <div className="p-4 bg-white/60 border border-dashed border-stone-300 rounded-xl text-center w-full">
            <p className="text-xs text-stone-500 italic">No historical protein records logged yet.</p>
          </div>
        ) : (
          records.map((record) => {
            const isToday = record.date === todayStr;
            const protein = getRecordProtein(record);
            const isBeingEdited = editing?.date === record.date;

            return (
              <div
                key={record.date}
                className={`snap-center flex-shrink-0 w-28 p-2.5 rounded-xl border-2 border-comic-black flex flex-col justify-between comic-shadow-sm transition-all ${
                  isBeingEdited
                    ? 'ring-2 ring-comic-red scale-105 bg-amber-50'
                    : isToday
                    ? 'bg-comic-yellow'
                    : 'bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-comic text-[10px] uppercase font-black text-stone-700">
                    Day {record.dayNumber}
                  </span>
                  {isToday && (
                    <span className="px-1 py-0.2 bg-comic-red text-white text-[8px] font-comic font-black rounded">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="my-1 text-center">
                  <span className="font-black text-xl text-stone-900 leading-none">
                    {Math.round(protein)}
                    <span className="text-xs font-bold text-stone-600 ml-0.5">g</span>
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between border-t border-stone-200/60 pt-1">
                  <span className="text-[9px] font-mono text-stone-500 truncate max-w-[55px]">
                    {record.date}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(record.date, record.dayNumber, protein)}
                    className="p-1 hover:bg-stone-200/80 rounded text-stone-600 hover:text-stone-900 transition-colors"
                    title={`Edit Day ${record.dayNumber} protein`}
                    aria-label={`Edit Day ${record.dayNumber} protein`}
                  >
                    <Edit3 className="w-3 h-3 text-stone-700" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Historical List Breakdown */}
      <div className="mt-3 bg-white border-2 border-comic-black rounded-xl p-2.5 max-h-56 overflow-y-auto space-y-1.5">
        <span className="text-[10px] font-comic font-black uppercase tracking-wider text-stone-600 block pb-1 border-b border-stone-200">
          All Historical Days Log
        </span>
        {records.map(record => {
          const protein = getRecordProtein(record);
          const isToday = record.date === todayStr;

          return (
            <div
              key={record.date}
              className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs ${
                isToday ? 'bg-amber-100/70 font-bold' : 'hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-comic font-black text-stone-800">Day {record.dayNumber}</span>
                <span className="text-[10px] text-stone-500 font-mono">({record.date})</span>
                {isToday && (
                  <span className="px-1 text-[8px] bg-comic-red text-white font-comic rounded">TODAY</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-comic font-black text-stone-900">{Math.round(protein)}g protein</span>
                <button
                  type="button"
                  onClick={() => handleStartEdit(record.date, record.dayNumber, protein)}
                  className="p-1 bg-stone-100 hover:bg-stone-200 border border-comic-black rounded active:scale-95 transition-transform"
                  title={`Edit Day ${record.dayNumber}`}
                >
                  <Edit3 className="w-3 h-3 text-stone-700" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
