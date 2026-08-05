import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF6ED] border-t border-amber-200/80 py-6 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-black text-amber-950 font-display">
              Amici Animali
            </p>
            <p className="text-xs font-semibold text-amber-800/80">
              Impara la natura giocando con le schede degli animali
            </p>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Spazio Sicuro per Bambini • Zero Pubblicità • No Login</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-900/60">
          <span>Realizzato con</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>per piccoli esploratori</span>
        </div>
      </div>
    </footer>
  );
};
