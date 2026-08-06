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
  Square,
  Baby,
  Smile,
  GraduationCap,
  Zap,
  Globe,
  Radio,
  Timer,
  Bot,
  Layers,
  Flame,
  BrainCircuit,
} from 'lucide-react';
import { Animal, AgeBand, GameState } from '../types';
import { sound } from '../utils/audio';

interface GiocoIndovinaProps {
  animals: Animal[];
  onScoreUpdate: (score: number) => void;
  onAnimalGuessedCorrectly?: (animalId: string, cluesUsed: number) => void;
}

type QuizModeType = 'indizi' | 'quiz_stat' | 'ai_generated';

interface CategoryFilter {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'Tutto il Mondo 🌍', icon: '🌍' },
  { id: 'savana', label: 'Terra & Savana 🦁', icon: '🦁' },
  { id: 'oceano', label: 'Mare & Oceano 🐬', icon: '🐬' },
  { id: 'giungla', label: 'Giungla & Foresta 🌿', icon: '🌿' },
  { id: 'dinosauri', label: 'Preistoria & Dinosauri 🦕', icon: '🦕' },
];

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

// Generate age-appropriate clues dynamically
function getCluesForAge(animal: Animal, ageBand: AgeBand, index: number): string {
  if (ageBand === '3-4') {
    // Ultra simple for toddlers (3-4 years)
    const simpleClues34: Record<string, string[]> = {
      leone: ['Fa RUUUUGIATO! Ha il pelo dorato e vive nella savana!', 'Ha la criniera d\'oro ed è il re dei felini!', 'È il leone coraggioso!'],
      elefante: ['Fa la tromba con la sua lunghissima proboscide!', 'Ha enormi orecchie e un corpo grigio e grande!', 'È l\'elefante gigante!'],
      delfino: ['Fa i salti felici nell\'acqua del mare!', 'Nuota veloce e fa il verso fischietto!', 'È il delfino amico dei bimbi!'],
      'panda-gigante': ['È un orsetto bianco e nero che mangia il bambù!', 'Si arrampica e adora fare i ruzzoloni!', 'È il tenero panda!'],
      'squalo-bianco': ['Ha una pinna sulla schiena e nuota nel mare!', 'Nuota veloce con i suoi dentini!', 'È lo squalo mare!'],
      trex: ['Fa un ruggito gigante di dinosauro!', 'Ha due braccine corte e denti grandi!', 'È il T-Rex preistorico!'],
      giraffa: ['Ha un collo lunghissimo altissimo fino al cielo!', 'MANGIA le foglie in alto sugli alberi!', 'È la giraffa alta alta!'],
    };

    if (simpleClues34[animal.id] && simpleClues34[animal.id][index]) {
      return simpleClues34[animal.id][index];
    }

    // Default toddler generator
    if (index === 0) return `È un animale fantastico dell'habitat ${animal.habitat}!`;
    if (index === 1) return `Ha il pelo o la pelle bella e fa un verso caratteristico!`;
    return `È proprio il delizioso ${animal.nome}!`;
  }

  if (ageBand === '5-6') {
    // Friendly for young children (5-6 years)
    if (index === 0) return animal.indizi[0];
    if (index === 1) return animal.indizi[1];
    return animal.fattoCurioso;
  }

  if (ageBand === '7-8') {
    // Descriptive for 7-8 years
    if (index === 0) return animal.indizi[0];
    if (index === 1) return animal.indizi[2];
    return `Statistiche reali: pesa ${animal.statistiche.peso} e corre fino a ${animal.statistiche.velocita}!`;
  }

  // Master Level (9-12+ years)
  if (index === 0) return `Inquadramento Tassonomico & Habitat: vive in ${animal.habitat} e la sua longevità media è ${animal.statistiche.longevita}.`;
  if (index === 1) return `Specifiche Fisiche: misura circa ${animal.statistiche.lunghezza} e pesa ${animal.statistiche.peso}.`;
  return animal.fattoCurioso;
}

