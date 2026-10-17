import React from 'react';

interface ComicCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  variant?: 'white' | 'cream' | 'dark' | 'yellow' | 'red' | 'green' | 'blue';
  borderSize?: '2' | '3';
}

export const ComicCard: React.FC<ComicCardProps> = ({
  children,
  title,
  subtitle,
  badge,
  headerAction,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  variant = 'white',
  borderSize = '2'
}) => {
  const variantStyles = {
    white: 'bg-white/95 text-stone-900 border-comic-black',
    cream: 'bg-paper-light text-stone-900 border-comic-black',
    dark: 'bg-stone-900/95 text-white border-stone-950',
    yellow: 'bg-amber-100 text-stone-900 border-comic-black',
    red: 'bg-red-50 text-stone-900 border-comic-black',
    green: 'bg-emerald-50 text-stone-900 border-comic-black',
    blue: 'bg-blue-50 text-stone-900 border-comic-black',
  };

  const borderClass = borderSize === '3' ? 'border-3' : borderSize === '2' ? 'border-2' : 'border';

  return (
    <div
      className={`rounded-xl ${borderClass} comic-shadow-sm backdrop-blur-sm transition-all overflow-hidden ${variantStyles[variant]} ${className}`}
    >
      {(title || badge || headerAction) && (
        <div
          className={`flex items-center justify-between border-b-[1.5px] border-comic-black/20 px-3 py-2 bg-black/5 ${headerClassName}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <h3 className="font-comic text-base uppercase tracking-wide truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="text-[10px] font-semibold text-stone-500 truncate">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {badge}
            {headerAction}
          </div>
        </div>
      )}
      <div className={`p-3 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
