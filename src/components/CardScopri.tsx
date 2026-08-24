import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Lightbulb, Camera, Info, Square, Shuffle } from 'lucide-react';
import { Animal } from '../types';
import { HabitatBadge } from './HabitatBadge';
import { StatCard } from './StatCard';
import { sound } from '../utils/audio';
import { getRandomCuriosity } from '../utils/curiosities';
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
  const [imageError, setImageError] = useState<boolean>(false);

  const currentAnimal = animals[currentIndex];
  const [activeCuriosity, setActiveCuriosity] = useState<string>(currentAnimal?.fattoCurioso || '');

  // Reset image error state & curiosity when current animal changes
  React.useEffect(() => {
    setImageError(false);
    if (currentAnimal) {
      setActiveCuriosity(currentAnimal.fattoCurioso);
    }
  }, [currentIndex, currentAnimal]);

  const handleNextCuriosity = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    const nextFact = getRandomCuriosity(currentAnimal.id, activeCuriosity);
    setActiveCuriosity(nextFact);
    sound.speak(`Altra curiosità: ${nextFact}`);
  };

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

    if (isSpeaking) {
      sound.stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    let textToSpeak = '';
    if (activeTab === 'foto') {
      textToSpeak = `${currentAnimal.nome}. Habitat: ${currentAnimal.habitat}. Lo sapevi che? ${currentAnimal.fattoCurioso}`;
    } else {
      textToSpeak = `${currentAnimal.nome}. Lo sapevi che? ${currentAnimal.fattoCurioso}. Peso: ${currentAnimal.statistiche.peso}. Velocità: ${currentAnimal.statistiche.velocita}.`;
    }

    sound.speak(
      textToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const currentPhotoUrl = imageError
    ? `https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80`
    : currentAnimal.foto;

  return (
    <div className="w-full max-w-5xl md:max-w-6xl mx-auto flex flex-col items-center gap-5 px-3 md:px-6 py-3">
      {/* Top Banner Guidance */}
      <div className="flex items-center justify-between w-full frosted border-2 border-amber-300 px-5 py-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">🐾</span>
          <div>
            <h1 className="text-base md:text-xl font-black text-amber-950 font-display">
              1. Scheda Grande Animale
            </h1>
            <p className="text-xs md:text-sm font-bold text-amber-900">
              Osserva la foto ad alta risoluzione, ascolta il nome e scopri i suoi segreti!
            </p>
          </div>
        </div>
        <div className="text-sm md:text-base font-black text-amber-950 bg-amber-300/90 border border-amber-400 px-4 py-1.5 rounded-2xl shadow-2xs">
          {currentIndex + 1} / {animals.length}
        </div>
      </div>

      {/* Main Interactive Animal Card - ENLARGED FULL SCREEN WIDTH */}
      <div className="w-full frosted rounded-[36px] border-4 border-amber-300 shadow-2xl overflow-hidden bg-white/95 p-4 md:p-6 space-y-5">
        {/* Card Header: Habitat & Speech Audio */}
        <div className="flex items-center justify-between">
          <HabitatBadge habitat={currentAnimal.habitat} size="lg" />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm md:text-base shadow-md transition-all btn-active ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300'
              }`}
              title={isSpeaking ? "Premi per interrompere la lettura vocale" : "Ascolta la descrizione dell'animale"}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-5 h-5 fill-white" />
                  <span>Stop Voce 🛑</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6 text-amber-600" />
                  <span>Ascolta Nome e Curiosità 🔊</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Switcher: Foto Grande vs Curiosità */}
        <div className="flex bg-amber-100/90 p-1.5 rounded-2xl border-2 border-amber-300 gap-2">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('foto');
            }}
            className={`flex-1 py-3 rounded-xl font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 btn-active ${
              activeTab === 'foto'
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                : 'text-amber-950 hover:bg-amber-200/80'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>Foto Grande e Panoramica 📸</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('dettagli');
            }}
            className={`flex-1 py-3 rounded-xl font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 btn-active ${
              activeTab === 'dettagli'
                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                : 'text-amber-950 hover:bg-amber-200/80'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span>Curiosità e Scheda Tecnica 💡</span>
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
              className="space-y-5"
            >
              {/* LARGE HIGH-VISIBILITY ANIMAL IMAGE DISPLAY */}
              <div className="relative w-full h-[380px] sm:h-[480px] md:h-[580px] lg:h-[620px] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-xl bg-amber-950 group flex items-center justify-center">
                <img
                  src={currentPhotoUrl}
                  alt={currentAnimal.nome}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                
                {/* Subtle Gradient Shadow for High Legibility Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Overlaid Animal Title & Caption */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-wide text-white drop-shadow-xl">
                      {currentAnimal.nome}
                    </h2>
                    <p className="text-sm md:text-lg font-bold text-amber-200 capitalize drop-shadow-md flex items-center gap-2">
                      <span>Habitat naturale:</span>
                      <span className="bg-amber-500/90 text-white px-3 py-0.5 rounded-full text-xs md:text-sm font-black border border-amber-300">
                        {currentAnimal.habitat}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleSpeak}
                    className="self-start md:self-auto p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-2xl transition-transform active:scale-95 flex items-center gap-2 font-black text-base border-2 border-amber-300"
                  >
                    <Volume2 className="w-7 h-7" />
                    <span className="md:hidden">Ascolta Nome</span>
                  </button>
                </div>
              </div>

              {/* Large Caption Banner below photo */}
              <div className="p-5 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-2 border-amber-300 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2 text-amber-950 font-black text-sm md:text-base uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
                    <span>Didascalia e Curiosità:</span>
                  </div>
                  <button
                    onClick={handleNextCuriosity}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-black shadow-sm transition-all btn-active shrink-0 border border-amber-300"
                    title="Mostra un'altra curiosità casuale per questo animale"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Cambia Curiosità</span>
                  </button>
                </div>
                <p className="text-base md:text-xl font-extrabold text-amber-950 leading-relaxed">
                  "{activeCuriosity}"
                </p>
              </div>

              {/* Action Button to View Full Details */}
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('dettagli');
                }}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-base md:text-lg rounded-2xl border-2 border-amber-600 transition-all flex items-center justify-center gap-2 btn-active shadow-md"
              >
                <Lightbulb className="w-6 h-6 text-yellow-300" />
                <span>Apri Scheda Dettagliata con Statistiche per {currentAnimal.nome}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="tab-dettagli"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Header Banner with Animal Image so photo is ALWAYS visible in large format */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-amber-50 rounded-3xl border-2 border-amber-300">
                <img
                  src={currentPhotoUrl}
                  alt={currentAnimal.nome}
                  onError={() => setImageError(true)}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-amber-300 shadow-md shrink-0"
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-black font-display text-amber-950">
                    {currentAnimal.nome}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-amber-900">
                    Scheda Esploratore Approfondita
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <HabitatBadge habitat={currentAnimal.habitat} size="md" />
                  </div>
                </div>
              </div>

              {/* Fun Fact Section */}
              <div className="p-5 bg-amber-100/90 border-2 border-amber-300 rounded-3xl space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm md:text-base font-black text-amber-950 uppercase tracking-wide">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
                    <span>Lo sapevi che...?</span>
                  </div>
                  <button
                    onClick={handleNextCuriosity}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs md:text-sm font-black shadow-sm transition-all btn-active shrink-0 border border-amber-300"
                    title="Mostra un'altra curiosità casuale"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Nuova Curiosità</span>
                  </button>
                </div>
                <p className="text-base md:text-2xl font-black text-amber-950 leading-relaxed pt-1">
                  "{activeCuriosity}"
                </p>
              </div>

              {/* Stat Cards Grid - Larger & Spaced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full py-3.5 bg-stone-100 hover:bg-amber-100 text-amber-950 font-black text-sm md:text-base rounded-2xl border-2 border-stone-300 transition-all flex items-center justify-center gap-2 btn-active shadow-sm"
              >
                <Camera className="w-5 h-5 text-amber-600" />
                <span>Ritorna alla Foto Panoramica a Schermo Intero</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between w-full gap-4 pt-1">
        <button
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-amber-950 border-3 border-amber-300 hover:border-amber-500 font-black py-4 px-6 rounded-2xl shadow-md transition-all btn-active text-base md:text-lg"
        >
          <ChevronLeft className="w-6 h-6 text-amber-600" />
          <span>Precedente</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:brightness-105 transition-all btn-active text-base md:text-xl"
        >
          <span>Prossimo Animale</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Jump Thumbnail Bar - Bigger Thumbnails */}
      <div className="w-full frosted p-3 rounded-2xl border-2 border-amber-300/80 shadow-md flex items-center justify-start gap-2.5 overflow-x-auto no-scrollbar">
        {animals.map((a, idx) => (
          <button
            key={`${a.id}-${idx}`}
            onClick={() => {
              sound.playPop();
              setActiveTab('foto');
              onIndexChange(idx);
            }}
            className={`flex-shrink-0 relative rounded-2xl overflow-hidden border-3 transition-all p-0.5 btn-active ${
              idx === currentIndex
                ? 'border-amber-500 ring-4 ring-amber-300 shadow-lg scale-110'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            title={a.nome}
          >
            <img src={a.foto} alt={a.nome} className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl" />
          </button>
        ))}
      </div>
    </div>
  );
};

