import { Achievement, Animal, ChallengeQuestion } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'primo_scopritore',
    titolo: 'Primo Incontro 🐾',
    descrizione: 'Incontra il tuo primo animale nella modalità Scopri o Indovina.',
    categoria: 'esplorazione',
    icona: '🐾',
    puntiPremio: 10,
    progresso: 0,
    maxProgresso: 1,
    sbloccato: false,
  },
  {
    id: 're_savana',
    titolo: 'Esploratore della Savana ☀️',
    descrizione: 'Sblocca tutti e 3 gli animali della Savana (Leone, Elefante, Giraffa).',
    categoria: 'collezione',
    icona: '🦁',
    puntiPremio: 25,
    progresso: 0,
    maxProgresso: 3,
    sbloccato: false,
  },
  {
    id: 'guardiano_oceano',
    titolo: 'Guardiano dell\'Oceano 🌊',
    descrizione: 'Sblocca tutti e 2 gli animali dell\'Oceano (Delfino, Pellicano).',
    categoria: 'collezione',
    icona: '🐬',
    puntiPremio: 20,
    progresso: 0,
    maxProgresso: 2,
    sbloccato: false,
  },
  {
    id: 'maestro_foresta',
    titolo: 'Signore della Foresta 🌲',
    descrizione: 'Sblocca tutti e 3 gli animali della Foresta (Panda, Gufo, Tigre).',
    categoria: 'collezione',
    icona: '🐯',
    puntiPremio: 25,
    progresso: 0,
    maxProgresso: 3,
    sbloccato: false,
  },
  {
    id: 'collezione_completa',
    titolo: 'Collezionista Reale 🏆',
    descrizione: 'Sblocca tutti gli 8 animali nella tua Collezione!',
    categoria: 'collezione',
    icona: '👑',
    puntiPremio: 50,
    progresso: 0,
    maxProgresso: 8,
    sbloccato: false,
  },
  {
    id: 'super_indovino',
    titolo: 'Fiuto da Levriero 🎯',
    descrizione: 'Indovina un animale al primissimo indizio!',
    categoria: 'indovina',
    icona: '🎯',
    puntiPremio: 15,
    progresso: 0,
    maxProgresso: 1,
    sbloccato: false,
  },
  {
    id: 'serie_vincente',
    titolo: 'Inarrestabile! 🔥',
    descrizione: 'Raggiungi una serie di 3 risposte corrette di fila.',
    categoria: 'indovina',
    icona: '🔥',
    puntiPremio: 30,
    progresso: 0,
    maxProgresso: 3,
    sbloccato: false,
  },
  {
    id: 'maestro_sfida',
    titolo: 'Fulmine dei Quiz ⚡',
    descrizione: 'Rispondi correttamente a 5 domande nella Modalità Sfida Flash.',
    categoria: 'sfida',
    icona: '⚡',
    puntiPremio: 40,
    progresso: 0,
    maxProgresso: 5,
    sbloccato: false,
  },
];

// Helper to shuffle arrays
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate Challenge Quiz Questions based on animal dataset
export function generateChallengeQuestions(animals: Animal[]): ChallengeQuestion[] {
  const questions: ChallengeQuestion[] = [
    {
      id: 'q1',
      domanda: 'Quale animale vive nell\'Oceano ed è famoso per la sua grande intelligenza e per i suoi salti acrobatici?',
      categoria: 'Habitat',
      rispostaCorrettaId: 'delfino',
      spiegazione: 'Il delfino è un mammifero marino straordinario e molto giocherellone!',
      opzioni: [],
    },
    {
      id: 'q2',
      domanda: 'Quale mammifero terrestre è il più grande e pesante di tutto il pianeta e possiede una lunghissima proboscide?',
      categoria: 'Statistica',
      rispostaCorrettaId: 'elefante',
      spiegazione: 'L\'elefante pesa ben 5400 kg ed è il gigante amabile della savana.',
      opzioni: [],
    },
    {
      id: 'q3',
      domanda: 'Quale uccello notturno può ruotare la testa fino a 270 gradi per guardarsi attorno?',
      categoria: 'Fatto curioso',
      rispostaCorrettaId: 'gufo',
      spiegazione: 'Il gufo vola in modo totalmente silenzioso e vede benissimo di notte.',
      opzioni: [],
    },
    {
      id: 'q4',
      domanda: 'Quale animale con la pelliccia biancanera trascorre fino a 12 ore al giorno a mangiare bambù?',
      categoria: 'Fatto curioso',
      rispostaCorrettaId: 'panda-gigante',
      spiegazione: 'Il panda gigante vive nelle foreste di montagna e adora il bambù freschissimo!',
      opzioni: [],
    },
    {
      id: 'q5',
      domanda: 'Chi è conosciuto da tutti come il "Re della Savana" con un ruggito udibile a 8 km?',
      categoria: 'Chi è?',
      rispostaCorrettaId: 'leone',
      spiegazione: 'Il leone maschio ha una criniera imponente e ruggisce fortissimo per proteggere il branco!',
      opzioni: [],
    },
    {
      id: 'q6',
      domanda: 'Quale tra questi felini adora nuotare nell\'acqua e ha strisce nere persino sulla pelle?',
      categoria: 'Fatto curioso',
      rispostaCorrettaId: 'tigre',
      spiegazione: 'La tigre è un felino fantastico che ama sguazzare nei fiumi caldi!',
      opzioni: [],
    },
    {
      id: 'q7',
      domanda: 'Quale uccello acquatico ha una grande sacca gola sotto il becco che può contenere 13 litri d\'acqua?',
      categoria: 'Statistica',
      rispostaCorrettaId: 'pellicano',
      spiegazione: 'Il pellicano usa il becco come un capiente retino per catturare i pesci!',
      opzioni: [],
    },
    {
      id: 'q8',
      domanda: 'Quale animale è l\'essere vivente più alto della Terra con un lungo collo e la lingua blu?',
      categoria: 'Statistica',
      rispostaCorrettaId: 'giraffa',
      spiegazione: 'La giraffa misura ben 550 cm in altezza e bruca le foglie sugli alberi più alti!',
      opzioni: [],
    },
  ];

  // Fill 4 options per question automatically
  return shuffle(questions).map((q) => {
    const correctAnimal = animals.find((a) => a.id === q.rispostaCorrettaId)!;
    const distractors = shuffle(animals.filter((a) => a.id !== q.rispostaCorrettaId)).slice(0, 3);
    const opzioni = shuffle([correctAnimal, ...distractors]);
    return {
      ...q,
      opzioni,
    };
  });
}
