import React from 'react';
import { AnimalPack } from '../types';
import { sound } from '../utils/audio';
import { PackageCheck, Lock, Unlock, Check, Sparkles, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PackSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: AnimalPack[];
  activePackIds: string[];
  onToggleActivePack: (packId: string) => void;
  onUnlockPack: (packId: string) => void;
}

export const PackSelectorModal: React.FC<PackSelectorModalProps> = ({
  isOpen,
  onClose,
  packs,
  activePackIds,
  onToggleActivePack,
  onUnlockPack,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-[#FFFDF7] rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-6 h-6" />
              <div>
                <h2 className="text-lg md:text-xl font-black font-display leading-tight">
                  Pacchetti Animali
                </h2>
                <p className="text-xs text-amber-100 font-bold">
                  Scegli con quali collezioni e animali giocare!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all btn-active"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: List of Packs */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {packs.map((pack) => {
              const isActive = activePackIds.includes(pack.id);

              return (
                <div
                  key={pack.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-amber-100/90 border-amber-500 shadow-md ring-2 ring-amber-300'
                      : pack.unlocked
                      ? 'bg-white border-amber-200 hover:border-amber-300'
                      : 'bg-stone-100/80 border-stone-300 opacity-95'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl p-2.5 bg-amber-200/80 rounded-2xl border border-amber-300 shrink-0">
                      {pack.icona}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-amber-950 font-display">
                          {pack.titolo}
                        </h3>

                        {pack.gratuito ? (
                          <span className="bg-emerald-500 text-white font-black text-2xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Gratis Sempre
                          </span>
                        ) : pack.unlocked ? (
                          <span className="bg-amber-500 text-white font-black text-2xs px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Sbloccato
                          </span>
                        ) : (
                          <span className="bg-stone-700 text-white font-black text-2xs px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Lock className="w-3 h-3" /> {pack.prezzoSimulato}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-900/90 font-semibold leading-snug">
                        {pack.descrizione}
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-2xs font-extrabold text-amber-800">
                        <span>🐾 {pack.animali.length} Animali Inclusi</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sm:shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60">
                    {pack.unlocked ? (
                      <button
                        onClick={() => {
                          sound.playPop();
                          onToggleActivePack(pack.id);
                        }}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black transition-all btn-active flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500 text-white border border-amber-600 shadow-2xs'
                            : 'bg-amber-200/80 text-amber-950 hover:bg-amber-300 border border-amber-300'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>In Uso</span>
                          </>
                        ) : (
                          <span>Attiva</span>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playWin();
                          onUnlockPack(pack.id);
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all btn-active flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Sblocca Ora (Prova)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-amber-100/60 border-t border-amber-200 text-center">
            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-sm rounded-2xl shadow-sm transition-all btn-active"
            >
              Fatto! Salva e Gioca 🐾
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
