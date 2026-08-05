import React from 'react';
import { Achievement } from '../types';
import { Award, CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface AchievementsViewProps {
  achievements: Achievement[];
  totalScore: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  totalScore,
}) => {
  const unlockedCount = achievements.filter((a) => a.sbloccato).length;
  const totalCount = achievements.length;
  const totalBonusPoints = achievements
    .filter((a) => a.sbloccato)
    .reduce((sum, a) => sum + a.puntiPremio, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="frosted rounded-[32px] p-6 text-center border border-indigo-200/60 shadow-md relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>I Tuoi Distintivi Speciali</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-stone-900">
              Obiettivi & Traguardi 🏅
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-600">
              Completa le sfide del gioco per guadagnare distintivi d'oro e punti bonus!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-indigo-200 text-center min-w-[120px] shadow-2xs">
              <span className="block text-2xl font-black font-display text-indigo-700">
                {unlockedCount} / {totalCount}
              </span>
              <span className="text-[10px] font-bold text-stone-500 uppercase">
                Distintivi
              </span>
            </div>

            <div className="bg-amber-50 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 text-center min-w-[120px] shadow-2xs">
              <span className="block text-2xl font-black font-display text-amber-600 flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                {totalBonusPoints}
              </span>
              <span className="text-[10px] font-bold text-amber-800 uppercase">
                Punti Bonus
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Badges & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const isUnlocked = ach.sbloccato;
          const percentage = Math.min(
            100,
            Math.round((ach.progresso / ach.maxProgresso) * 100)
          );

          return (
            <motion.div
              key={ach.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-3xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
                isUnlocked
                  ? 'bg-gradient-to-r from-amber-50/90 via-white/80 to-indigo-50/90 border-indigo-200 shadow-sm'
                  : 'bg-white/60 border-stone-200 opacity-85'
              }`}
            >
              {/* Badge Icon Bubble */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs border ${
                  isUnlocked
                    ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400/40'
                    : 'bg-stone-200 border-stone-300 grayscale'
                }`}
              >
                {ach.icona}
              </div>

              {/* Text Info */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold font-display text-stone-900 text-base truncate">
                    {ach.titolo}
                  </h3>
                  {isUnlocked ? (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Sbloccato!
                    </span>
                  ) : (
                    <span className="bg-stone-100 text-stone-600 border border-stone-300 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      In corso
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-stone-600 leading-snug">
                  {ach.descrizione}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-stone-500">
                    <span>
                      Progresso: {ach.progresso} / {ach.maxProgresso}
                    </span>
                    <span className="text-indigo-600">+{ach.puntiPremio} PT</span>
                  </div>

                  <div className="w-full bg-stone-200/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-amber-400 to-indigo-600'
                          : 'bg-indigo-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
