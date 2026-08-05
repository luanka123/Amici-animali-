import React from 'react';
import { Weight, Gauge, Ruler, Heart } from 'lucide-react';

interface StatCardProps {
  tipo: 'peso' | 'velocita' | 'lunghezza' | 'longevita';
  valore: string;
}

export const StatCard: React.FC<StatCardProps> = ({ tipo, valore }) => {
  const getMeta = () => {
    switch (tipo) {
      case 'peso':
        return {
          etichetta: 'Peso',
          icona: <Weight className="w-5 h-5 text-amber-600" />,
          bg: 'bg-amber-50/90 border-amber-200/80',
          text: 'text-amber-950',
          unit: 'kg',
        };
      case 'velocita':
        return {
          etichetta: 'Velocità',
          icona: <Gauge className="w-5 h-5 text-orange-600" />,
          bg: 'bg-orange-50/90 border-orange-200/80',
          text: 'text-orange-950',
          unit: 'km/h',
        };
      case 'lunghezza':
        return {
          etichetta: 'Lunghezza',
          icona: <Ruler className="w-5 h-5 text-teal-600" />,
          bg: 'bg-teal-50/90 border-teal-200/80',
          text: 'text-teal-950',
          unit: 'cm',
        };
      case 'longevita':
        return {
          etichetta: 'Longevità',
          icona: <Heart className="w-5 h-5 text-emerald-600" />,
          bg: 'bg-emerald-50/90 border-emerald-200/80',
          text: 'text-emerald-950',
          unit: 'anni',
        };
    }
  };

  const meta = getMeta();

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl border ${meta.bg} shadow-xs hover:shadow-sm transition-all`}
    >
      <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
        {meta.icona}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {meta.etichetta}
        </span>
        <span className={`text-base font-extrabold ${meta.text} font-display truncate`}>
          {valore}
        </span>
      </div>
    </div>
  );
};
