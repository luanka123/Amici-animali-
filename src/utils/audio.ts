// Web Audio API sound synthesizer & Web Speech API TTS helper for kids
import { getAnimalSoundMeta } from '../data/sounds';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isSpeechEnabled: boolean = true;
  private currentAudioElement: HTMLAudioElement | null = null;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.isSpeechEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getSpeechEnabled(): boolean {
    return this.isSpeechEnabled;
  }

  public playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context fallback ignore
    }
  }

  public playFlip() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  }

  public playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {
      // ignore
    }
  }

  public playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [220, 196]; // A3 to G3 gentle boop
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.18);
      });
    } catch {
      // ignore
    }
  }

  public playWin() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [392, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6 fanfare
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  public playAnimalSound(animalId: string, customAudioUrl?: string, versoName?: string) {
    if (this.isMuted) return;

    // Ferma eventuale audio reale precedente in riproduzione
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudioElement = null;
    }

    if (typeof window === 'undefined') return;

    const meta = getAnimalSoundMeta(animalId);
    const candidateUrls: string[] = [];

    if (customAudioUrl) {
      candidateUrls.push(customAudioUrl);
    }
    if (meta && meta.realAudioUrls && meta.realAudioUrls.length > 0) {
      meta.realAudioUrls.forEach((url) => {
        if (!candidateUrls.includes(url)) {
          candidateUrls.push(url);
        }
      });
    }

    if (candidateUrls.length > 0) {
      let candidateIndex = 0;

      const tryPlayNextCandidate = () => {
        if (candidateIndex >= candidateUrls.length) {
          // Tutte le sorgenti audio reali online hanno fallito o siamo offline: fallback a Web Audio
          this.synthesizeAnimalCall(animalId, versoName);
          return;
        }

        const url = candidateUrls[candidateIndex];
        candidateIndex++;

        try {
          const audio = new Audio(url);
          audio.volume = 0.9;
          audio.preload = 'auto';
          this.currentAudioElement = audio;

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Se fallisce il caricamento del file da questo CDN, prova il successivo
              tryPlayNextCandidate();
            });
          }

          audio.onerror = () => {
            tryPlayNextCandidate();
          };
        } catch {
          tryPlayNextCandidate();
        }
      };

      tryPlayNextCandidate();
      return;
    }

    this.synthesizeAnimalCall(animalId, versoName);
  }

  public synthesizeAnimalCall(animalId: string, versoName?: string) {
    const ctx = this.getContext();
    if (!ctx) return;

    const normId = animalId.toLowerCase().replace(/[^a-z0-9-]/g, '');

    try {
      const now = ctx.currentTime;

      // 1. Felini & Grandi Predatori: Leone, Tigre, Grizzly, T-Rex (Ruggito profondo)
      if (['leone', 'tigre', 'trex', 'orso-grizzly', 'orso-polare', 'orso', 'coccodrillo', 'dente-a-sciabola'].includes(normId)) {
        // Ruggito multicomponente con noise e oscillatore grave modulato
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(normId === 'trex' ? 65 : normId === 'leone' ? 95 : 110, now);
        osc.frequency.exponentialRampToValueAtTime(normId === 'trex' ? 45 : 70, now + 0.6);
        osc.frequency.linearRampToValueAtTime(normId === 'trex' ? 35 : 50, now + 1.1);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(850, now + 0.3);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.1);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.1);

        // Se speech abilitato, vocalizza il verso
        if (versoName) {
          setTimeout(() => {
            this.speak(versoName);
          }, 600);
        }
        return;
      }

      // 2. Canidi: Lupo (Ululato epico e crescente), Cane (Abbaio)
      if (['lupo', 'cane', 'volpe'].includes(normId)) {
        if (normId === 'lupo') {
          // Ululato armonico
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(580, now + 0.5);
          osc.frequency.linearRampToValueAtTime(520, now + 1.3);
          osc.frequency.exponentialRampToValueAtTime(280, now + 1.9);

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.22, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.9);
        } else {
          // Abbaio / Guaire rapido
          [0, 0.22].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(240, now + offset);
            osc.frequency.exponentialRampToValueAtTime(140, now + offset + 0.12);
            gain.gain.setValueAtTime(0.2, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.12);
          });
        }
        return;
      }

      // 3. Rapaci & Uccelli: Falco Pellegrino, Aquila Reale, Gufo, Pappagallo, Tucano, Struzzo, Pellicano, Pinguino
      if (['falco-pellegrino', 'aquila-reale', 'gufo', 'pappagallo-ara', 'tucano', 'fenicottero', 'gallina', 'anatra', 'pinguino', 'pinguino-imperatore', 'struzzo', 'pellicano'].includes(normId)) {
        if (normId === 'gufo') {
          // Uh-uh del gufo
          [0, 0.4].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(idx === 0 ? 360 : 320, now + offset);
            osc.frequency.linearRampToValueAtTime(idx === 0 ? 390 : 300, now + offset + 0.25);
            gain.gain.setValueAtTime(0.18, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.28);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.28);
          });
        } else if (normId === 'struzzo') {
          // Boato sordo e profondo dello struzzo
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.linearRampToValueAtTime(85, now + 0.5);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        } else {
          // Grido acuto rapace / uccello / pinguino / pellicano
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1600, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.35);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        }
        return;
      }

      // 4. Elefante (Barrito con tromba)
      if (normId === 'elefante' || normId === 'mammut') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(680, now + 0.3);
        osc.frequency.linearRampToValueAtTime(740, now + 0.6);
        osc.frequency.exponentialRampToValueAtTime(260, now + 1.1);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.1);
        return;
      }

      // 5. Serpenti: Mamba Nero (Sibilo tagliente)
      if (normId === 'mamba-nero' || normId.includes('serpente')) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3200, now);
        osc.frequency.linearRampToValueAtTime(2800, now + 0.5);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
        return;
      }

      // 6. Creature Marine: Delfino (Click sonico e fischio), Balena, Squalo
      if (['delfino', 'balena-azzurra', 'squalo-bianco', 'orca', 'narvalo', 'polpo', 'foca'].includes(normId)) {
        if (normId === 'delfino') {
          // Cinguettio / fischietto sonar
          [0, 0.1, 0.2].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2200, now + offset);
            osc.frequency.exponentialRampToValueAtTime(3400, now + offset + 0.08);
            gain.gain.setValueAtTime(0.12, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.08);
          });
        } else {
          // Canto profondo oceanico balena / sonar
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.linearRampToValueAtTime(240, now + 0.6);
          osc.frequency.exponentialRampToValueAtTime(90, now + 1.4);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.4);
        }
        return;
      }

      // 7. Primati & altri: Scimpanzé, Gorilla
      if (['scimpanze', 'gorilla'].includes(normId)) {
        [0, 0.18, 0.36].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420 + idx * 80, now + offset);
          osc.frequency.linearRampToValueAtTime(620 + idx * 90, now + offset + 0.12);
          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.14);
        });
        return;
      }

      // 8. Dinosauri / Creature estinte (Triceratopo, Velociraptor, Stegosauro)
      if (['velociraptor', 'triceratopo', 'brachiosauro', 'stegosauro', 'pterodattilo'].includes(normId)) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(normId === 'velociraptor' ? 750 : 120, now);
        osc.frequency.exponentialRampToValueAtTime(normId === 'velociraptor' ? 320 : 60, now + 0.7);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
        return;
      }

      // Fallback melodico per tutti gli altri animali (es. Zebra, Gatto, Mucca, Cavallo, Maiale)
      if (normId === 'gatto') {
        // Miao
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(850, now + 0.2);
        osc.frequency.linearRampToValueAtTime(500, now + 0.5);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        return;
      }

      if (normId === 'mucca') {
        // Muu
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.8);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
        return;
      }

      if (normId === 'cavallo') {
        // Nitrito
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.2);
        osc.frequency.linearRampToValueAtTime(400, now + 0.6);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
        return;
      }

      // Default universale: tono dinamico ed espressivo
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      if (versoName) {
        setTimeout(() => {
          this.speak(versoName);
        }, 200);
      }
    } catch {
      // Ignora errori audio
    }
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.isSpeechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.9; // slightly slower for children
      utterance.pitch = 1.05; // slightly friendly warm pitch

      // Try to find an Italian voice
      const voices = window.speechSynthesis.getVoices();
      const italianVoice = voices.find(v => v.lang.startsWith('it'));
      if (italianVoice) {
        utterance.voice = italianVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundEngine();
