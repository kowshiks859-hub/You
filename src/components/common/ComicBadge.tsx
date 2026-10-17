import React from 'react';

interface ComicBadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'yellow' | 'green' | 'blue' | 'black' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tilt?: 'left' | 'right' | 'none';
}

export const ComicBadge: React.FC<ComicBadgeProps> = ({
  children,
  variant = 'red',
  size = 'md',
  className = '',
  tilt = 'none'
}) => {
  const variantStyles = {
    red: 'bg-comic-red text-white border-comic-black',
    yellow: 'bg-comic-yellow text-comic-black border-comic-black',
    green: 'bg-comic-green text-white border-comic-black',
    blue: 'bg-comic-blue text-white border-comic-black',
    black: 'bg-comic-black text-white border-comic-black',
    cream: 'bg-paper-light text-comic-black border-comic-black',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-bold font-comic uppercase tracking-wider',
    md: 'px-2.5 py-1 text-sm font-bold font-comic uppercase tracking-wider',
    lg: 'px-3.5 py-1.5 text-base font-bold font-comic uppercase tracking-wider',
  };

  const tiltStyles = {
    left: '-rotate-2',
    right: 'rotate-2',
    none: 'rotate-0'
  };

  return (
    <span
      className={`inline-flex items-center justify-center border-2 comic-shadow-sm rounded ${variantStyles[variant]} ${sizeStyles[size]} ${tiltStyles[tilt]} ${className}`}
    >
      {children}
    </span>
  );
};
