import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { ComicButton } from './ComicButton';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    markNotificationRead,
    clearNotifications,
    setActiveTab
  } = useApp();

  if (!isNotificationCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="w-full max-w-[360px] bg-paper-light border-[1.5px] border-comic-black rounded-3xl comic-shadow-lg overflow-hidden mt-12 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-comic-black text-white px-3 py-2.5 flex items-center justify-between border-b-[1.5px] border-comic-black">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-comic-yellow" />
            <h3 className="font-comic text-sm tracking-wider uppercase">
              Comic Intel & Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-stone-400 hover:text-white text-[10px] font-semibold flex items-center gap-1"
                title="Clear All"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsNotificationCenterOpen(false)}
              className="w-6 h-6 rounded-md bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center border border-white/20 active:scale-95"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 comic-paper-bg">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <div className="text-4xl mb-2">🕷️</div>
              <p className="font-comic text-sm uppercase">All caught up!</p>
              <p className="text-[11px]">No pending mission alerts right now.</p>
            </div>
          ) : (
            notifications.map(note => (
              <div
                key={note.id}
                onClick={() => {
                  markNotificationRead(note.id);
                  if (note.actionUrl) {
                    setActiveTab(note.actionUrl);
                    setIsNotificationCenterOpen(false);
                  }
                }}
                className={`p-2.5 rounded-xl border-[1.5px] border-comic-black transition-all cursor-pointer ${
                  note.read
                    ? 'bg-white/70 opacity-75'
                    : 'bg-white comic-shadow-sm border-comic-red'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!note.read && (
                      <span className="w-2 h-2 rounded-full bg-comic-red flex-shrink-0 animate-pulse" />
                    )}
                    <h4 className="font-comic text-sm uppercase text-stone-900 tracking-wide">
                      {note.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 flex-shrink-0">
                    {note.time}
                  </span>
                </div>
                <p className="text-xs text-stone-700 font-medium mt-1 leading-snug">
                  {note.message}
                </p>
                {note.actionUrl && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-comic font-bold text-comic-red uppercase">
                    <span>View in {note.actionUrl}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t-2 border-comic-black text-center">
          <ComicButton
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => setIsNotificationCenterOpen(false)}
          >
            Close Alerts
          </ComicButton>
        </div>
      </div>
    </div>
  );
};
