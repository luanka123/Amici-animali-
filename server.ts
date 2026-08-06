import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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

  // API endpoint for AI Dynamic Quiz Questions via Gemini / Groq compatible generator
  app.post("/api/ai-quiz", async (req, res) => {
    const { ageBand, category, animalNames } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: false,
        message: "GEMINI_API_KEY non configurata, utilizzo del generatore intelligente locale."
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Crea 3 domande quiz sugli animali in formato JSON per bambini di fascia d'età: "${ageBand || '5-6 anni'}".
Categoria: "${category || 'Tutto il Mondo'}".
Usa solo questi animali come opzioni possibili: ${JSON.stringify(animalNames || ['Leone', 'Elefante', 'Delfino', 'Panda gigante', 'T-Rex'])}.

Esempio di struttura JSON attesa per ogni domanda:
[
  {
    "indizi": ["Indizio 1 adatto all'età", "Indizio 2 adatto all'età", "Indizio 3 adatto all'età"],
    "targetNome": "NomeEsattoAnimalePresenteNellElenco",
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
        return res.json({ success: true, questions });
      }

      return res.json({ success: false, message: "Formato risposta AI non valido." });
    } catch (err: any) {
      console.error("Errore generazione AI Quiz:", err);
      return res.json({ success: false, error: err.message });
    }
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
