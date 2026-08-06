import React, { useState, useEffect } from 'react';
import { Animal, StatCategory } from '../types';
import { HabitatBadge } from './HabitatBadge';
import { sound } from '../utils/audio';
import {
  Trophy,
  Flame,
  Swords,
  RotateCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Equal,
  Scale,
  Zap,
  Ruler,
  Calendar,
  Users,
  Globe,
  Radio,
  User,
  Send,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ConfrontoViewProps {
  animals: Animal[];
  onScoreUpdate: (points: number) => void;
  onStreakUpdate: (streak: number) => void;
}

type SfidaSubMode = 'single' | 'pass' | 'room' | 'leaderboard';

interface LeaderboardEntry {
  id: string;
  nome: string;
  punti: number;
  vittorieConsecutive: number;
  paese: string;
  avatar: string;
  data: string;
}

const DEFAULT_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', nome: 'Marco (Roma) 🇮🇹', punti: 1850, vittorieConsecutive: 12, paese: '🇮🇹', avatar: '🦁', data: 'Oggi' },
  { id: '2', nome: 'Sophie (Parigi) 🇫🇷', punti: 1620, vittorieConsecutive: 9, paese: '🇫🇷', avatar: '🐬', data: 'Oggi' },
  { id: '3', nome: 'Leo (Madrid) 🇪🇸', punti: 1490, vittorieConsecutive: 8, paese: '🇪🇸', avatar: '🦅', data: 'Ieri' },
  { id: '4', nome: 'Kenji (Tokyo) 🇯🇵', punti: 1350, vittorieConsecutive: 7, paese: '🇯🇵', avatar: '🐼', data: '2 gg fa' },
  { id: '5', nome: 'Emma (Londra) 🇬🇧', punti: 1210, vittorieConsecutive: 6, paese: '🇬🇧', avatar: '🐯', data: '3 gg fa' },
  { id: '6', nome: 'Luca (Milano) 🇮🇹', punti: 1080, vittorieConsecutive: 5, paese: '🇮🇹', avatar: '🦉', data: '4 gg fa' },
];

const STAT_CONFIGS: Record<StatCategory, { label: string; unitLabel: string; icon: any; color: string; bg: string }> = {
  pesoNum: { label: 'Peso', unitLabel: 'peso', icon: Scale, color: 'text-amber-700', bg: 'bg-amber-100/90 border-amber-300' },
  velocitaNum: { label: 'Velocità', unitLabel: 'velocità', icon: Zap, color: 'text-orange-700', bg: 'bg-orange-100/90 border-orange-300' },
  lunghezzaNum: { label: 'Lunghezza', unitLabel: 'lunghezza', icon: Ruler, color: 'text-teal-700', bg: 'bg-teal-100/90 border-teal-300' },
  longevitaNum: { label: 'Longevità', unitLabel: 'longevità', icon: Calendar, color: 'text-purple-700', bg: 'bg-purple-100/90 border-purple-300' },
};

