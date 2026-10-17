import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';

interface ComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'red' | 'blue' | 'yellow' | 'paper' | 'dark';
  maxWidth?: string;
}

export const ComicModal: React.FC<ComicModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  variant = 'paper',
  maxWidth = 'max-w-[420px]'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const headerColors = {
    red: 'bg-comic-red text-white',
    blue: 'bg-comic-blue text-white',
    yellow: 'bg-comic-yellow text-stone-900',
    paper: 'bg-stone-900 text-white',
    dark: 'bg-stone-950 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/75 backdrop-blur-sm animate-pop-in">
      <div
        className={`w-full ${maxWidth} bg-paper-cream border-3 border-comic-black rounded-3xl comic-shadow-lg overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b-3 border-comic-black flex items-center justify-between ${headerColors[variant]}`}>
          <div>
            <h3 className="font-comic text-base uppercase tracking-wider leading-none">
              {title}
            </h3>
            {subtitle && (
              <span className="text-[10px] font-sans font-bold opacity-80 block mt-0.5">
                {subtitle}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto comic-paper-bg flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
