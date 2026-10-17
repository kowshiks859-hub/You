import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Home, Utensils, Calendar } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      color: 'bg-comic-red text-white'
    },
    {
      id: 'food',
      label: 'Food Tracker',
      icon: <Utensils className="w-5 h-5" />,
      color: 'bg-comic-green text-white'
    },
    {
      id: 'planner',
      label: 'Weekly Planner',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-comic-black text-white'
    }
  ];

  return (
    <nav className="fixed md:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-comic-black px-2 py-1.5 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] select-none">
      <div className="flex items-center justify-around max-w-[420px] mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? `${item.color} border-2 border-comic-black comic-shadow-sm scale-105 -translate-y-1`
                  : 'text-stone-600 hover:text-stone-900 active:scale-95'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-comic-yellow rounded-full border border-comic-black animate-ping" />
                )}
              </div>
              <span className={`text-[10px] font-comic uppercase tracking-wider mt-0.5 ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
