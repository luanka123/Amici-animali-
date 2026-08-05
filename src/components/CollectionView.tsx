import React, { useState } from 'react';
import { Animal } from '../types';
import { Lock, Sparkles, CheckCircle2, Trophy, Eye, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/audio';

interface CollectionViewProps {
  animals: Animal[];
  unlockedAnimalIds: string[];
  onSelectAnimalForMode?: (animal: Animal) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  animals,
  unlockedAnimalIds,
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const totalCount = animals.length;
  const unlockedCount = unlockedAnimalIds.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

  const handleCardClick = (animal: Animal) => {
    const isUnlocked = unlockedAnimalIds.includes(animal.id);
    if (isUnlocked) {
      sound.playPop();
      sound.speak(animal.nome);
      setSelectedAnimal(animal);
    } else {
      sound.playWrong();
    }
  };

  const getHabitatBadgeColor = (habitat: string) => {
    switch (habitat) {
      case 'savana':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'oceano':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'foresta':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Banner / Counter */}
      <div className="frosted rounded-[32px] p-6 text-center border border-purple-200/60 shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span>Il tuo Album Personale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-stone-900">
              Collezione Amici Animali 🌟
            </h2>
            <p className="text-sm font-semibold text-stone-600 mt-1">
              Esplora o indovina gli animali nelle altre modalità per completare il tuo album!
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-purple-200 text-center min-w-[160px] shadow-xs">
            <span className="block text-3xl font-black font-display text-purple-700">
              {unlockedCount} / {totalCount}
            </span>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Animali Sbloccati
            </span>
            {/* Progress Bar */}
            <div className="w-full bg-stone-200 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {animals.map((animal) => {
          const isUnlocked = unlockedAnimalIds.includes(animal.id);

          return (
            <motion.div
              key={animal.id}
              whileHover={{ y: isUnlocked ? -4 : 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(animal)}
              className={`relative rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                isUnlocked
                  ? 'bg-white/80 border-purple-200/80 shadow-sm hover:shadow-md'
                  : 'bg-stone-200/60 border-stone-300/80 grayscale opacity-80'
              }`}
            >
              {/* Card Thumbnail Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={animal.foto}
                  alt={animal.nome}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isUnlocked ? 'hover:scale-105' : 'blur-xs scale-105'
                  }`}
                />

                {/* Overlay Badge for Locked or Unlocked */}
                {isUnlocked ? (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-1">
                    <Lock className="w-7 h-7 text-amber-300 drop-shadow-md animate-bounce" />
                    <span className="text-[11px] font-black uppercase tracking-wider bg-stone-900/70 px-2 py-0.5 rounded-md">
                      Bloccato
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 text-center">
                <h3 className="font-extrabold font-display text-stone-900 text-base leading-tight">
                  {isUnlocked ? animal.nome : '???'}
                </h3>

                {isUnlocked ? (
                  <span
                    className={`inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getHabitatBadgeColor(
                      animal.habitat
                    )}`}
                  >
                    {animal.habitat}
                  </span>
                ) : (
                  <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                    Trovalo nel gioco!
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal View for Unlocked Card Inspection */}
      <AnimatePresence>
        {selectedAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedAnimal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="frosted-dark rounded-[36px] max-w-lg w-full overflow-hidden p-6 shadow-2xl border border-amber-300/40 relative"
            >
              <button
                onClick={() => setSelectedAnimal(null)}
                className="absolute top-4 right-4 bg-stone-200/80 hover:bg-stone-300 text-stone-700 w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              <div className="text-center space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 border-2 border-amber-200 shadow-md">
                  <img
                    src={selectedAnimal.foto}
                    alt={selectedAnimal.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Collezione Sbloccata</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-3xl font-black font-display text-amber-950">
                    {selectedAnimal.nome}
                  </h3>
                  <button
                    onClick={() => sound.speak(selectedAnimal.nome)}
                    className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-full transition-colors"
                    title="Ascolta nome"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-left space-y-2 text-stone-800">
                  <p className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                    💡 <span className="underline decoration-amber-300">Curiosità:</span>
                  </p>
                  <p className="text-sm font-medium leading-relaxed">
                    {selectedAnimal.fattoCurioso}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-700">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    🏋️ Peso: <span className="text-amber-900 font-extrabold">{selectedAnimal.statistiche.peso}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    ⚡ Velocità: <span className="text-amber-900 font-extrabold">{selectedAnimal.statistiche.velocita}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    📏 Lunghezza: <span className="text-amber-900 font-extrabold">{selectedAnimal.statistiche.lunghezza}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200">
                    🎂 Longevità: <span className="text-amber-900 font-extrabold">{selectedAnimal.statistiche.longevita}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-colors font-display shadow-md btn-active"
                >
                  Chiudi Scheda
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
