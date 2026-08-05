import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Star,
  Award,
  Lightbulb,
  Eye,
} from 'lucide-react';
import { Animal, GameState } from '../types';
import { sound } from '../utils/audio';

interface GiocoIndovinaProps {
  animals: Animal[];
  onScoreUpdate: (score: number) => void;
  onAnimalGuessedCorrectly?: (animalId: string, cluesUsed: number) => void;
}


function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

export const GiocoIndovina: React.FC<GiocoIndovinaProps> = ({
  animals,
  onScoreUpdate,
  onAnimalGuessedCorrectly,
}) => {

  // Setup options for target animal
  const generateOptionsForTarget = (targetAnimal: Animal, allAnimals: Animal[]): Animal[] => {
    const others = allAnimals.filter((a) => a.id !== targetAnimal.id);
    const shuffledOthers = shuffleArray(others).slice(0, 3);
    return shuffleArray([targetAnimal, ...shuffledOthers]);
  };

  const initGame = (): GameState => {
    const order: number[] = shuffleArray<number>(animals.map((_, idx) => idx));
    const targetIdx = order[0];
    const targetAnimal = animals[targetIdx];
    const options = generateOptionsForTarget(targetAnimal, animals);

    return {
      currentRound: 0,
      order,
      revealedClues: 1,
      score: 0,
      guessedCorrectly: null,
      selectedOptionId: null,
      wrongOptions: [],
      options,
      isGameOver: false,
      streak: 0,
      roundPointsAwarded: null,
    };
  };

  const [gameState, setGameState] = useState<GameState>(initGame);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const targetAnimal = animals[gameState.order[gameState.currentRound]];

  // Trigger TTS for current revealed clue
  const handleSpeakClue = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();
    setIsSpeaking(true);

    const activeCluesText = targetAnimal.indizi
      .slice(0, gameState.revealedClues)
      .map((clue, idx) => `Indizio ${idx + 1}: ${clue}`)
      .join('. ');

    sound.speak(
      `Indovina l'animale! ${activeCluesText}`,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Reveal next clue manually
  const handleMoreClues = () => {
    if (gameState.revealedClues < 3) {
      sound.playPop();
      setGameState((prev) => ({
        ...prev,
        revealedClues: prev.revealedClues + 1,
      }));
    }
  };

  // Handle player choice
  const handleSelectOption = (chosen: Animal) => {
    if (gameState.guessedCorrectly === true || gameState.wrongOptions.includes(chosen.id)) {
      return; // Already solved or already tried
    }

    if (chosen.id === targetAnimal.id) {
      // Correct choice!
      sound.playCorrect();

      if (onAnimalGuessedCorrectly) {
        onAnimalGuessedCorrectly(chosen.id, gameState.revealedClues);
      }

      let pointsToAward = 3;
      if (gameState.revealedClues === 2) pointsToAward = 2;
      if (gameState.revealedClues === 3) pointsToAward = 1;


      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      const newScore = gameState.score + pointsToAward;
      onScoreUpdate(newScore);

      setGameState((prev) => ({
        ...prev,
        guessedCorrectly: true,
        selectedOptionId: chosen.id,
        score: newScore,
        streak: prev.streak + 1,
        roundPointsAwarded: pointsToAward,
      }));

      sound.speak(`Bravissimo! È il ${chosen.nome}! Hai guadagnato ${pointsToAward} punti!`);
    } else {
      // Wrong choice
      sound.playWrong();

      // Automatically reveal next clue if available to help child!
      const nextClueLevel = Math.min(3, gameState.revealedClues + 1);

      setGameState((prev) => ({
        ...prev,
        guessedCorrectly: false,
        selectedOptionId: chosen.id,
        wrongOptions: [...prev.wrongOptions, chosen.id],
        revealedClues: nextClueLevel,
      }));

      sound.speak(`Non è il ${chosen.nome}. Ascolta un altro indizio e riprova!`);
    }
  };

  // Next round logic
  const handleNextRound = () => {
    sound.playPop();
    sound.stopSpeech();

    const nextRound = gameState.currentRound + 1;
    if (nextRound >= animals.length) {
      // Game completed!
      sound.playWin();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
      });
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
      }));
    } else {
      const nextTargetIdx = gameState.order[nextRound];
      const nextTargetAnimal = animals[nextTargetIdx];
      const nextOptions = generateOptionsForTarget(nextTargetAnimal, animals);

      setGameState((prev) => ({
        ...prev,
        currentRound: nextRound,
        revealedClues: 1,
        guessedCorrectly: null,
        selectedOptionId: null,
        wrongOptions: [],
        options: nextOptions,
        roundPointsAwarded: null,
      }));
    }
  };

  const handleRestartGame = () => {
    sound.playPop();
    sound.stopSpeech();
    const freshState = initGame();
    setGameState(freshState);
    onScoreUpdate(0);
  };

  // Game over state
  if (gameState.isGameOver) {
    const maxPossibleScore = animals.length * 3; // 24
    const percentage = Math.round((gameState.score / maxPossibleScore) * 100);

    let rankTitle = 'Esploratore Junior!';
    if (percentage >= 85) rankTitle = 'Super Esperto degli Animali! 👑';
    else if (percentage >= 60) rankTitle = 'Grande Guida della Natura! 🌿';

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="bg-white rounded-3xl border-4 border-teal-300 shadow-2xl p-6 md:p-8 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center border-4 border-teal-300 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase text-teal-800 tracking-wider">
              Sfida Completata!
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-amber-950 mt-1">
              {rankTitle}
            </h2>
            <p className="text-amber-900/80 font-bold mt-2">
              Hai completato tutti gli {animals.length} animali!
            </p>
          </div>

          {/* Score Box */}
          <div className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-90">
              Punteggio Finale
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300 animate-spin-slow" />
              <span className="text-5xl font-black font-display">{gameState.score}</span>
              <span className="text-2xl font-bold opacity-80">/ {maxPossibleScore} PT</span>
            </div>
            
            {/* Stars */}
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-8 h-8 ${
                    (s === 1 && percentage >= 30) ||
                    (s === 2 && percentage >= 60) ||
                    (s === 3 && percentage >= 85)
                      ? 'text-amber-300 fill-amber-300 animate-bounce'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleRestartGame}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/30 hover:brightness-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Gioca Ancora!</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-5 px-4 py-4">
      {/* Round & Score Banner */}
      <div className="w-full bg-teal-50 border-2 border-teal-200 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black uppercase text-teal-800 tracking-wide">
              Round {gameState.currentRound + 1} di {animals.length}
            </span>
            <p className="text-xs font-bold text-teal-950">Indovina di quale animale si tratta!</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Points Potential indicator */}
          <div className="flex items-center gap-1 bg-white border border-teal-300 px-3 py-1.5 rounded-xl shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-black font-display text-teal-950">
              {gameState.revealedClues === 1 ? '3 PT' : gameState.revealedClues === 2 ? '2 PT' : '1 PT'}
            </span>
          </div>
        </div>
      </div>

      {/* Clues Container Card */}
      <div className="w-full bg-white rounded-3xl border-4 border-teal-200 shadow-xl p-5 md:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-teal-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg md:text-xl font-black font-display text-amber-950">
              Indizi per Te ({gameState.revealedClues} di 3)
            </h3>
          </div>

          <button
            onClick={handleSpeakClue}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-bounce'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Ascolta</span>
          </button>
        </div>

        {/* List of Revealed Clues */}
        <div className="flex flex-col gap-2.5">
          {targetAnimal.indizi.slice(0, gameState.revealedClues).map((clue, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                idx === gameState.revealedClues - 1
                  ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200 shadow-xs animate-fade-in'
                  : 'bg-gray-50 border-gray-200 opacity-80'
              }`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm md:text-base font-bold text-amber-950 leading-relaxed">
                "{clue}"
              </p>
            </div>
          ))}

          {/* Reveal Next Clue Button if < 3 */}
          {gameState.revealedClues < 3 && gameState.guessedCorrectly !== true && (
            <button
              onClick={handleMoreClues}
              className="mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-teal-50 border border-teal-300 text-teal-900 font-extrabold text-xs hover:bg-teal-100 transition-all active:scale-95"
            >
              <Eye className="w-4 h-4 text-teal-600" />
              <span>Mostra un altro indizio (vale {3 - gameState.revealedClues} punti)</span>
            </button>
          )}
        </div>

        {/* Feedback Message if Guessed or Wrong */}
        {gameState.guessedCorrectly === true && (
          <div className="mt-2 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl flex items-center justify-between text-emerald-950 animate-bounce">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-base font-black font-display">
                  ESATTO! È proprio il {targetAnimal.nome}! 🎉
                </p>
                <p className="text-xs font-bold text-emerald-800">
                  Hai guadagnato +{gameState.roundPointsAwarded} punti!
                </p>
              </div>
            </div>

            <button
              onClick={handleNextRound}
              className="flex items-center gap-1.5 bg-emerald-600 text-white font-black px-4 py-2.5 rounded-xl shadow-md hover:bg-emerald-700 active:scale-95 transition-all text-sm"
            >
              <span>Avanti</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {gameState.guessedCorrectly === false && (
          <div className="mt-2 p-3.5 bg-amber-100 border-2 border-amber-400 rounded-2xl flex items-center gap-3 text-amber-950">
            <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-xs md:text-sm font-bold">
              Non è l'animale giusto! Ho sbloccato un indizio extra per aiutarti. Riprova!
            </p>
          </div>
        )}
      </div>

      {/* 4 Animal Choices Grid */}
      <div className="w-full grid grid-cols-2 gap-3 md:gap-4 mt-2">
        {gameState.options.map((option) => {
          const isWrong = gameState.wrongOptions.includes(option.id);
          const isCorrectChoice = gameState.guessedCorrectly === true && option.id === targetAnimal.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={gameState.guessedCorrectly === true || isWrong}
              className={`relative group rounded-3xl p-3 border-4 flex flex-col items-center gap-2 transition-all duration-200 select-none shadow-md ${
                isCorrectChoice
                  ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-105'
                  : isWrong
                  ? 'bg-gray-100 border-gray-300 opacity-40 grayscale cursor-not-allowed'
                  : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-xl active:scale-95'
              }`}
            >
              <div className="relative w-full h-28 md:h-36 rounded-2xl overflow-hidden bg-amber-50 shadow-inner">
                <img
                  src={option.foto}
                  alt={option.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isCorrectChoice && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
                  </div>
                )}
                {isWrong && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-white/80" />
                  </div>
                )}
              </div>

              <span className="text-lg md:text-xl font-black font-display text-amber-950 tracking-wide">
                {option.nome}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
