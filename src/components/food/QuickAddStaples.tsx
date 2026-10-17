import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ComicCard } from '../common/ComicCard';
import { ComicButton } from '../common/ComicButton';
import { Plus, X, Settings2, Trash2 } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';
import { FoodItem } from '../../types';

export const QuickAddStaples: React.FC = () => {
  const { addFoodLog, loggedFoods, deleteFoodLog, updateFoodLog } = useApp();
  
  const [customFoods, setCustomFoods] = useState<Omit<FoodItem, 'id' | 'timestamp' | 'consumed'>[]>(() => {
    try {
      const saved = localStorage.getItem('spider_tracker_custom_foods');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('spider_tracker_custom_foods', JSON.stringify(customFoods));
  }, [customFoods]);

  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);

  const [customName, setCustomName] = useState('');
  const [customGrams, setCustomGrams] = useState(100);
  const [customCalories, setCustomCalories] = useState(0);
  const [customProtein, setCustomProtein] = useState(0);
  const [customCarbs, setCustomCarbs] = useState(0);
  const [customFat, setCustomFat] = useState(0);
  const [customFiber, setCustomFiber] = useState(0);
  const [customMeal, setCustomMeal] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('snack');

  const openCreator = (index: number | null = null) => {
    if (index !== null) {
      const food = customFoods[index];
      setCustomName(food.name);
      setCustomGrams(food.weightGrams);
      setCustomCalories(food.calories);
      setCustomProtein(food.protein);
      setCustomCarbs(food.carbs);
      setCustomFat(food.fat);
      setCustomFiber(food.fiber || 0);
      setCustomMeal(food.mealType || 'snack');
      setEditingIndex(index);
    } else {
      setCustomName('');
      setCustomGrams(100);
      setCustomCalories(0);
      setCustomProtein(0);
      setCustomCarbs(0);
      setCustomFat(0);
      setCustomFiber(0);
      setCustomMeal('snack');
      setEditingIndex(null);
    }
    setIsCustomOpen(true);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    
    const newFood = {
      name: customName.trim(),
      weightGrams: Number(customGrams),
      calories: Number(customCalories),
      protein: Number(customProtein),
      carbs: Number(customCarbs),
      fat: Number(customFat),
      fiber: Number(customFiber),
      mealType: customMeal
    };

    if (editingIndex !== null) {
      setCustomFoods(prev => {
        const arr = [...prev];
        arr[editingIndex] = newFood;
        return arr;
      });
    } else {
      setCustomFoods(prev => [...prev, newFood]);
    }
    setIsCustomOpen(false);
  };

  const deleteCustomFood = (index: number) => {
    soundFx.playClick();
    setCustomFoods(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ComicCard
      variant="white"
      title="Custom Foods"
      subtitle="Your Personal Database"
      headerAction={
        <div className="flex gap-1">
           <ComicButton
             variant={isManageMode ? 'primary' : 'outline'}
             size="sm"
             onClick={() => setIsManageMode(!isManageMode)}
             icon={<Settings2 className="w-3.5 h-3.5" />}
           >
             Manage
           </ComicButton>
           <ComicButton
             variant="outline"
             size="sm"
             onClick={() => openCreator()}
             icon={<Plus className="w-3.5 h-3.5" />}
           >
             Add
           </ComicButton>
        </div>
      }
      className="mt-4"
      bodyClassName="p-3.5"
    >
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {customFoods.length === 0 ? (
           <div className="col-span-2 text-center text-[10px] text-stone-500 italic py-4">
             You haven't created any custom foods yet.<br/>Tap 'Add' to build your database!
           </div>
        ) : (
          customFoods.map((food, idx) => (
            <div key={idx} className="relative group">
              <button
                onClick={() => !isManageMode && addFoodLog({ ...food, consumed: false })}
                className={`w-full p-2 bg-stone-50 hover:bg-amber-100/80 border border-comic-black rounded-lg text-left transition-all active:scale-95 comic-shadow-sm flex flex-col justify-between ${isManageMode ? 'opacity-80 grayscale' : ''}`}
                disabled={isManageMode}
              >
                <div>
                  <p className="font-comic text-[11px] uppercase font-bold text-stone-900 leading-tight">
                    {food.name}
                  </p>
                  <p className="text-[9px] text-stone-500 font-semibold mt-0.5">
                    {food.weightGrams}g • {food.calories} kcal
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="px-1.5 py-0.2 bg-comic-red text-white text-[8px] font-comic font-bold rounded">
                    +{food.protein}g P
                  </span>
                  {!isManageMode && <span className="text-[9px] font-comic font-black text-comic-green">+LOG</span>}
                </div>
              </button>

              {isManageMode && (
                <div className="absolute -top-1.5 -right-1.5 flex gap-1 z-10 animate-pop-in">
                   <button onClick={(e) => { e.stopPropagation(); openCreator(idx); }} className="p-1 bg-comic-yellow border border-comic-black rounded-full text-black hover:scale-110">
                     <Settings2 className="w-3 h-3" />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); deleteCustomFood(idx); }} className="p-1 bg-comic-red border border-comic-black rounded-full text-white hover:scale-110">
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Today's Logged Food Items List */}
      <div className="mt-4 pt-3 border-t-[1.5px] border-comic-black/15">
        <h4 className="font-comic text-xs uppercase text-stone-900 mb-2 flex items-center justify-between">
          <span>Logged Today ({loggedFoods.length})</span>
          <span className="text-[10px] font-bold text-stone-500">Tap trash to remove</span>
        </h4>

        {loggedFoods.length === 0 ? (
          <p className="text-[11px] text-stone-500 italic text-center py-2">
            No meals logged today.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {loggedFoods.map(item => (
              <div
                key={item.id}
                className="p-2 bg-paper-light border border-comic-black rounded-lg flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
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
                      <span className={`font-bold text-[11px] truncate ${item.consumed ? 'text-stone-900' : 'text-stone-500 line-through'}`}>
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[9px] text-stone-600 mt-0.5">
                      {item.calories} kcal • <strong className="text-comic-red">{item.protein}g P</strong> • {item.carbs}g C • {item.fat}g F • {item.fiber}g Fib
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteFoodLog(item.id)}
                  className="p-1 text-stone-400 hover:text-comic-red active:scale-90"
                  title="Remove food"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Food Creation Modal */}
      {isCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
          <div className="w-full max-w-[340px] bg-paper-light border-[1.5px] border-comic-black rounded-2xl comic-shadow-lg flex flex-col">
            
            {/* Modal Header (Fixed) */}
            <div className="bg-comic-black text-white px-3 py-2.5 flex flex-shrink-0 items-center justify-between border-b-[1.5px] border-comic-black rounded-t-2xl">
              <h3 className="font-comic text-sm uppercase tracking-wider">
                {editingIndex !== null ? 'Edit Food' : 'Create Custom Food'}
              </h3>
              <button
                onClick={() => setIsCustomOpen(false)}
                className="w-6 h-6 rounded-md bg-stone-800 text-white flex items-center justify-center border border-white/20 active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto max-h-[50vh] comic-paper-bg rounded-b-2xl [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-stone-200 [&::-webkit-scrollbar-thumb]:bg-comic-red [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-comic-black [&::-webkit-scrollbar-thumb]:rounded-full">
              <form onSubmit={handleSaveCustom} className="p-4 space-y-3">
                <div>
                  <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lentil Curry"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-comic-black rounded-lg font-bold text-xs"
                  />
                </div>
                
                <div>
                  <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                    Meal Type
                  </label>
                  <select 
                    value={customMeal}
                    onChange={e => setCustomMeal(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-comic-black rounded-lg font-bold text-xs"
                  >
                     <option value="breakfast">Breakfast</option>
                     <option value="lunch">Lunch</option>
                     <option value="snack">Snack</option>
                     <option value="dinner">Dinner</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Serving (g)
                    </label>
                    <input
                      type="number"
                      value={customGrams}
                      onChange={e => setCustomGrams(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      value={customCalories}
                      onChange={e => setCustomCalories(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={customProtein}
                      onChange={e => setCustomProtein(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={customCarbs}
                      onChange={e => setCustomCarbs(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={customFat}
                      onChange={e => setCustomFat(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-comic uppercase text-[10px] text-stone-700 mb-0.5">
                      Fiber (g)
                    </label>
                    <input
                      type="number"
                      value={customFiber}
                      onChange={e => setCustomFiber(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border-2 border-comic-black rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <ComicButton
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    sound="punch"
                  >
                    {editingIndex !== null ? 'UPDATE CUSTOM FOOD' : 'SAVE CUSTOM FOOD'}
                  </ComicButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ComicCard>
  );
};