export const GiocoIndovina: React.FC<GiocoIndovinaProps> = ({
  animals,
  onScoreUpdate,
  onAnimalGuessedCorrectly,
}) => {
  // Age Band Selection (3-4, 5-6, 7-8, 9-12+)
  const [ageBand, setAgeBand] = useState<AgeBand>('5-6');
  
  // Category Selection Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Game Sub-Mode
  const [quizMode, setQuizMode] = useState<QuizModeType>('indizi');

  // Filtered Animals based on active category
  const filteredAnimals = React.useMemo(() => {
    if (selectedCategory === 'all') return animals;
    return animals.filter((a) => a.habitat === selectedCategory);
  }, [animals, selectedCategory]);

  // Determine option count based on age
  const getOptionCountForAge = (band: AgeBand): number => {
    if (band === '3-4') return 2; // Toddlers get 2 large choices!
    if (band === '5-6') return 3;
    return 4; // 7-8 and 9-12+ get 4 choices
  };

  const generateOptionsForTarget = (targetAnimal: Animal, pool: Animal[], band: AgeBand): Animal[] => {
    const count = getOptionCountForAge(band);
    const others = pool.filter((a) => a.id !== targetAnimal.id);
    const shuffledOthers = shuffleArray(others).slice(0, count - 1);
    return shuffleArray([targetAnimal, ...shuffledOthers]);
  };

  const initGame = (): GameState => {
    const pool = filteredAnimals.length >= 2 ? filteredAnimals : animals;
    const order: number[] = shuffleArray<number>(pool.map((_, idx) => idx));
    const targetIdx = order[0] || 0;
    const targetAnimal = pool[targetIdx];
    const options = generateOptionsForTarget(targetAnimal, pool, ageBand);

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
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiCustomClue, setAiCustomClue] = useState<string | null>(null);

  const activePool = filteredAnimals.length >= 2 ? filteredAnimals : animals;
  const currentTargetAnimalIdx = gameState.order[gameState.currentRound] || 0;
  const targetAnimal = activePool[currentTargetAnimalIdx] || animals[0];

  // Re-init game when category or age band changes
  useEffect(() => {
    setGameState(initGame());
  }, [selectedCategory, ageBand, animals]);

  // Timer for 9-12+ age band
  useEffect(() => {
    if (ageBand !== '9-12+' || gameState.guessedCorrectly !== null || gameState.isGameOver) {
      setTimerActive(false);
      return;
    }

    setTimerSeconds(15);
    setTimerActive(true);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          // Time's up! Automatically reveal clue
          sound.playWrong();
          sound.speak('Tempo scaduto per questo turno! Riprova con il prossimo indizio!');
          setGameState((g) => ({
            ...g,
            revealedClues: Math.min(3, g.revealedClues + 1),
          }));
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentRound, ageBand, gameState.guessedCorrectly]);

  // Request AI Custom Clues from Express endpoint `/api/ai-quiz`
  const handleGenerateAiQuiz = async () => {
    sound.playPop();
    setAiLoading(true);
    setAiCustomClue(null);

    try {
      const animalNames = activePool.map((a) => a.nome);
      const res = await fetch('/api/ai-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageBand,
          category: selectedCategory,
          animalNames,
        }),
      });

      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        const q = data.questions[0];
        setAiCustomClue(q.indizi ? q.indizi.join('. ') : q.fattoGenerato);
        sound.playWin();
        sound.speak(`L'Intelligenza Artificiale ha creato un nuovo indizio per te!`);
      } else {
        // Fallback local smart clue
        const fallbackText = getCluesForAge(targetAnimal, ageBand, 0);
        setAiCustomClue(`🤖 [AI Smart Local]: ${fallbackText}`);
        sound.playPop();
      }
    } catch (err) {
      console.warn('AI Quiz fetch error:', err);
      setAiCustomClue(`🤖 Indizio Speciale: ${targetAnimal.fattoCurioso}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger Speech for Clue
  const handleSpeakClue = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPop();

    if (isSpeaking) {
      sound.stopSpeech();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    const currentClueText = aiCustomClue
      ? aiCustomClue
      : Array.from({ length: gameState.revealedClues })
          .map((_, idx) => `Indizio ${idx + 1}: ${getCluesForAge(targetAnimal, ageBand, idx)}`)
          .join('. ');

    sound.speak(
      `Indovina l'animale per bimbi di ${ageBand} anni! ${currentClueText}`,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Reveal next clue
  const handleMoreClues = () => {
    if (gameState.revealedClues < 3) {
      sound.playPop();
      setGameState((prev) => ({
        ...prev,
        revealedClues: prev.revealedClues + 1,
      }));
    }
  };

  // Option selection
  const handleSelectOption = (chosen: Animal) => {
    if (gameState.guessedCorrectly === true || gameState.wrongOptions.includes(chosen.id)) {
      return;
    }

    if (chosen.id === targetAnimal.id) {
      sound.playCorrect();

      if (onAnimalGuessedCorrectly) {
        onAnimalGuessedCorrectly(chosen.id, gameState.revealedClues);
      }

      let pointsToAward = 3;
      if (gameState.revealedClues === 2) pointsToAward = 2;
      if (gameState.revealedClues === 3) pointsToAward = 1;

      confetti({
        particleCount: ageBand === '3-4' ? 100 : 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newScore = gameState.score + pointsToAward;
      onScoreUpdate(pointsToAward);

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
      sound.playWrong();
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

  const handleNextRound = () => {
    sound.playPop();
    sound.stopSpeech();
    setAiCustomClue(null);

    const nextRound = gameState.currentRound + 1;
    if (nextRound >= activePool.length) {
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
      const nextTargetAnimal = activePool[nextTargetIdx];
      const nextOptions = generateOptionsForTarget(nextTargetAnimal, activePool, ageBand);

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
    setAiCustomClue(null);
    setGameState(initGame());
  };

  // GAME OVER VIEW
  if (gameState.isGameOver) {
    const maxPossibleScore = activePool.length * 3;
    const percentage = Math.round((gameState.score / Math.max(1, maxPossibleScore)) * 100);

    let rankTitle = 'Piccolo Esploratore! 🌟';
    if (percentage >= 85) rankTitle = 'Super Maestro della Natura! 👑';
    else if (percentage >= 60) rankTitle = 'Grande Scienziato degli Animali! 🌿';

    return (
      <div className="w-full max-w-xl mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="bg-white rounded-[32px] border-4 border-teal-300 shadow-2xl p-6 md:p-8 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center border-4 border-teal-300 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase text-teal-800 tracking-wider">
              Sfida Indovina Completata per l'Età {ageBand} Anni!
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-amber-950 mt-1">
              {rankTitle}
            </h2>
            <p className="text-amber-900/80 font-bold mt-2">
              Hai indovinato tutti gli {activePool.length} animali del pacchetto!
            </p>
          </div>

          <div className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-90">
              Punteggio Totale Guadagnato
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300 animate-spin-slow" />
              <span className="text-5xl font-black font-display">{gameState.score}</span>
              <span className="text-2xl font-bold opacity-80">/ {maxPossibleScore} PT</span>
            </div>

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
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-lg py-4 px-6 rounded-2xl shadow-xl shadow-orange-500/30 hover:brightness-105 active:scale-95 transition-all btn-active"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Gioca Ancora!</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl md:max-w-6xl mx-auto flex flex-col items-center gap-5 px-3 md:px-6 py-3">
      {/* 1. AGE BAND SELECTOR BAR (3-4, 5-6, 7-8, 9-12+ YEARS) */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-3xl shadow-lg border-2 border-amber-300 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-yellow-300 shrink-0 animate-pulse" />
            <div>
              <h3 className="text-lg md:text-xl font-black font-display leading-tight">
                2. Gioco Indovina Scalabile per Età 🎯
              </h3>
              <p className="text-xs text-amber-100 font-bold">
                Seleziona la fascia d'età del bambino per adattare indizi e difficoltà!
              </p>
            </div>
          </div>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateAiQuiz}
            disabled={aiLoading}
            className="flex items-center gap-2 bg-white text-amber-950 hover:bg-amber-100 px-4 py-2 rounded-2xl font-black text-xs md:text-sm shadow-md transition-all btn-active border-2 border-yellow-300 shrink-0"
            title="Genera un indizio inedito e personalizzato con l'Intelligenza Artificiale"
          >
            <Bot className={`w-5 h-5 text-purple-600 ${aiLoading ? 'animate-spin' : ''}`} />
            <span>{aiLoading ? 'Generazione AI...' : '🤖 Indizio AI Groq/Gemini'}</span>
          </button>
        </div>

        {/* Age Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/15 p-1.5 rounded-2xl border border-white/20">
          <button
            onClick={() => {
              sound.playPop();
              setAgeBand('3-4');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all btn-active ${
              ageBand === '3-4'
                ? 'bg-yellow-400 text-amber-950 shadow-md ring-2 ring-yellow-200'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>3-4 Anni (Piccoli) 🍼</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setAgeBand('5-6');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all btn-active ${
              ageBand === '5-6'
                ? 'bg-yellow-400 text-amber-950 shadow-md ring-2 ring-yellow-200'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>5-6 Anni (Medio) 🎈</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setAgeBand('7-8');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all btn-active ${
              ageBand === '7-8'
                ? 'bg-yellow-400 text-amber-950 shadow-md ring-2 ring-yellow-200'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>7-8 Anni (Grandi) 🚀</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setAgeBand('9-12+');
            }}
            className={`py-2.5 px-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all btn-active ${
              ageBand === '9-12+'
                ? 'bg-yellow-400 text-amber-950 shadow-md ring-2 ring-yellow-200'
                : 'text-amber-100 hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>9-12+ Anni (Master) 🎓</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY / HABITAT SELECTOR BAR */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playPop();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 btn-active shadow-xs flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-teal-600 text-white border-teal-700 ring-2 ring-teal-300 shadow-sm'
                : 'bg-white text-amber-950 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 3. ROUND STATUS & TIMER BAR */}
      <div className="w-full frosted border-2 border-teal-300 rounded-3xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-sm">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs md:text-sm font-black uppercase text-teal-900 tracking-wide">
              Round {gameState.currentRound + 1} di {activePool.length} ({selectedCategory.toUpperCase()})
            </span>
            <p className="text-base md:text-lg font-black text-teal-950 font-display">
              {ageBand === '3-4'
                ? 'Trova l\'Animale Giusto! 🐾'
                : 'Indovina l\'Animale dagli Indizi! 🤔'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Badge for 9-12+ Age Band */}
          {ageBand === '9-12+' && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-black text-sm border-2 ${
              timerSeconds <= 5 ? 'bg-rose-500 text-white border-rose-600 animate-ping' : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timerSeconds}s</span>
            </div>
          )}

          <div className="flex items-center gap-2 bg-white border-2 border-teal-300 px-4 py-2 rounded-2xl shadow-2xs">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-base md:text-lg font-black font-display text-teal-950">
              {gameState.revealedClues === 1 ? '3 PT' : gameState.revealedClues === 2 ? '2 PT' : '1 PT'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. CLUES CONTAINER CARD */}
      <div className="w-full bg-white/95 rounded-[32px] border-4 border-teal-300 shadow-2xl p-5 md:p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-teal-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl border border-amber-300">
              <Lightbulb className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg md:text-2xl font-black font-display text-amber-950">
              Indizi per Bimbi ({ageBand} Anni)
            </h3>
          </div>

          <button
            onClick={handleSpeakClue}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-active shadow-sm ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-300'
                : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
            }`}
            title={isSpeaking ? 'Premi per interrompere la voce' : 'Ascolta gli indizi dell\'animale'}
          >
            {isSpeaking ? (
              <>
                <Square className="w-5 h-5 fill-white" />
                <span>Stop Voce 🛑</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>Ascolta Indizi 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* Display Custom AI Clue or Dynamic Clues */}
        {aiCustomClue ? (
          <div className="p-4 rounded-2xl bg-purple-100 border-2 border-purple-400 text-purple-950 font-extrabold text-base md:text-lg shadow-sm">
            <p className="flex items-center gap-2 font-black text-xs uppercase text-purple-800 mb-1">
              <Bot className="w-4 h-4 text-purple-700" /> Indizio Inedito Generato dall'AI:
            </p>
            "{aiCustomClue}"
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {Array.from({ length: gameState.revealedClues }).map((_, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 transition-all ${
                  idx === gameState.revealedClues - 1
                    ? 'bg-amber-50 border-amber-300 ring-4 ring-amber-200 shadow-sm animate-fade-in'
                    : 'bg-gray-50 border-gray-200 opacity-80'
                }`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-xs mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-base md:text-xl font-extrabold text-amber-950 leading-relaxed">
                  "{getCluesForAge(targetAnimal, ageBand, idx)}"
                </p>
              </div>
            ))}

            {gameState.revealedClues < 3 && gameState.guessedCorrectly !== true && (
              <button
                onClick={handleMoreClues}
                className="mt-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-teal-100 border-2 border-teal-300 text-teal-950 font-black text-sm md:text-base hover:bg-teal-200 transition-all btn-active shadow-2xs"
              >
                <Eye className="w-5 h-5 text-teal-700" />
                <span>Sblocca Un Altro Indizio (Vale {3 - gameState.revealedClues} Punti)</span>
              </button>
            )}
          </div>
        )}

        {/* SUCCESS FEEDBACK BANNER */}
        {gameState.guessedCorrectly === true && (
          <div className="mt-2 p-5 bg-emerald-100 border-4 border-emerald-500 rounded-3xl flex flex-col sm:flex-row items-center justify-between text-emerald-950 gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 flex-shrink-0 animate-bounce" />
              <div>
                <p className="text-xl md:text-2xl font-black font-display">
                  ESATTO! È il {targetAnimal.nome}! 🎉
                </p>
                <p className="text-sm md:text-base font-bold text-emerald-800">
                  Hai guadagnato +{gameState.roundPointsAwarded} punti per la tua collezione!
                </p>
              </div>
            </div>

            <button
              onClick={handleNextRound}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl hover:bg-emerald-700 btn-active transition-all text-base md:text-lg border-2 border-emerald-400 shrink-0"
            >
              <span>Prossimo Animale</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {gameState.guessedCorrectly === false && (
          <div className="mt-2 p-4 bg-amber-100 border-3 border-amber-400 rounded-2xl flex items-center gap-3 text-amber-950">
            <XCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
            <p className="text-sm md:text-base font-bold">
              Non è l'animale giusto! Ho sbloccato un indizio speciale per aiutarti. Riprova!
            </p>
          </div>
        )}
      </div>

      {/* 5. ANIMAL CHOICES GRID (ADAPTED BY AGE) */}
      <div
        className={`w-full grid gap-4 md:gap-5 mt-1 ${
          ageBand === '3-4' ? 'grid-cols-2' : ageBand === '5-6' ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {gameState.options.map((option) => {
          const isWrong = gameState.wrongOptions.includes(option.id);
          const isCorrectChoice = gameState.guessedCorrectly === true && option.id === targetAnimal.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={gameState.guessedCorrectly === true || isWrong}
              className={`relative group rounded-3xl p-3 border-4 flex flex-col items-center gap-2.5 transition-all duration-200 select-none shadow-lg ${
                isCorrectChoice
                  ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-105 z-10'
                  : isWrong
                  ? 'bg-gray-100 border-gray-300 opacity-40 grayscale cursor-not-allowed'
                  : 'bg-white border-teal-200 hover:border-teal-400 hover:shadow-2xl active:scale-95 btn-active'
              }`}
            >
              <div
                className={`relative w-full rounded-2xl overflow-hidden bg-amber-50 shadow-md ${
                  ageBand === '3-4' ? 'h-48 sm:h-60' : 'h-36 sm:h-44'
                }`}
              >
                <img
                  src={option.foto}
                  alt={option.nome}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {isCorrectChoice && (
                  <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-white drop-shadow-xl" />
                  </div>
                )}
                {isWrong && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-white/90" />
                  </div>
                )}
              </div>

              <span
                className={`font-black font-display text-amber-950 tracking-wide ${
                  ageBand === '3-4' ? 'text-2xl md:text-3xl' : 'text-lg sm:text-xl'
                }`}
              >
                {option.nome}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
