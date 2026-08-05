import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, HelpCircle, BookOpen, Trophy, Award, Zap, Mic, MicOff } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-[#FAF6ED]/85 backdrop-blur-md border-b border-amber-200/50 shadow-sm px-3 py-2.5">
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
            <span>Scopri</span>
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
            <span>Indovina</span>
          </button>

          <button
            onClick={() => handleModeChange('sfida')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all duration-200 whitespace-nowrap btn-active ${
              mode === 'sfida'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Sfida Flash</span>
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
            <span>Album ({unlockedCount}/8)</span>
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

        {/* Audio Controls & Total Score */}
        <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-1 bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-xl text-xs font-black font-display shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{score} PT</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

