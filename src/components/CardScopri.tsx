import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, RotateCw, Sparkles, Lightbulb } from 'lucide-react';
import { Animal } from '../types';
import { HabitatBadge } from './HabitatBadge';
import { StatCard } from './StatCard';
import { sound } from '../utils/audio';

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
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentAnimal = animals[currentIndex];

  // Automatically unlock animal when viewed
  React.useEffect(() => {
    if (currentAnimal && onAnimalViewed) {
      onAnimalViewed(currentAnimal.id);
    }
  }, [currentAnimal, onAnimalViewed]);

  const handleFlip = () => {
    sound.playFlip();
    setIsFlipped(!isFlipped);
    if (currentAnimal && onAnimalViewed) {
      onAnimalViewed(currentAnimal.id);
    }
  };


  const handleNext = () => {
    sound.playPop();
    setIsFlipped(false);
    onIndexChange((currentIndex + 1) % animals.length);
  };

  const handlePrev = () => {
    sound.playPop();
    setIsFlipped(false);
    onIndexChange((currentIndex - 1 + animals.length) % animals.length);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger flip when clicking speak button
    sound.playPop();
    setIsSpeaking(true);

    let textToSpeak = '';
    if (!isFlipped) {
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
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 px-4 py-4">
      {/* Target Audience Badge & Guidance */}
      <div className="flex items-center justify-between w-full bg-amber-100/90 border border-amber-300 px-4 py-2 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">👀</span>
          <p className="text-xs md:text-sm font-bold text-amber-950">
            Guarda la foto, impara il nome e tocca per scoprire i segreti!
          </p>
        </div>
        <div className="text-xs font-black text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-xl">
          {currentIndex + 1} / {animals.length}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full perspective-1000 min-h-[480px] md:min-h-[520px]">
        <div
          onClick={handleFlip}
          className={`relative w-full h-full cursor-pointer transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border-4 border-amber-200 shadow-2xl shadow-amber-900/10 p-5 flex flex-col justify-between backface-hidden select-none hover:border-amber-300 transition-colors">
            {/* Card Header Top */}
            <div className="flex items-center justify-between z-10">
              <HabitatBadge habitat={currentAnimal.habitat} size="lg" />
              
              <div className="flex items-center gap-2">
                {/* Audio Button */}
                <button
                  onClick={handleSpeak}
                  className={`p-2.5 rounded-full shadow-md transition-all active:scale-90 ${
                    isSpeaking
                      ? 'bg-amber-500 text-white animate-bounce'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                  title="Ascolta la pronuncia"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Animal Main Photo */}
            <div className="relative my-3 w-full flex-1 rounded-2xl overflow-hidden shadow-inner bg-amber-50 border border-amber-100 group">
              <img
                src={currentAnimal.foto}
                alt={currentAnimal.fotoAlt || currentAnimal.nome}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              {/* Decorative Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Front Animal Name Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-3xl md:text-4xl font-black font-display tracking-wide drop-shadow-md">
                  {currentAnimal.nome}
                </h2>
              </div>
            </div>

            {/* Card Bottom Flip Prompt */}
            <div className="flex items-center justify-center gap-2 text-amber-900/80 font-bold text-sm bg-amber-50 py-2.5 px-4 rounded-xl border border-amber-200/80">
              <RotateCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Tocca la carta per girarla!</span>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full bg-[#FFFDF7] rounded-3xl border-4 border-amber-300 shadow-2xl shadow-amber-900/10 p-5 flex flex-col justify-between backface-hidden rotate-y-180 select-none overflow-y-auto">
            {/* Back Header */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <img
                  src={currentAnimal.foto}
                  alt={currentAnimal.nome}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-xs"
                />
                <div>
                  <h3 className="text-2xl font-black font-display text-amber-950">
                    {currentAnimal.nome}
                  </h3>
                  <HabitatBadge habitat={currentAnimal.habitat} size="sm" />
                </div>
              </div>

              {/* Speak button on Back */}
              <button
                onClick={handleSpeak}
                className={`p-2.5 rounded-full shadow-md transition-all active:scale-90 ${
                  isSpeaking
                    ? 'bg-amber-500 text-white animate-bounce'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
                title="Ascolta le curiosità"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Fun Fact Section */}
            <div className="my-3 p-3.5 bg-amber-100/70 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <div className="p-1.5 bg-amber-500 text-white rounded-xl shadow-xs mt-0.5 flex-shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Lo sapevi che...?
                </span>
                <p className="text-sm font-semibold text-amber-950 leading-snug mt-0.5">
                  "{currentAnimal.fattoCurioso}"
                </p>
              </div>
            </div>

            {/* 4 Stat Cards Grid 2x2 */}
            <div className="grid grid-cols-2 gap-2.5 my-1">
              <StatCard tipo="peso" valore={currentAnimal.statistiche.peso} />
              <StatCard tipo="velocita" valore={currentAnimal.statistiche.velocita} />
              <StatCard tipo="lunghezza" valore={currentAnimal.statistiche.lunghezza} />
              <StatCard tipo="longevita" valore={currentAnimal.statistiche.longevita} />
            </div>

            {/* Back Prompt to Flip Back */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800/80 pt-2 border-t border-amber-100">
              <RotateCw className="w-3.5 h-3.5 text-amber-600" />
              <span>Tocca per tornare al fronte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between w-full gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-amber-950 border-2 border-amber-200 hover:border-amber-400 font-extrabold py-3 px-4 rounded-2xl shadow-md transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-amber-600" />
          <span>Precedente</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-3 px-6 rounded-2xl shadow-lg shadow-orange-500/25 transition-all active:scale-95 hover:brightness-105"
        >
          <span>Prossimo Animale</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Jump Thumbnail Bar */}
      <div className="w-full bg-white/80 p-2.5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
        {animals.map((a, idx) => (
          <button
            key={a.id}
            onClick={() => {
              sound.playPop();
              setIsFlipped(false);
              onIndexChange(idx);
            }}
            className={`flex-shrink-0 relative rounded-xl overflow-hidden border-2 transition-all p-0.5 active:scale-95 ${
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
