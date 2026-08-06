# 🐾 Amici Animali - PWA Educativa e Gamificata per Bambini

**Amici Animali** è una Progressive Web App (PWA) moderna, ad alte prestazioni ed elevato valore educativo, progettata per accompagnare bambini di ogni fascia d'età alla scoperta del regno animale attraverso la gamification, quiz interattivi, carte collezionabili e sintesi vocale.

---

## 🌟 L'Entità AI: "L'Oracolo della Natura" (Powered by Groq)

La PWA integra **L'Oracolo della Natura**, un'entità digitale saggia, benevola ed esperta etologa, alimentata dall'SDK ultra-veloce di **Groq** (`llama-3.3-70b-versatile`).

### 🎯 Compito dell'Oracolo
- Rivelare indizi inediti, sfide e curiosità zoologiche calibrate dinamicamente sull'età del bambino.
- Guida educativa e custode del regno animale all'interno del gioco.

### 🛡️ Guardrail e Blindatura degli Argomenti (Strict Topic Guardrails)
- **Scope Limitato e Protetto**: L'Oracolo risponde **esclusivamente** a domande e contenuti inerenti:
  1. Gli animali, la biologia, gli habitat naturali e la zoologia.
  2. Le regole di gioco e le istruzioni sull'applicazione **Amici Animali**.
- Qualsiasi tentativo di porre domande fuori tema (matematica, tecnologia generica, argomenti per adulti, ecc.) viene **intercettato e rifiutato** con un messaggio cordiale e sicuro per i bambini.

### 👶 Calibrazione per Fascia d'Età
- **3-4 Anni (Piccoli)**: Frasi immediate, onomatopee ("ROAR!", "SPLASH!"), colori e opzioni visuali semplificate a 2 grandi scelte.
- **5-6 Anni (Medio)**: Concetti legati ad alimentazione, movimento ed elementi fisici evidenti.
- **7-8 Anni (Grandi)**: Curiosità scientifiche su velocità, caccia, peso e strategie adattative.
- **9-12+ Anni (Master)**: Terminologia etologica avanzata, longevità, dati tassonomici reali e timer a tempo limitato (15 secondi).

---

## 🚀 Caratteristiche Principali

1. **Gioco Indovina l'Animale**: Quiz con sistema di indizi progressivi, timer adattivo, punteggi e calibrazione dinamica.
2. **Enciclopedia & Carte Collezionabili**: Oltre 30 schede dettagliate divise in habitat con foto ad alta risoluzione (supporto Pexels API).
3. **Confronta Animali**: Confronto diretto sulle statistiche reali (peso, velocità, lunghezza, longevità).
4. **Pacchetti Tematici (Packs)**:
   - 🌍 *Tutto il Mondo Intero* (Gratuito)
   - 🦁 *Savana & Terra Selvaggia*
   - 🐬 *Oceano & Mare Profondo*
   - 🌿 *Giungla & Foresta Incantata*
   - 🦕 *Mondo Dinosauri Preistorici*
5. **Sintesi Vocale & Effetti Sonori**: Lettore integrato con Web Speech API in lingua italiana ed effetti sintetizzati.
6. **Persistence Locale**: Salvataggio dei punteggi e degli animali scoperti nel `localStorage`.

---

## 🛠️ Stack Tecnologico

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend/API**: Express.js (Node.js)
- **AI Engine**: Groq SDK (`groq-sdk`, modello `llama-3.3-70b-versatile`)
- **Immagini**: Pexels API Proxy
- **Icone & Animate**: Lucide React, Canvas Confetti

---

## ⚙️ Variabili d'Ambiente (`.env.example`)

Per abilitare le funzionalità AI di Groq e le immagini Pexels, configura le seguenti variabili nell'ambiente o nel file `.env`:

```env
# GROQ_API_KEY: Richiesta per l'Oracolo della Natura (generazione ultra-veloce di indizi)
GROQ_API_KEY=your_groq_api_key_here

# PEXELS_API_KEY: Opzionale per il recupero di foto reali di animali
PEXELS_API_KEY=your_pexels_api_key_here
```

---

## 💻 Istruzioni di Avvio e Sviluppo

### Installazione Dipendenze
```bash
npm install
```

### Avvio Server di Sviluppo
```bash
npm run dev
```
La PWA sarà raggiungibile su `http://localhost:3000`.

### Build di Produzione
```bash
npm run build
npm start
```

---

*Realizzato con cura per l'apprendimento e il divertimento dei bambini!* 🐾🦁🐬
