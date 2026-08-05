import React from 'react';
import { Sun, Waves, Trees } from 'lucide-react';
import { AnimalHabitat } from '../types';
import { HABITAT_CONFIG } from '../data/animals';

interface HabitatBadgeProps {
  habitat: AnimalHabitat;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const HabitatBadge: React.FC<HabitatBadgeProps> = ({
  habitat,
  size = 'md',
  showDescription = false,
}) => {
  const config = HABITAT_CONFIG[habitat];

  const getIcon = () => {
    const iconProps = { className: size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4' };
    switch (habitat) {
      case 'savana':
        return <Sun {...iconProps} />;
      case 'oceano':
        return <Waves {...iconProps} />;
      case 'foresta':
        return <Trees {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1',
    md: 'px-3.5 py-1 text-sm gap-1.5 font-bold',
    lg: 'px-4 py-1.5 text-base gap-2 font-extrabold',
  }[size];

  return (
    <div className="inline-flex flex-col items-start">
      <span
        className={`inline-flex items-center rounded-full shadow-sm transition-all duration-200 ${config.badgeBg} ${config.badgeText} ${sizeClasses}`}
        title={config.description}
      >
        {getIcon()}
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <span className="text-xs text-amber-900/60 mt-1 font-medium italic">
          {config.description}
        </span>
      )}
    </div>
  );
};
