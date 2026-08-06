export type AnimalHabitat = 'savana' | 'oceano' | 'foresta' | 'giungla' | 'dinosauri';

export type AgeBand = '3-4' | '5-6' | '7-8' | '9-12+';

export type StatCategory = 'pesoNum' | 'velocitaNum' | 'lunghezzaNum' | 'longevitaNum';

export interface AnimalStats {
  peso: string;       // e.g. "190 kg"
  velocita: string;   // e.g. "80 km/h"
  lunghezza: string;  // e.g. "250 cm"
  longevita: string;  // e.g. "14 anni"
  
  // Numeric values for comparison or games
  pesoNum: number;
  velocitaNum: number;
  lunghezzaNum: number;
  longevitaNum: number;
}

export interface Animal {
  id: string;
  nome: string;
  foto: string;
  fotoAlt?: string;
  habitat: AnimalHabitat;
  statistiche: AnimalStats;
  fattoCurioso: string;
  indizi: [string, string, string]; // [generico, medio, specifico]
  packId?: string;
}

export interface AnimalPack {
  id: string;
  titolo: string;
  descrizione: string;
  icona: string;
  habitatPrevalente: AnimalHabitat;
  gratuito: boolean;
  unlocked: boolean;
  prezzoSimulato: string;
  animali: Animal[];
}

export type AppMode = 'scopri' | 'indovina' | 'sfida' | 'enciclopedia' | 'collezione' | 'obiettivi';

export interface ConfrontoRound {
  playerAnimal: Animal;
  opponentAnimal: Animal;
  selectedStat: StatCategory | null;
  winner: 'player' | 'opponent' | 'tie' | null;
  pointsWon: number;
}

export interface GameState {
  currentRound: number; // 0 to 7 (8 animals)
  order: number[];      // shuffled indices of animals
  revealedClues: number;// 1, 2, or 3
  score: number;
  guessedCorrectly: boolean | null;
  selectedOptionId: string | null;
  wrongOptions: string[];
  options: Animal[];
  isGameOver: boolean;
  streak: number;
  roundPointsAwarded: number | null;
}

export interface Achievement {
  id: string;
  titolo: string;
  descrizione: string;
  categoria: 'esplorazione' | 'indovina' | 'sfida' | 'collezione';
  icona: string;
  puntiPremio: number;
  progresso: number;
  maxProgresso: number;
  sbloccato: boolean;
}

export interface ChallengeQuestion {
  id: string;
  domanda: string;
  categoria: 'Fatto curioso' | 'Habitat' | 'Statistica' | 'Chi è?';
  opzioni: Animal[];
  rispostaCorrettaId: string;
  spiegazione: string;
}

export interface UserProgress {
  unlockedAnimalIds: string[];
  unlockedAchievements: string[];
  totalScore: number;
  currentStreak: number;
  highestStreak: number;
  challengeBestScore: number;
}

