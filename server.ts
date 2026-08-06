import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

let groqClient: Groq | null = null;
function getGroq(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to proxy Pexels API requests safely
  app.get("/api/pexels", async (req, res) => {
    const query = req.query.query as string;
    const apiKey = process.env.PEXELS_API_KEY || process.env.VITE_PEXELS_API_KEY;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    if (!apiKey) {
      return res.json({ photoUrl: null, message: "No Pexels API key configured" });
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      if (!response.ok) {
        return res.json({ photoUrl: null, error: `Pexels API error: ${response.statusText}` });
      }

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        const photoUrl = data.photos[0].src.large || data.photos[0].src.medium;
        return res.json({ photoUrl, photographer: data.photos[0].photographer });
      }

      return res.json({ photoUrl: null });
    } catch (err: any) {
      console.error("Error fetching from Pexels API:", err);
      return res.json({ photoUrl: null, error: err.message });
    }
  });

  // API endpoint dedicated to "L'Oracolo della Natura" powered exclusively by Groq
  app.post("/api/groq-quiz", async (req, res) => {
    const { ageBand, category, targetAnimal, animalNames } = req.body;
    
    try {
      const groq = getGroq();
      if (!groq) {
        return res.json({
          success: false,
          provider: "local",
          message: "GROQ_API_KEY non configurata. L'Oracolo della Natura utilizza il motore locale integrato."
        });
      }

      const systemInstruction = `Sei "L'Oracolo della Natura", l'entità saggia, antica e amichevole custode di tutti gli animali della Terra e guida ufficiale dell'applicazione "Amici Animali".
IL TUO UNICO COMPITO è rivelare indizi e curiosità scientifiche adattate all'età dei bambini per indovinare gli animali.

REGOLE DI BLINDATURA SUGLI ARGOMENTI (STRICT GUARDRAILS):
- Rispondi ESCLUSIVAMENTE a domande o richieste che riguardano animali, natura, habitat, zoologia o il funzionamento dell'app "Amici Animali".
- Se la richiesta riguarda qualsiasi altro argomento non pertinente (matematica, tecnologia generica, politica, geografia non naturale, ecc.), DEVI RIFIUTARE educatamente dicendo che la tua saggezza è riservata unicamente al mondo animale.`;

      const prompt = `L'Oracolo della Natura deve rivelare 3 indizi e 1 fatto speciale per l'animale: "${targetAnimal || 'Leone'}".
Fascia d'età del bambino: "${ageBand || '5-6'}".
Habitat: "${category || 'Tutto il Mondo'}".

Regole di calibrazione del linguaggio per l'età:
- Per "3-4": Frasi brevissime, onomatopee (versi dell'animale, "ROAR!", "SPLASH!"), colori sgargianti, entusiasmo.
- Per "5-6": Frasi semplici (massimo 10 parole), incentrate su cibo, versi e aspetto fisico.
- Per "7-8": Curiosità scientifiche interessanti, abilità di caccia/difesa, velocità e habitat.
- Per "9-12+": Terminologia etologica precisa, adattamento all'ambiente e dati biologici reali.

Restituisci ESATTAMENTE questo oggetto JSON valido senza alcun testo extra o markdown:
{
  "entita": "L'Oracolo della Natura",
  "targetAnimal": "${targetAnimal || 'Leone'}",
  "ageBand": "${ageBand || '5-6'}",
  "indizi": [
    "Indizio 1 dell'Oracolo...",
    "Indizio 2 dell'Oracolo...",
    "Indizio 3 dell'Oracolo..."
  ],
  "fattoGenerato": "Saggezza dell'Oracolo adattata all'età...",
  "livelloDifficolta": "Facile/Medio/Avanzato"
}`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemInstruction
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        response_format: { type: "json_object" }
      });

      const rawContent = completion.choices[0]?.message?.content || "";
      const parsedData = JSON.parse(rawContent);

      return res.json({
        success: true,
        entita: "L'Oracolo della Natura",
        provider: "groq",
        data: parsedData
      });
    } catch (err: any) {
      console.error("Errore Groq API Oracolo:", err);
      return res.json({
        success: false,
        error: err.message || "L'Oracolo della Natura è momentaneamente silenzioso."
      });
    }
  });

  // Dedicated Chat/Info endpoint with L'Oracolo della Natura (Groq Exclusive with strict Guardrails)
  app.post("/api/oracolo-ask", async (req, res) => {
    const { question, ageBand } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "La domanda per L'Oracolo della Natura è obbligatoria." });
    }

    try {
      const groq = getGroq();
      if (!groq) {
        return res.json({
          success: false,
          answer: "L'Oracolo della Natura riposa. Configura la chiave GROQ_API_KEY per ascoltare la sua voce divina!"
        });
      }

      const systemPrompt = `Sei "L'Oracolo della Natura", un'entità mistica, calorosa ed esperta che vive nel regno animale dell'app "Amici Animali".
IL TUO COMPITO ASSOLUTO: Rispondi alle domande dei bambini e dei genitori.

STRICT GUARDRAIL DI BLINDATURA (MANDATORIO):
1. Rispondi UNICAMENTE se la domanda riguarda:
   a) Animali, biologia, comportamenti, habitat o curiosità sulla natura.
   b) Come si gioca o come funziona l'applicazione "Amici Animali" (Quiz, Carte Collezionabili, Confronta Animali, Punti).
2. Se la domanda NON riguarda gli animali o l'app "Amici Animali", rispondi TASSATIVAMENTE con queste esatte parole:
   "Sono L'Oracolo della Natura e la mia saggezza riguarda esclusivamente gli animali, il nostro pianeta e l'app Amici Animali! Chiedimi pure qualsiasi curiosità sul mondo animale o su come giocare!"

Calibrazione risposta per età:
- Adatta il tono della risposta per un bambino di fascia d'età: "${ageBand || '5-6'} anni".
- Mantieni la risposta breve, educativa, entusiasta ed incoraggiante (massimo 3-4 frasi).`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 300,
      });

      const answer = completion.choices[0]?.message?.content || "";
      return res.json({
        success: true,
        entita: "L'Oracolo della Natura",
        answer
      });
    } catch (err: any) {
      console.error("Errore Oracolo Ask:", err);
      return res.json({
        success: false,
        error: "L'Oracolo della Natura ha riscontrato un'interruzione mistica."
      });
    }
  });

  // General API endpoint for AI Dynamic Quiz Questions via Gemini or Groq
  app.post("/api/ai-quiz", async (req, res) => {
    const { ageBand, category, animalNames, targetAnimal } = req.body;
    
    // Check Groq first
    const groq = getGroq();
    if (groq) {
      try {
        const prompt = `Genera un quiz educativo sugli animali per bambini di fascia d'età "${ageBand || '5-6'}".
Animale target: "${targetAnimal || 'Elefante'}".
Elenco opzioni possibili: ${JSON.stringify(animalNames || ['Leone', 'Elefante', 'Delfino', 'Panda gigante'])}.

Calibra la complessità delle frasi e dei concetti per l'età:
- 3-4 anni: Frasi brevissime con onomatopee ("ROAR", "TROMBA") e colori.
- 5-6 anni: Linguaggio semplice, alimentazione, movimento e habitat.
- 7-8 anni: Dati su caccia, velocita, peso e curiosità.
- 9-12+ anni: Dati scientifici, tassonomia e adattamento all'ambiente.

Restituisci un array JSON con 1 domanda formattato così:
[
  {
    "indizi": ["Indizio 1", "Indizio 2", "Indizio 3"],
    "targetNome": "${targetAnimal || 'Elefante'}",
    "fattoGenerato": "Curiosità per la fascia ${ageBand}"
  }
]`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
        });

        const text = completion.choices[0]?.message?.content || "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return res.json({ success: true, provider: "groq", questions: JSON.parse(jsonMatch[0]) });
        }
      } catch (e) {
        console.warn("Groq fallback down, trying Gemini...", e);
      }
    }

    // Gemini fallback
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Crea 1 domanda quiz sugli animali in formato JSON per bambini di fascia d'età: "${ageBand || '5-6 anni'}".
Animale target: "${targetAnimal || 'Leone'}".
Categoria: "${category || 'Tutto il Mondo'}".
Usa solo questi animali come opzioni possibili: ${JSON.stringify(animalNames || ['Leone', 'Elefante', 'Delfino', 'Panda gigante'])}.

Esempio di struttura JSON attesa:
[
  {
    "indizi": ["Indizio 1 adatto all'età", "Indizio 2 adatto all'età", "Indizio 3 adatto all'età"],
    "targetNome": "${targetAnimal || 'Leone'}",
    "fattoGenerato": "Curiosità divertente per l'età"
  }
]
Restituisci SOLO un array JSON valido senza markdown extra.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return res.json({ success: true, provider: "gemini", questions });
        }
      } catch (err: any) {
        console.error("Errore Gemini:", err);
      }
    }

    return res.json({
      success: false,
      message: "API Keys non configurate o non disponibili. Utilizzo del generatore locale."
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Amici Animali Server listening on http://localhost:${PORT}`);
  });
}

startServer();

