import React from 'react';

interface CoinProps {
  type?: 'gold' | 'silver';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  className?: string;
}

export function CoinPlaceholder({ type = 'silver', size = 'md', icon, className = '' }: CoinProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const typeClass = type === 'gold' ? 'coin-placeholder-gold' : 'coin-placeholder-silver';

  return (
    <div className={`${sizeClasses[size]} ${typeClass} flex items-center justify-center relative ${className}`}>
      {/* Optional real image placeholder */}
      {/* <img src="/placeholder-coin.png" className="absolute inset-0 w-full h-full object-cover" /> */}
      {icon && (
        <div className="z-10 text-black/60 opacity-80 mix-blend-overlay">
          {icon}
        </div>
      )}
    </div>
  );
}
