import React, { useState, useEffect, useMemo } from 'react';
import { AppMode, Achievement, AnimalPack, Animal } from './types';
import { INITIAL_PACKS } from './data/packs';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { Header } from './components/Header';
import { CardScopri } from './components/CardScopri';
import { GiocoIndovina } from './components/GiocoIndovina';
import { ConfrontoView } from './components/ConfrontoView';
import { EncyclopediaView } from './components/EncyclopediaView';
import { CollectionView } from './components/CollectionView';
import { AchievementsView } from './components/AchievementsView';
import { PackSelectorModal } from './components/PackSelectorModal';
import { Footer } from './components/Footer';
import { sound } from './utils/audio';
import { getAnimalPhoto } from './services/pexels';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [mode, setMode] = useState<AppMode>('scopri');
  const [scopriIndex, setScopriIndex] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [isPacksModalOpen, setIsPacksModalOpen] = useState<boolean>(false);

  // Packs State
  const [packs, setPacks] = useState<AnimalPack[]>(() => {
    try {
      const savedUnlocked = localStorage.getItem('amici_animali_unlocked_packs');
      const unlockedIds: string[] = savedUnlocked ? JSON.parse(savedUnlocked) : ['pack_mix'];
      return INITIAL_PACKS.map(p => ({
        ...p,
        unlocked: p.gratuito || unlockedIds.includes(p.id),
      }));
    } catch {
      return INITIAL_PACKS;
    }
  });

  const [activePackIds, setActivePackIds] = useState<string[]>(() => {
    try {
      const savedActive = localStorage.getItem('amici_animali_active_packs');
      return savedActive ? JSON.parse(savedActive) : ['pack_mix'];
    } catch {
      return ['pack_mix'];
    }
  });

  // User persistent unlocked animals progress
  const [unlockedAnimalIds, setUnlockedAnimalIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('amici_animali_unlocked');
      return saved ? JSON.parse(saved) : ['leone'];
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

  // Active combined animals from currently enabled packs (deduplicated by id)
  const rawAnimals = useMemo(() => {
    const combined: Animal[] = [];
    const seen = new Set<string>();

    packs.forEach(pack => {
      if (pack.unlocked && activePackIds.includes(pack.id)) {
        pack.animali.forEach(animal => {
          if (!seen.has(animal.id)) {
            seen.add(animal.id);
            combined.push(animal);
          }
        });
      }
    });

    // Fallback if no active pack is selected
    if (combined.length === 0) {
      return packs[0].animali;
    }
    return combined;
  }, [packs, activePackIds]);

  // Enhanced animals state with Pexels photos loaded via cache/API
  const [animalsWithPexels, setAnimalsWithPexels] = useState<Animal[]>(rawAnimals);

  // Load real Pexels photos in background with caching
  useEffect(() => {
    let isMounted = true;

    async function loadPexelsPhotos() {
      const updatedList = await Promise.all(
        rawAnimals.map(async (animal) => {
          const photoUrl = await getAnimalPhoto(animal.nome, animal.foto);
          return {
            ...animal,
            foto: photoUrl,
          };
        })
      );

      if (isMounted) {
        setAnimalsWithPexels(updatedList);
      }
    }

    loadPexelsPhotos();

    return () => {
      isMounted = false;
    };
  }, [rawAnimals]);

  // Save progress to LocalStorage
  useEffect(() => {
    localStorage.setItem('amici_animali_unlocked', JSON.stringify(unlockedAnimalIds));
  }, [unlockedAnimalIds]);

  useEffect(() => {
    localStorage.setItem('amici_animali_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    const unlockedIds = packs.filter(p => p.unlocked).map(p => p.id);
    localStorage.setItem('amici_animali_unlocked_packs', JSON.stringify(unlockedIds));
  }, [packs]);

  useEffect(() => {
    localStorage.setItem('amici_animali_active_packs', JSON.stringify(activePackIds));
  }, [activePackIds]);

  // Check and update achievements whenever unlockedAnimalIds changes
  useEffect(() => {
    const countSavana = ['leone', 'elefante', 'giraffa'].filter((id) => unlockedAnimalIds.includes(id)).length;
    const countOceano = ['delfino', 'pellicano'].filter((id) => unlockedAnimalIds.includes(id)).length;
    const countForesta = ['panda-gigante', 'gufo', 'tigre'].filter((id) => unlockedAnimalIds.includes(id)).length;

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
    const animal = animalsWithPexels[index];
    if (animal) unlockAnimal(animal.id);
  };

  const handleToggleActivePack = (packId: string) => {
    if (activePackIds.includes(packId)) {
      if (activePackIds.length > 1) {
        setActivePackIds(prev => prev.filter(id => id !== packId));
      }
    } else {
      setActivePackIds(prev => [...prev, packId]);
    }
  };

  const handleUnlockPack = (packId: string) => {
    setPacks(prev => prev.map(p => p.id === packId ? { ...p, unlocked: true } : p));
    if (!activePackIds.includes(packId)) {
      setActivePackIds(prev => [...prev, packId]);
    }
    triggerToast('Nuovo Pacchetto Sbloccato! 🎁', 'Ora hai accesso a nuovi fantastici animali!', '🦁');
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
        totalAnimalCount={animalsWithPexels.length}
        onOpenPacksModal={() => setIsPacksModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full my-4 flex flex-col items-center justify-center">
        {mode === 'scopri' && (
          <CardScopri
            animals={animalsWithPexels}
            currentIndex={scopriIndex}
            onIndexChange={setScopriIndex}
            onAnimalViewed={unlockAnimal}
          />
        )}

        {mode === 'indovina' && (
          <GiocoIndovina
            animals={animalsWithPexels}
            onScoreUpdate={(pts) => setGameScore(prev => prev + pts)}
            onAnimalGuessedCorrectly={handleAnimalGuessedCorrectly}
          />
        )}

        {mode === 'sfida' && (
          <ConfrontoView
            animals={animalsWithPexels}
            onScoreUpdate={(pts) => setGameScore((prev) => prev + pts)}
            onStreakUpdate={handleUpdateStreak}
          />
        )}

        {mode === 'enciclopedia' && (
          <EncyclopediaView
            animals={animalsWithPexels}
            onSelectAnimalForMode={handleSelectAnimalForScopri}
          />
        )}

        {mode === 'collezione' && (
          <CollectionView
            animals={animalsWithPexels}
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

      {/* Pack Selector Modal */}
      <PackSelectorModal
        isOpen={isPacksModalOpen}
        onClose={() => setIsPacksModalOpen(false)}
        packs={packs}
        activePackIds={activePackIds}
        onToggleActivePack={handleToggleActivePack}
        onUnlockPack={handleUnlockPack}
      />

      {/* Kid-safe Footer */}
      <Footer />
    </div>
  );
}


