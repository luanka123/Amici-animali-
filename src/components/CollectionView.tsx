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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {animals.map((animal) => {
          const isUnlocked = unlockedAnimalIds.includes(animal.id);

          return (
            <motion.div
              key={animal.id}
              whileHover={{ y: isUnlocked ? -6 : 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCardClick(animal)}
              className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                isUnlocked
                  ? 'bg-white/90 border-purple-300 shadow-md hover:shadow-xl'
                  : 'bg-stone-200/80 border-stone-300 grayscale opacity-85'
              }`}
            >
              {/* Card Thumbnail Container */}
              <div className="relative h-44 sm:h-52 overflow-hidden bg-stone-100">
                <img
                  src={animal.foto}
                  alt={animal.nome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80';
                  }}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isUnlocked ? 'hover:scale-105' : 'blur-xs scale-105'
                  }`}
                />

                {/* Overlay Badge for Locked or Unlocked */}
                {isUnlocked ? (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-2">
                    <Lock className="w-8 h-8 text-amber-300 drop-shadow-lg animate-bounce" />
                    <span className="text-xs font-black uppercase tracking-wider bg-stone-900/80 px-2.5 py-1 rounded-md border border-stone-700">
                      Bloccato
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 text-center">
                <h3 className="font-black font-display text-stone-900 text-lg leading-tight">
                  {isUnlocked ? animal.nome : '???'}
                </h3>

                {isUnlocked ? (
                  <span
                    className={`inline-block mt-1 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${getHabitatBadgeColor(
                      animal.habitat
                    )}`}
                  >
                    {animal.habitat}
                  </span>
                ) : (
                  <p className="text-xs font-bold text-stone-600 mt-1">
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
            className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedAnimal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="frosted-dark rounded-[40px] max-w-2xl w-full overflow-hidden p-6 md:p-8 shadow-2xl border-2 border-purple-300/60 relative bg-stone-900/90 text-white"
            >
              <button
                onClick={() => setSelectedAnimal(null)}
                className="absolute top-5 right-5 bg-stone-200/90 hover:bg-white text-stone-900 w-10 h-10 rounded-full font-black text-lg flex items-center justify-center transition-colors shadow-md z-20"
              >
                ✕
              </button>

              <div className="text-center space-y-5">
                <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 md:h-96 border-2 border-purple-300/50 shadow-2xl bg-black">
                  <img
                    src={selectedAnimal.foto}
                    alt={selectedAnimal.nome}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs md:text-sm font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>Collezione Sbloccata</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-black font-display text-purple-200">
                    {selectedAnimal.nome}
                  </h3>
                  <button
                    onClick={() => sound.speak(selectedAnimal.nome)}
                    className="p-3 bg-purple-500 hover:bg-purple-400 text-white rounded-full transition-colors shadow-md"
                    title="Ascolta nome"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-stone-800/90 rounded-2xl p-5 border border-purple-300/40 text-left space-y-2 text-stone-200">
                  <p className="text-base font-black text-purple-300 flex items-center gap-2">
                    💡 <span>Curiosità:</span>
                  </p>
                  <p className="text-base font-medium leading-relaxed">
                    "{selectedAnimal.fattoCurioso}"
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 text-sm font-bold text-stone-200">
                  <div className="bg-stone-800/80 p-3 rounded-2xl border border-purple-300/30">
                    🏋️ Peso: <span className="text-purple-300 font-black">{selectedAnimal.statistiche.peso}</span>
                  </div>
                  <div className="bg-stone-800/80 p-3 rounded-2xl border border-purple-300/30">
                    ⚡ Velocità: <span className="text-purple-300 font-black">{selectedAnimal.statistiche.velocita}</span>
                  </div>
                  <div className="bg-stone-800/80 p-3 rounded-2xl border border-purple-300/30">
                    📏 Lunghezza: <span className="text-purple-300 font-black">{selectedAnimal.statistiche.lunghezza}</span>
                  </div>
                  <div className="bg-stone-800/80 p-3 rounded-2xl border border-purple-300/30">
                    🎂 Longevità: <span className="text-purple-300 font-black">{selectedAnimal.statistiche.longevita}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-colors font-display shadow-xl text-base btn-active"
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
