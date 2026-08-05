import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Lightbulb, Camera, Info } from 'lucide-react';
import { Animal } from '../types';
import { HabitatBadge } from './HabitatBadge';
import { StatCard } from './StatCard';
import { sound } from '../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

interface CardScopriProps {
  animals: Animal[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  onAnimalViewed?: (animalId: string) => void;
}

export const CardScopri: React.FC<CardScopriProps> = ({
  animals,
  currentIndex,
  onIndexChange,
  onAnimalViewed,
}) => {
  const [activeTab, setActiveTab] = useState<'foto' | 'dettagli'>('foto');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentAnimal = animals[currentIndex];

  // Automatically unlock animal when viewed
  React.useEffect(() => {
    if (currentAnimal && onAnimalViewed) {
      onAnimalViewed(currentAnimal.id);
    }
  }, [currentAnimal, onAnimalViewed]);

  const handleNext = () => {
    sound.playPop();
    setActiveTab('foto');
    onIndexChange((currentIndex + 1) % animals.length);
  };

  const handlePrev = () => {
    sound.playPop();
    setActiveTab('foto');
    onIndexChange((currentIndex - 1 + animals.length) % animals.length);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setIsSpeaking(true);

    let textToSpeak = '';
    if (activeTab === 'foto') {
      textToSpeak = `${currentAnimal.nome}. Habitat: ${currentAnimal.habitat}.`;
    } else {
      textToSpeak = `${currentAnimal.nome}. Lo sapevi che? ${currentAnimal.fattoCurioso}. Peso: ${currentAnimal.statistiche.peso}. Velocità: ${currentAnimal.statistiche.velocita}.`;
    }

    sound.speak(
      textToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 px-4 py-2">
      {/* Top Banner Guidance */}
      <div className="flex items-center justify-between w-full frosted border border-amber-300/80 px-4 py-2.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <p className="text-xs md:text-sm font-black text-amber-950">
            1. Scopri le foto, il nome e le curiosità di ogni animale!
          </p>
        </div>
        <div className="text-xs font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-xl shadow-2xs">
          {currentIndex + 1} / {animals.length}
        </div>
      </div>

      {/* Main Interactive Animal Card */}
      <div className="w-full frosted rounded-[32px] border-2 border-amber-300 shadow-lg overflow-hidden bg-white/90 p-5 space-y-4">
        {/* Card Header: Habitat & Speech Audio */}
        <div className="flex items-center justify-between">
          <HabitatBadge habitat={currentAnimal.habitat} size="lg" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className={`p-2.5 rounded-full shadow-md transition-all btn-active ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-bounce'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
              }`}
              title="Ascolta la pronuncia o la descrizione"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Foto vs Curiosità */}
        <div className="flex bg-amber-100/80 p-1 rounded-2xl border border-amber-200/80 gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('foto');
            }}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center justify-center gap-2 btn-active ${
              activeTab === 'foto'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Foto Grande</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('dettagli');
            }}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center justify-center gap-2 btn-active ${
              activeTab === 'dettagli'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-200/60'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Curiosità & Statistiche</span>
          </button>
        </div>

        {/* Content View Container with Smooth Transition */}
        <AnimatePresence mode="wait">
          {activeTab === 'foto' ? (
            <motion.div
              key="tab-foto"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Large Animal Image */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-amber-200 shadow-md bg-amber-50 group">
                <img
                  src={currentAnimal.foto}
                  alt={currentAnimal.nome}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black font-display tracking-wide drop-shadow-md">
                      {currentAnimal.nome}
                    </h2>
                    <p className="text-xs font-bold text-amber-200/90 capitalize mt-0.5">
                      Habitat: {currentAnimal.habitat}
                    </p>
                  </div>

                  <button
                    onClick={handleSpeak}
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg transition-transform active:scale-95"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Button to View Details */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('dettagli');
                }}
                className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm rounded-2xl border border-amber-300 transition-all flex items-center justify-center gap-2 btn-active shadow-2xs"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Scopri i segreti e le curiosità di {currentAnimal.nome}!</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="tab-dettagli"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Header Banner with Animal Image so photo is ALWAYS visible */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <img
                  src={currentAnimal.foto}
                  alt={currentAnimal.nome}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black font-display text-amber-950 truncate">
                    {currentAnimal.nome}
                  </h3>
                  <p className="text-xs font-bold text-amber-800/80">
                    Scheda Informativa per Piccoli Esploratori
                  </p>
                </div>
              </div>

              {/* Fun Fact Section */}
              <div className="p-4 bg-amber-100/80 border border-amber-300/80 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Lo sapevi che...?</span>
                </div>
                <p className="text-sm md:text-base font-bold text-amber-950 leading-relaxed pt-1">
                  "{currentAnimal.fattoCurioso}"
                </p>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard tipo="peso" valore={currentAnimal.statistiche.peso} />
                <StatCard tipo="velocita" valore={currentAnimal.statistiche.velocita} />
                <StatCard tipo="lunghezza" valore={currentAnimal.statistiche.lunghezza} />
                <StatCard tipo="longevita" valore={currentAnimal.statistiche.longevita} />
              </div>

              {/* Back to Photo Button */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('foto');
                }}
                className="w-full py-2.5 bg-stone-100 hover:bg-amber-100 text-stone-800 font-extrabold text-xs rounded-xl border border-stone-300 transition-all flex items-center justify-center gap-2 btn-active"
              >
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Ritorna alla Foto Grande</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between w-full gap-3 pt-1">
        <button
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-amber-950 border-2 border-amber-200 hover:border-amber-400 font-black py-3 px-4 rounded-2xl shadow-xs transition-all btn-active"
        >
          <ChevronLeft className="w-5 h-5 text-amber-600" />
          <span>Precedente</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black py-3 px-6 rounded-2xl shadow-md transition-all btn-active"
        >
          <span>Prossimo Animale</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Jump Thumbnail Bar */}
      <div className="w-full frosted p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {animals.map((a, idx) => (
          <button
            key={a.id}
            onClick={() => {
              sound.playPop();
              setActiveTab('foto');
              onIndexChange(idx);
            }}
            className={`flex-shrink-0 relative rounded-xl overflow-hidden border-2 transition-all p-0.5 btn-active ${
              idx === currentIndex
                ? 'border-amber-500 ring-2 ring-amber-300 shadow-md scale-105'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            title={a.nome}
          >
            <img src={a.foto} alt={a.nome} className="w-10 h-10 object-cover rounded-lg" />
          </button>
        ))}
      </div>
    </div>
  );
};

