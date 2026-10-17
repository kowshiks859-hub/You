import React from 'react';
import { soundFx } from '../../services/soundEffects';

interface ComicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  fullWidth?: boolean;
  sound?: 'punch' | 'click' | 'water' | 'none';
}

export const ComicButton: React.FC<ComicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  sound = 'click',
  className = '',
  onClick,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-comic-red text-white hover:bg-red-600 border-comic-black comic-shadow',
    secondary: 'bg-comic-blue text-white hover:bg-blue-600 border-comic-black comic-shadow',
    success: 'bg-comic-green text-white hover:bg-green-700 border-comic-black comic-shadow',
    danger: 'bg-red-700 text-white hover:bg-red-800 border-comic-black comic-shadow',
    warning: 'bg-comic-yellow text-comic-black hover:bg-yellow-400 border-comic-black comic-shadow',
    dark: 'bg-comic-black text-white hover:bg-stone-800 border-comic-black comic-shadow',
    outline: 'bg-paper-light text-comic-black hover:bg-amber-100 border-comic-black comic-shadow-sm',
  };

  const sizeStyles = {
    sm: 'py-1 px-2.5 text-[10px] font-bold tracking-wide font-comic uppercase',
    md: 'py-1.5 px-3 text-xs font-extrabold tracking-wide font-comic uppercase',
    lg: 'py-2 px-4 text-sm font-extrabold tracking-wider font-comic uppercase',
    xl: 'py-3 px-5 text-base font-extrabold tracking-widest font-comic uppercase',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (sound === 'punch') soundFx.playPunch();
    else if (sound === 'click') soundFx.playClick();
    else if (sound === 'water') soundFx.playWaterDrop();

    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 rounded-lg border-2 font-comic transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