export const ConfrontoView: React.FC<ConfrontoViewProps> = ({
  animals,
  onScoreUpdate,
  onStreakUpdate,
}) => {
  const [subMode, setSubMode] = useState<SfidaSubMode>('single');

  // Single player / Pass & play state
  const [playerAnimal, setPlayerAnimal] = useState<Animal | null>(null);
  const [opponentAnimal, setOpponentAnimal] = useState<Animal | null>(null);
  const [selectedStat, setSelectedStat] = useState<StatCategory | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | 'tie' | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [totalWins, setTotalWins] = useState<number>(0);

  // Pass-Device names & scores
  const [p1Name, setP1Name] = useState<string>('Giocatore 1 🦁');
  const [p2Name, setP2Name] = useState<string>('Giocatore 2 🐬');
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [turnPlayer, setTurnPlayer] = useState<'P1' | 'P2'>('P1');

  // Online Room State (PIN Sync)
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [roomConnected, setRoomConnected] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('amici_animali_global_leaderboard');
      return saved ? JSON.parse(saved) : DEFAULT_GLOBAL_LEADERBOARD;
    } catch {
      return DEFAULT_GLOBAL_LEADERBOARD;
    }
  });
  const [playerNameInput, setPlayerNameInput] = useState<string>('Piccolo Esploratore');
  const [playerAvatarInput, setPlayerAvatarInput] = useState<string>('🦁');
  const [isSubmittedToLeaderboard, setIsSubmittedToLeaderboard] = useState<boolean>(false);

  // Broadcast Channel for live room sync across devices/tabs
  useEffect(() => {
    if (!roomCode) return;

    try {
      const channel = new BroadcastChannel(`amici_animali_room_${roomCode}`);
      channel.onmessage = (event) => {
        const data = event.data;
        if (data.type === 'JOIN_ROOM') {
          setRoomConnected(true);
          sound.playWin();
        } else if (data.type === 'PLAY_STAT') {
          setSelectedStat(data.statKey);
          setIsRevealed(true);
          setWinner(data.winner);
          sound.playCorrect();
        } else if (data.type === 'NEXT_ROUND') {
          startNewRound();
        }
      };

      return () => {
        channel.close();
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in iframe', e);
    }
  }, [roomCode]);

  // Save leaderboard to LocalStorage
  useEffect(() => {
    localStorage.setItem('amici_animali_global_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Initialize a new round with 2 distinct random animals
  const startNewRound = () => {
    sound.playPop();
    if (animals.length < 2) return;

    const idx1 = Math.floor(Math.random() * animals.length);
    let idx2 = Math.floor(Math.random() * animals.length);
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * animals.length);
    }

    setPlayerAnimal(animals[idx1]);
    setOpponentAnimal(animals[idx2]);
    setSelectedStat(null);
    setIsRevealed(false);
    setWinner(null);
    setRoundScore(0);
  };

  useEffect(() => {
    startNewRound();
  }, [animals]);

  if (!playerAnimal || !opponentAnimal) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-amber-900 font-bold">Caricamento animali per la sfida...</p>
      </div>
    );
  }

  const handleStatSelect = (statKey: StatCategory) => {
    if (isRevealed) return; // Prevent double click

    sound.playPop();
    setSelectedStat(statKey);
    setIsRevealed(true);

    const valPlayer = playerAnimal.statistiche[statKey];
    const valOpponent = opponentAnimal.statistiche[statKey];

    let result: 'player' | 'opponent' | 'tie' = 'tie';
    if (valPlayer > valOpponent) {
      result = 'player';
    } else if (valOpponent > valPlayer) {
      result = 'opponent';
    }

    setWinner(result);

    // Broadcast if in room mode
    if (roomCode) {
      try {
        const channel = new BroadcastChannel(`amici_animali_room_${roomCode}`);
        channel.postMessage({ type: 'PLAY_STAT', statKey, winner: result });
        channel.close();
      } catch (e) {
        console.warn(e);
      }
    }

    if (subMode === 'pass') {
      if (result === 'player') {
        setP1Score((prev) => prev + 1);
        sound.playCorrect();
        sound.speak(`Vince ${p1Name}! ${playerAnimal.nome} batte ${opponentAnimal.nome}!`);
      } else if (result === 'opponent') {
        setP2Score((prev) => prev + 1);
        sound.playCorrect();
        sound.speak(`Vince ${p2Name}! ${opponentAnimal.nome} batte ${playerAnimal.nome}!`);
      } else {
        sound.speak(`Pareggio tra ${p1Name} e ${p2Name}!`);
      }
      return;
    }

    if (result === 'player') {
      const newStreak = streak + 1;
      const points = 15 + newStreak * 5;
      setStreak(newStreak);
      setRoundScore(points);
      setTotalWins((prev) => prev + 1);
      onScoreUpdate(points);
      onStreakUpdate(newStreak);

      sound.playCorrect();
      sound.speak(`Vinto! Il tuo ${playerAnimal.nome} batte ${opponentAnimal.nome} in ${STAT_CONFIGS[statKey].label}!`);

      if (newStreak % 3 === 0) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else if (result === 'opponent') {
      setStreak(0);
      onStreakUpdate(0);
      sound.playWrong();
      sound.speak(`Peccato! ${opponentAnimal.nome} vince in ${STAT_CONFIGS[statKey].label}.`);
    } else {
      sound.playPop();
      sound.speak(`Pareggio perfetto! Entrambi gli animali hanno lo stesso valore.`);
    }
  };

  const handleCreateRoom = () => {
    sound.playPop();
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(pin);
    setIsHost(true);
    setRoomConnected(false);
  };

  const handleJoinRoom = () => {
    if (!inputRoomCode.trim()) return;
    sound.playPop();
    const pin = inputRoomCode.trim();
    setRoomCode(pin);
    setIsHost(false);
    setRoomConnected(true);

    try {
      const channel = new BroadcastChannel(`amici_animali_room_${pin}`);
      channel.postMessage({ type: 'JOIN_ROOM' });
      channel.close();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmitScoreToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerNameInput.trim()) return;

    sound.playWin();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      nome: `${playerNameInput.trim()} 🇮🇹`,
      punti: Math.max(50, totalWins * 30 + streak * 10),
      vittorieConsecutive: streak,
      paese: '🇮🇹',
      avatar: playerAvatarInput,
      data: 'Oggi',
    };

    setLeaderboard((prev) => [newEntry, ...prev].sort((a, b) => b.punti - a.punti));
    setIsSubmittedToLeaderboard(true);
  };

  return (
    <div className="w-full max-w-5xl md:max-w-6xl mx-auto space-y-5 px-3 md:px-6 py-3">
      {/* Top Banner Guidance */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4.5 rounded-3xl shadow-lg border-2 border-amber-300 gap-3">
        <div className="flex items-center gap-3">
          <Swords className="w-9 h-9 animate-pulse text-yellow-300 shrink-0" />
          <div>
            <h2 className="text-xl md:text-2xl font-black font-display leading-tight">
              3. Modalità Sfida Super Trumps! ⚔️
            </h2>
            <p className="text-xs md:text-sm text-amber-100 font-bold">
              Estrazione casuale, scegli la statistica migliore e vince il valore più alto!
            </p>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-sm self-end md:self-auto">
          <Flame className={`w-6 h-6 ${streak > 0 ? 'text-yellow-300 animate-bounce' : 'text-amber-200'}`} />
          <div className="text-right">
            <span className="text-xs font-black uppercase text-amber-100 block">Vittorie Consecutive</span>
            <span className="text-lg font-black leading-none">{streak} 🔥</span>
          </div>
        </div>
      </div>

      {/* Sub-mode Switcher: 1v1 Bot vs Passa-Dispositivo vs Stanza Online vs Classifica */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-amber-100/90 p-1.5 rounded-2xl border-2 border-amber-300 gap-2">
        <button
          onClick={() => {
            sound.playPop();
            setSubMode('single');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 btn-active ${
            subMode === 'single'
              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Contro AI Bot 🤖</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setSubMode('pass');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 btn-active ${
            subMode === 'pass'
              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2 Giocatori Locale 👥</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setSubMode('room');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 btn-active ${
            subMode === 'room'
              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Stanza Online PIN 📡</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setSubMode('leaderboard');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs md:text-sm transition-all flex items-center justify-center gap-1.5 btn-active ${
            subMode === 'leaderboard'
              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Classifica Mondiale 🌍</span>
        </button>
      </div>

      {/* SUBMODE 1 & 2 & 3: GAME BATTLEFIELD */}
      {(subMode === 'single' || subMode === 'pass' || subMode === 'room') && (
        <div className="space-y-5">
          {/* SubMode specific instructions / banner */}
          {subMode === 'pass' && (
            <div className="p-4 bg-teal-100 border-3 border-teal-400 rounded-2xl flex items-center justify-between text-teal-950 shadow-sm">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-teal-700 shrink-0" />
                <div>
                  <h4 className="font-black text-base md:text-lg">Modalità Passa-Dispositivo (Locale)</h4>
                  <p className="text-xs md:text-sm font-bold text-teal-900">
                    Sullo stesso schermo! P1 ({p1Name}): {p1Score} PT | P2 ({p2Name}): {p2Score} PT
                  </p>
                </div>
              </div>
            </div>
          )}

          {subMode === 'room' && (
            <div className="p-5 bg-purple-100 border-3 border-purple-400 rounded-3xl space-y-3 text-purple-950 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-6 h-6 text-purple-700 animate-pulse" />
                  <h4 className="font-black text-lg">Collegamento Scontro tra 2 Dispositivi</h4>
                </div>
                {roomCode && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-xl text-xs font-black">
                    Codice PIN: {roomCode}
                  </span>
                )}
              </div>

              {!roomCode ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                  <button
                    onClick={handleCreateRoom}
                    className="w-full sm:w-auto py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-md border-2 border-purple-400 btn-active flex items-center justify-center gap-2 text-sm"
                  >
                    <Radio className="w-5 h-5" />
                    <span>Crea Nuova Stanza (Ottieni Codice)</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Inserisci Codice PIN (es. 7392)"
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value)}
                      className="px-4 py-2.5 rounded-2xl border-2 border-purple-300 text-sm font-black text-purple-950 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    />
                    <button
                      onClick={handleJoinRoom}
                      className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl shadow-md border-2 border-teal-400 btn-active text-sm shrink-0"
                    >
                      Collegati
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-purple-300">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm font-black">
                        Stanza Attiva: <strong className="text-purple-700 font-mono text-base">{roomCode}</strong>
                      </p>
                      <p className="text-xs text-purple-800 font-bold">
                        {roomConnected ? '🟢 Dispositivo Sfidante Collegato Live!' : '🟡 In attesa dell\'altro dispositivo con il codice...'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyRoomCode}
                    className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl font-bold text-xs flex items-center gap-1 border border-purple-300"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copiato!' : 'Copia PIN'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Main 2-Card Comparison Stage - ENLARGED FULL SCREEN WIDTH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PLAYER CARD */}
            <div className="frosted rounded-[32px] p-5 border-4 border-amber-400 bg-white/95 shadow-xl relative flex flex-col justify-between">
              <div className="absolute top-4 left-4 bg-amber-500 text-white font-black text-xs md:text-sm px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-amber-300 z-10">
                {subMode === 'pass' ? p1Name : 'Il Tuo Animale'}
              </div>

              <div className="pt-8 pb-3 text-center">
                <div className="relative w-full h-48 sm:h-60 md:h-72 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-md bg-amber-950 mb-4">
                  <img
                    src={playerAnimal.foto}
                    alt={playerAnimal.nome}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3">
                    <HabitatBadge habitat={playerAnimal.habitat} size="md" />
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-black font-display text-amber-950">
                  {playerAnimal.nome}
                </h3>
              </div>

              {/* Player Stats Buttons - BIGGER & SPACIOUS */}
              <div className="space-y-2.5 mt-2">
                <p className="text-xs md:text-sm font-black text-center text-amber-900 uppercase tracking-wide">
                  {isRevealed ? 'Confronto Statistiche:' : 'Tocca la statistica più forte per attaccare:'}
                </p>

                {(Object.keys(STAT_CONFIGS) as StatCategory[]).map((key) => {
                  const cfg = STAT_CONFIGS[key];
                  const Icon = cfg.icon;
                  const isSelected = selectedStat === key;
                  const isWinningStat = isRevealed && isSelected && winner === 'player';
                  const isLosingStat = isRevealed && isSelected && winner === 'opponent';

                  return (
                    <button
                      key={key}
                      disabled={isRevealed}
                      onClick={() => handleStatSelect(key)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-sm md:text-base font-extrabold transition-all btn-active ${
                        isWinningStat
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-4 ring-emerald-300'
                          : isLosingStat
                          ? 'bg-rose-500 text-white border-rose-600 opacity-90'
                          : isSelected
                          ? 'bg-amber-500 text-white border-amber-600'
                          : isRevealed
                          ? 'bg-stone-100 text-stone-600 border-stone-200'
                          : `${cfg.bg} text-amber-950 hover:scale-[1.02] hover:shadow-md`
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{cfg.label}</span>
                      </div>
                      <span className="font-black text-base md:text-lg">
                        {key === 'pesoNum' && playerAnimal.statistiche.peso}
                        {key === 'velocitaNum' && playerAnimal.statistiche.velocita}
                        {key === 'lunghezzaNum' && playerAnimal.statistiche.lunghezza}
                        {key === 'longevitaNum' && playerAnimal.statistiche.longevita}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OPPONENT CARD */}
            <div
              className={`frosted rounded-[32px] p-5 border-4 transition-all relative flex flex-col justify-between ${
                isRevealed
                  ? winner === 'opponent'
                    ? 'border-emerald-500 bg-emerald-50/90 shadow-xl'
                    : 'border-amber-300 bg-white/95 shadow-md'
                  : 'border-amber-200 bg-amber-50/80'
              }`}
            >
              <div className="absolute top-4 right-4 bg-stone-800 text-white font-black text-xs md:text-sm px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-stone-600 z-10">
                {subMode === 'pass' ? p2Name : 'Sfidante'}
              </div>

              {/* Opponent Reveal Content */}
              <div className="pt-8 pb-3 text-center">
                {isRevealed ? (
                  <motion.div
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-full h-48 sm:h-60 md:h-72 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-md bg-amber-950 mb-4">
                      <img
                        src={opponentAnimal.foto}
                        alt={opponentAnimal.nome}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3">
                        <HabitatBadge habitat={opponentAnimal.habitat} size="md" />
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black font-display text-amber-950">
                      {opponentAnimal.nome}
                    </h3>
                  </motion.div>
                ) : (
                  <div className="w-full h-48 sm:h-60 md:h-72 rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 border-3 border-amber-300 flex flex-col items-center justify-center p-6 mb-4 shadow-inner">
                    <Swords className="w-16 h-16 text-amber-800 animate-bounce mb-3" />
                    <p className="text-base md:text-lg font-black text-amber-950 text-center">
                      Animale Sfidante Misterioso! ❓
                    </p>
                    <p className="text-xs md:text-sm font-bold text-amber-900 text-center mt-1">
                      Scegli la tua statistica migliore a sinistra per svelare la carta!
                    </p>
                  </div>
                )}
              </div>

              {/* Opponent Revealed Stats */}
              <div className="space-y-2.5 mt-2">
                <p className="text-xs md:text-sm font-black text-center text-amber-900 uppercase tracking-wide">
                  {isRevealed ? 'Statistiche Sfidante:' : '???'}
                </p>

                {(Object.keys(STAT_CONFIGS) as StatCategory[]).map((key) => {
                  const cfg = STAT_CONFIGS[key];
                  const Icon = cfg.icon;
                  const isSelected = selectedStat === key;
                  const isOpponentWin = isRevealed && isSelected && winner === 'opponent';

                  return (
                    <div
                      key={key}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-sm md:text-base font-extrabold transition-all ${
                        isRevealed
                          ? isOpponentWin
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-4 ring-emerald-300'
                            : isSelected
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                          : 'bg-amber-100/60 text-amber-900/60 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{cfg.label}</span>
                      </div>
                      <span className="font-black text-base md:text-lg">
                        {isRevealed ? (
                          <>
                            {key === 'pesoNum' && opponentAnimal.statistiche.peso}
                            {key === 'velocitaNum' && opponentAnimal.statistiche.velocita}
                            {key === 'lunghezzaNum' && opponentAnimal.statistiche.lunghezza}
                            {key === 'longevitaNum' && opponentAnimal.statistiche.longevita}
                          </>
                        ) : (
                          '???'
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Banner & Next Round Button */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-[32px] border-4 text-center shadow-2xl space-y-4 ${
                  winner === 'player'
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                    : winner === 'opponent'
                    ? 'bg-rose-100 border-rose-500 text-rose-950'
                    : 'bg-amber-100 border-amber-500 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {winner === 'player' && (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                      <span className="text-2xl md:text-3xl font-black font-display">
                        Vittoria Strepitosa! (+{roundScore} PT) 🎉
                      </span>
                    </>
                  )}
                  {winner === 'opponent' && (
                    <>
                      <XCircle className="w-10 h-10 text-rose-600" />
                      <span className="text-2xl md:text-3xl font-black font-display">
                        L'Avversario ha prevalso!
                      </span>
                    </>
                  )}
                  {winner === 'tie' && (
                    <>
                      <Equal className="w-10 h-10 text-amber-600" />
                      <span className="text-2xl md:text-3xl font-black font-display">
                        Parità Assoluta! 🤝
                      </span>
                    </>
                  )}
                </div>

                <p className="text-base md:text-lg font-extrabold">
                  {selectedStat && winner === 'player' && (
                    <>
                      Il tuo <strong>{playerAnimal.nome}</strong> supera <strong>{opponentAnimal.nome}</strong> in{' '}
                      {STAT_CONFIGS[selectedStat].label}!
                    </>
                  )}
                  {selectedStat && winner === 'opponent' && (
                    <>
                      <strong>{opponentAnimal.nome}</strong> vince in {STAT_CONFIGS[selectedStat].label}. Prova
                      un'altra sfida!
                    </>
                  )}
                  {selectedStat && winner === 'tie' && (
                    <>I due animali sono equivalenti nella categoria {STAT_CONFIGS[selectedStat].label}.</>
                  )}
                </p>

                <button
                  onClick={startNewRound}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl transition-all btn-active flex items-center justify-center gap-3 border-2 border-amber-300"
                >
                  <RotateCw className="w-6 h-6" />
                  <span>Prossimo Scontro ⚔️</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* SUBMODE 4: GLOBAL WORLD LEADERBOARD */}
      {subMode === 'leaderboard' && (
        <div className="space-y-6">
          {/* Submit Player Score to Global Championship Form */}
          <div className="frosted bg-white/95 rounded-[32px] border-4 border-amber-400 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              <div>
                <h3 className="text-xl md:text-2xl font-black font-display text-amber-950">
                  Registra il Tuo Nome per la Classifica Mondiale! 🏆
                </h3>
                <p className="text-xs md:text-sm font-bold text-amber-900">
                  Invia la tua streak attuale ({streak} vittorie consecutive) per comparire nella gara mondiale!
                </p>
              </div>
            </div>

            {isSubmittedToLeaderboard ? (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-950 flex items-center gap-3 font-extrabold text-base">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <span>Punteggio inviato con successo alla Classifica Mondiale! Guarda la tua posizione in tabella! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitScoreToLeaderboard} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="text"
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  placeholder="Inserisci il tuo soprannome..."
                  className="w-full sm:flex-1 px-4 py-3 rounded-2xl border-2 border-amber-300 font-black text-amber-950 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
                  required
                />

                <select
                  value={playerAvatarInput}
                  onChange={(e) => setPlayerAvatarInput(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl border-2 border-amber-300 font-black text-amber-950 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
                >
                  <option value="🦁">🦁 Leone</option>
                  <option value="🐬">🐬 Delfino</option>
                  <option value="🦅">🦅 Aquila</option>
                  <option value="🐼">🐼 Panda</option>
                  <option value="🐯">🐯 Tigre</option>
                  <option value="🦉">🦉 Gufo</option>
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base rounded-2xl shadow-md border-2 border-amber-300 btn-active flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-5 h-5" />
                  <span>Invia Punteggio</span>
                </button>
              </form>
            )}
          </div>

          {/* Global World Rankings Table */}
          <div className="frosted bg-white/95 rounded-[32px] border-4 border-amber-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-7 h-7 text-teal-600" />
                <h3 className="text-xl md:text-2xl font-black font-display text-amber-950">
                  Classifica Generale Mondiali Super Trumps
                </h3>
              </div>
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                Live World Sync 🌍
              </span>
            </div>

            <div className="space-y-3">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300'
                      : idx === 1
                      ? 'bg-stone-100 border-stone-300'
                      : idx === 2
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-amber-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shadow-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-500 text-white'
                          : idx === 1
                          ? 'bg-stone-400 text-white'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-100 text-amber-950'
                      }`}
                    >
                      #{idx + 1}
                    </span>

                    <span className="text-2xl">{item.avatar}</span>

                    <div>
                      <h4 className="font-black text-base md:text-lg text-amber-950 leading-tight">
                        {item.nome}
                      </h4>
                      <p className="text-xs font-bold text-amber-800">
                        Streak: {item.vittorieConsecutive} vittorie 🔥 • Aggiornato: {item.data}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-black font-display text-amber-950 block">
                      {item.punti} PT
                    </span>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      {idx === 0 ? '🏆 Campione' : 'Mondiale'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
