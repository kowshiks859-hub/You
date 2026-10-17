import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { Bell, Settings, Home, Utensils, Calendar, Wrench, Shield } from 'lucide-react';
import { AdminControlsModal } from './AdminControlsModal';
import { soundFx } from '../../services/soundEffects';

interface MobileFrameProps {
  children: React.ReactNode;
}

// Background images mapping
const TAB_BACKGROUNDS: Record<ActiveTab, string> = {
  dashboard: '/venom.png',
  food: '/scorpion.png',
  planner: '/group.png',
  monthly_planner: '/group.png',
  vault: '/venom.png'
};

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    setIsNotificationCenterOpen,
    setIsSettingsOpen
  } = useApp();



  const prevTabRef = useRef<ActiveTab>(activeTab);

  // Scroll to top when switching tabs for a clean view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const [isAdminControlsOpen, setIsAdminControlsOpen] = React.useState(false);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5 stroke-[2.5]" />, color: 'bg-comic-red text-white' },
    { id: 'planner', label: 'Weekly Task', icon: <Calendar className="w-5 h-5 stroke-[2.5]" />, color: 'bg-comic-yellow text-stone-900' },
    { id: 'monthly_planner', label: 'Monthly Task', icon: <Calendar className="w-5 h-5 stroke-[2.5]" />, color: 'bg-comic-blue text-white' },
    { id: 'food', label: 'Food Tracker', icon: <Utensils className="w-5 h-5 stroke-[2.5]" />, color: 'bg-comic-green text-white' },
    { id: 'vault', label: 'Vault', icon: <Shield className="w-5 h-5 stroke-[2.5]" />, color: 'bg-stone-800 text-white' }
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-stone-950 sm:py-4">
      {/* Mobile Device Container (iPhone 14/15 frame simulation on desktop, edge-to-edge on mobile) */}
      <div className="relative w-full max-w-[430px] min-h-screen sm:min-h-0 sm:rounded-[40px] sm:border-[6px] sm:border-stone-900 sm:comic-shadow-lg flex flex-col bg-paper-cream select-none shadow-2xl">
        
        {/* Dynamic Themed Background */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out z-0 sm:rounded-[34px] overflow-hidden"
          style={{
            backgroundImage: `url(${TAB_BACKGROUNDS[activeTab]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            opacity: 1
          }}
        />

        {/* Paper Comic Tint Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-paper-cream/60 z-0 sm:rounded-[34px]" />

        {/* Unified Top Header (ONLY Logo, Notification Icon, Settings Icon) */}
        <header className="sticky top-0 z-40 flex-shrink-0 px-3 py-2.5 bg-white/95 border-b-2 border-comic-black comic-shadow-sm flex items-center justify-between backdrop-blur-md sm:rounded-t-[34px]">
          {/* Spider Tracker Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-comic-red border-2 border-comic-black flex items-center justify-center comic-shadow-sm animate-pop-in">
              <span className="text-base leading-none">🕷️</span>
            </div>
            <div>
              <h1 className="font-comic text-lg uppercase tracking-wider text-stone-900 leading-tight">
                SPIDER TRACKER
              </h1>
              <span className="block text-[8.5px] font-comic font-black uppercase tracking-widest text-comic-red leading-none">
                AI Productivity Core
              </span>
            </div>
          </div>

          {/* Action Icons (Notifications & Settings) */}
          <div className="flex items-center gap-2">
            {/* Settings Icon */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsSettingsOpen(true);
              }}
              className="p-2 bg-paper-light hover:bg-stone-100 border-2 border-comic-black rounded-xl transition-transform active:scale-90"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-stone-800 stroke-[2.5]" />
            </button>
            {/* Admin Controls Icon */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAdminControlsOpen(true);
              }}
              className="p-2 bg-paper-light hover:bg-stone-100 border-2 border-comic-black rounded-xl transition-transform active:scale-90"
              aria-label="Tracker Controls"
            >
              <Wrench className="w-4 h-4 text-comic-blue stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Viewport (Preserves scroll position & provides generous pb-32 so bottom bar never clips content) */}
        <main
          className="relative z-10 flex-1 pb-28"
        >
          {children}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <nav className="fixed bottom-0 z-40 w-full max-w-[430px] sm:max-w-[418px] bg-white/95 border-t-2 border-l-2 border-r-2 border-comic-black backdrop-blur-md px-1 py-2 sm:rounded-b-[34px] safe-area-pb">
          <div className="grid grid-cols-5 gap-0.5 items-center">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? `${item.color} border-2 border-comic-black comic-shadow-sm scale-102 font-black`
                      : 'bg-transparent text-stone-600 hover:bg-stone-100/70 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    {item.icon}
                  </div>
                  <span className={`text-[9px] font-comic uppercase tracking-wider mt-0.5 leading-tight ${isActive ? 'font-black' : 'font-bold'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

            {isAdminControlsOpen && <AdminControlsModal onClose={() => setIsAdminControlsOpen(false)} />}
      </div>
    </div>
  );
};
