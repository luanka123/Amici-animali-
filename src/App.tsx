import React, { useState, useEffect } from 'react';
import { AppMode, Achievement } from './types';
import { ANIMALI_DATA } from './data/animals';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { Header } from './components/Header';
import { CardScopri } from './components/CardScopri';
import { GiocoIndovina } from './components/GiocoIndovina';
import { ChallengeView } from './components/ChallengeView';
import { EncyclopediaView } from './components/EncyclopediaView';
import { CollectionView } from './components/CollectionView';
import { AchievementsView } from './components/AchievementsView';
import { Footer } from './components/Footer';
import { sound } from './utils/audio';
import { Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [mode, setMode] = useState<AppMode>('scopri');
  const [scopriIndex, setScopriIndex] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);

  // User persistent progress
  const [unlockedAnimalIds, setUnlockedAnimalIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('amici_animali_unlocked');
      return saved ? JSON.parse(saved) : ['leone']; // default 1 unlocked animal to start
    } catch {
      return ['leone'];
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('amici_animali_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; icon: string } | null>(null);

  // Save progress to LocalStorage
  useEffect(() => {
    localStorage.setItem('amici_animali_unlocked', JSON.stringify(unlockedAnimalIds));
  }, [unlockedAnimalIds]);

  useEffect(() => {
    localStorage.setItem('amici_animali_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check and update achievements whenever unlockedAnimalIds changes
  useEffect(() => {
    const savanaIds = ['leone', 'elefante', 'giraffa'];
    const oceanoIds = ['delfino', 'pellicano'];
    const forestaIds = ['panda-gigante', 'gufo', 'tigre'];

    const countSavana = savanaIds.filter((id) => unlockedAnimalIds.includes(id)).length;
    const countOceano = oceanoIds.filter((id) => unlockedAnimalIds.includes(id)).length;
    const countForesta = forestaIds.filter((id) => unlockedAnimalIds.includes(id)).length;

    updateAchievement('primo_scopritore', unlockedAnimalIds.length >= 1 ? 1 : 0);
    updateAchievement('re_savana', countSavana);
    updateAchievement('guardiano_oceano', countOceano);
    updateAchievement('maestro_foresta', countForesta);
    updateAchievement('collezione_completa', unlockedAnimalIds.length);
  }, [unlockedAnimalIds]);

  const triggerToast = (title: string, desc: string, icon: string) => {
    setToastMessage({ title, desc, icon });
    sound.playWin();
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const updateAchievement = (achId: string, currentProgress: number) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id !== achId) return ach;
        const newProg = Math.min(ach.maxProgresso, currentProgress);
        const newlyUnlocked = !ach.sbloccato && newProg >= ach.maxProgresso;

        if (newlyUnlocked) {
          triggerToast(`Distintivo Sbloccato! ${ach.icona}`, ach.titolo, ach.icona);
          setGameScore((score) => score + ach.puntiPremio);
        }

        return {
          ...ach,
          progresso: newProg,
          sbloccato: ach.sbloccato || newlyUnlocked,
        };
      })
    );
  };

  const unlockAnimal = (animalId: string) => {
    if (!unlockedAnimalIds.includes(animalId)) {
      setUnlockedAnimalIds((prev) => [...prev, animalId]);
      const animal = ANIMALI_DATA.find((a) => a.id === animalId);
      if (animal) {
        sound.playPop();
      }
    }
  };

  const handleAnimalGuessedCorrectly = (animalId: string, cluesUsed: number) => {
    unlockAnimal(animalId);
    if (cluesUsed === 1) {
      updateAchievement('super_indovino', 1);
    }
  };

  const handleUpdateStreak = (streak: number) => {
    if (streak >= 3) {
      updateAchievement('serie_vincente', 3);
    }
  };

  const handleSelectAnimalForScopri = (index: number) => {
    setScopriIndex(index);
    setMode('scopri');
    const animal = ANIMALI_DATA[index];
    if (animal) unlockAnimal(animal.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6ED] text-[#2D3748] font-body selection:bg-amber-200 relative overflow-x-hidden">
      {/* Decorative ambient background blur accents */}
      <div className="fixed top-12 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification Banner for Achievements */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-6 py-3.5 rounded-full shadow-2xl border-2 border-amber-200 flex items-center gap-3 font-display max-w-md w-11/12"
          >
            <span className="text-3xl">{toastMessage.icon}</span>
            <div className="flex-1">
              <span className="block text-xs font-black uppercase tracking-wider text-amber-100">
                {toastMessage.title}
              </span>
              <span className="block text-sm font-black">{toastMessage.desc}</span>
            </div>
            <Sparkles className="w-6 h-6 text-amber-200 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Header */}
      <Header
        mode={mode}
        setMode={setMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isSpeechEnabled={isSpeechEnabled}
        setIsSpeechEnabled={setIsSpeechEnabled}
        score={gameScore}
        unlockedCount={unlockedAnimalIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full my-4 flex flex-col items-center justify-center">
        {mode === 'scopri' && (
          <CardScopri
            animals={ANIMALI_DATA}
            currentIndex={scopriIndex}
            onIndexChange={setScopriIndex}
            onAnimalViewed={unlockAnimal}
          />
        )}

        {mode === 'indovina' && (
          <GiocoIndovina
            animals={ANIMALI_DATA}
            onScoreUpdate={setGameScore}
            onAnimalGuessedCorrectly={handleAnimalGuessedCorrectly}
          />
        )}

        {mode === 'sfida' && (
          <ChallengeView
            animals={ANIMALI_DATA}
            onCorrectAnswer={(id) => unlockAnimal(id)}
            onUpdateScore={(pts) => setGameScore((prev) => prev + pts)}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {mode === 'enciclopedia' && (
          <EncyclopediaView
            animals={ANIMALI_DATA}
            onSelectAnimalForMode={handleSelectAnimalForScopri}
          />
        )}

        {mode === 'collezione' && (
          <CollectionView
            animals={ANIMALI_DATA}
            unlockedAnimalIds={unlockedAnimalIds}
            onSelectAnimalForMode={handleSelectAnimalForScopri}
          />
        )}

        {mode === 'obiettivi' && (
          <AchievementsView
            achievements={achievements}
            totalScore={gameScore}
          />
        )}
      </main>

      {/* Kid-safe Footer */}
      <Footer />
    </div>
  );
}

