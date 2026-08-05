import React, { useState, useEffect } from 'react';
import { Animal, ChallengeQuestion } from '../types';
import { generateChallengeQuestions } from '../data/achievements';
import { Zap, Flame, Trophy, CheckCircle, XCircle, RotateCcw, Volume2, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../utils/audio';

interface ChallengeViewProps {
  animals: Animal[];
  onCorrectAnswer: (animalId: string, isChallenge?: boolean) => void;
  onUpdateScore: (points: number) => void;
  onUpdateStreak: (streak: number) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  animals,
  onCorrectAnswer,
  onUpdateScore,
  onUpdateStreak,
}) => {
  const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize questions
  useEffect(() => {
    startNewGame();
  }, [animals]);

  const startNewGame = () => {
    const qList = generateChallengeQuestions(animals);
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setTimeLeft(15);
    setIsFinished(false);
  };

  const currentQ = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isFinished || isAnswered || !currentQ) return;

    if (timeLeft <= 0) {
      handleOptionSelect(null, true); // Timeout answer
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnswered, currentQ]);

  const handleOptionSelect = (optionId: string | null, isTimeout = false) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQ.rispostaCorrettaId;

    if (isCorrect) {
      const bonusStreak = (streak + 1) * 5;
      const points = 10 + bonusStreak;
      const newScore = score + points;
      const newStreak = streak + 1;

      setScore(newScore);
      setStreak(newStreak);
      sound.playCorrect();
      sound.speak('Corretto! bravissimo!');


      onCorrectAnswer(currentQ.rispostaCorrettaId, true);
      onUpdateScore(points);
      onUpdateStreak(newStreak);
    } else {
      setStreak(0);
      sound.playWrong();
      if (isTimeout) {
        sound.speak('Tempo scaduto!');
      } else {
        sound.speak('Peccato, riprova alla prossima!');
      }
      onUpdateStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setTimeLeft(15);
      sound.playPop();
    } else {
      setIsFinished(true);
      sound.playWin();
      sound.speak(`Sfida completata! Hai totalizzato ${score} punti!`);

    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="frosted rounded-[36px] p-8 text-center border border-amber-300 shadow-xl space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-black font-display text-stone-900">
            Sfida Flash Completata! 🎉
          </h2>

          <div className="bg-white/80 rounded-2xl p-6 border border-amber-200 grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-stone-500 uppercase">Punteggio Totale</span>
              <span className="text-3xl font-black font-display text-amber-600">{score} PT</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-stone-500 uppercase">Domande Esatte</span>
              <span className="text-3xl font-black font-display text-emerald-600">{questions.length} / {questions.length}</span>
            </div>
          </div>

          <button
            onClick={startNewGame}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 btn-active font-display"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Gioca Ancora</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Status Bar */}
      <div className="frosted rounded-3xl p-4 flex items-center justify-between border border-amber-200 shadow-xs">
        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-sm">
            {currentIndex + 1}
          </div>
          <span className="text-xs font-bold text-stone-600">su {questions.length} Domande</span>
        </div>

        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 bg-orange-100 text-orange-900 px-3 py-1 rounded-full text-xs font-black border border-orange-200">
          <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
          <span>Serie: {streak} 🔥</span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
          timeLeft <= 5 ? 'bg-red-100 text-red-700 border-red-300 animate-bounce' : 'bg-amber-100 text-amber-900 border-amber-200'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Main Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="frosted rounded-[32px] p-6 border border-amber-300/60 shadow-md space-y-6 relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
            {currentQ.categoria}
          </span>
          <button
            onClick={() => sound.speak(currentQ.domanda)}
            className="p-2 bg-stone-100 hover:bg-amber-100 rounded-full transition-colors text-amber-900"
            title="Ascolta Domanda"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-display text-stone-900 leading-snug text-center">
          "{currentQ.domanda}"
        </h3>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.opzioni.map((animal) => {
            const isSelected = selectedOptionId === animal.id;
            const isCorrectOption = animal.id === currentQ.rispostaCorrettaId;

            let btnStyle = 'bg-white/80 hover:bg-amber-50/80 border-amber-200 text-stone-800';

            if (isAnswered) {
              if (isCorrectOption) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500 text-white border-rose-600';
              } else {
                btnStyle = 'bg-stone-100 text-stone-400 border-stone-200 opacity-60';
              }
            }

            return (
              <button
                key={animal.id}
                onClick={() => handleOptionSelect(animal.id)}
                disabled={isAnswered}
                className={`p-3.5 rounded-2xl border-2 font-black font-display text-base transition-all flex items-center gap-3 text-left btn-active ${btnStyle}`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                  <img src={animal.foto} alt={animal.nome} className="w-full h-full object-cover" />
                </div>
                <span className="flex-1">{animal.nome}</span>
                {isAnswered && isCorrectOption && <CheckCircle className="w-6 h-6 text-white shrink-0" />}
                {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-white shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-2 border-t border-amber-200"
            >
              <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 text-stone-800 text-sm font-medium">
                <span className="font-bold text-amber-950 block mb-1">
                  💡 Spiegazione:
                </span>
                {currentQ.spiegazione}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 font-display btn-active"
              >
                <span>Prossima Domanda</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
