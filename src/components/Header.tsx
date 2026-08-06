import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, HelpCircle, BookOpen, Trophy, Award, Zap, Mic, MicOff, Swords, PackageCheck, Square } from 'lucide-react';
import { AppMode } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isSpeechEnabled: boolean;
  setIsSpeechEnabled: (enabled: boolean) => void;
  score?: number;
  unlockedCount?: number;
  totalAnimalCount?: number;
  onOpenPacksModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isMuted,
  setIsMuted,
  isSpeechEnabled,
  setIsSpeechEnabled,
  score = 0,
  unlockedCount = 0,
  totalAnimalCount = 8,
  onOpenPacksModal,
}) => {
  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sound.setMuted(newMuted);
    if (!newMuted) sound.playPop();
  };

  const toggleSpeech = () => {
    const newSpeech = !isSpeechEnabled;
    setIsSpeechEnabled(newSpeech);
    sound.setSpeechEnabled(newSpeech);
    if (newSpeech) {
      sound.speak('Voce per bambini attivata!');
    } else {
      sound.stopSpeech();
    }
  };

  const handleModeChange = (newMode: AppMode) => {
    sound.playPop();
    sound.stopSpeech();
    setMode(newMode);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6ED]/90 backdrop-blur-md border-b border-amber-200/50 shadow-sm px-3 py-2">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleModeChange('scopri')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-display text-amber-950 tracking-tight flex items-center gap-1.5">
              Amici Animali
            </h1>
            <p className="text-[11px] font-bold text-amber-800/70 hidden lg:block">
              La tua avventura nella natura 🐾
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Frosted Glass Container */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl frosted border border-amber-200/60 shadow-xs overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => handleModeChange('scopri')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'scopri'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Scopri</span>
          </button>

          <button
            onClick={() => handleModeChange('indovina')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'indovina'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Indovina</span>
          </button>

          <button
            onClick={() => handleModeChange('sfida')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'sfida'
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm ring-1 ring-amber-300'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>3. Sfida Top Trumps ⚔️</span>
          </button>

          <button
            onClick={() => handleModeChange('enciclopedia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'enciclopedia'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Enciclopedia</span>
          </button>

          <button
            onClick={() => handleModeChange('collezione')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'collezione'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Album ({unlockedCount}/{totalAnimalCount})</span>
          </button>

          <button
            onClick={() => handleModeChange('obiettivi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'obiettivi'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Obiettivi</span>
          </button>
        </nav>

        {/* Audio Controls & Pack Selector */}
        <div className="flex items-center gap-2">
          {/* Pack Selector Modal Trigger */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenPacksModal();
            }}
            className="flex items-center gap-1.5 bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs transition-all btn-active"
            title="Scegli i Pacchetti Animali"
          >
            <PackageCheck className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Pacchetti</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              sound.stopSpeech();
            }}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white border border-rose-600 px-3 py-1.5 rounded-xl text-xs font-black shadow-md transition-all btn-active"
            title="Interrompi immediatamente la lettura vocale in corso"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>Stop Voce 🛑</span>
          </button>

          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl border transition-all btn-active ${
              isSpeechEnabled
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-stone-100 border-stone-200 text-stone-400'
            }`}
            title={isSpeechEnabled ? 'Lettura vocale attiva' : 'Lettura vocale disattivata'}
          >
            {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all btn-active ${
              !isMuted
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-stone-100 border-stone-200 text-stone-400'
            }`}
            title={isMuted ? 'Suoni silenziati' : 'Suoni attivi'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {score > 0 && (
            <div className="flex items-center gap-1 bg-amber-500 text-white border border-amber-600 px-2.5 py-1 rounded-xl text-xs font-black font-display shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-200" />
              <span>{score} PT</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


