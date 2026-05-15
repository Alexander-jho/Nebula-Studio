import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Gemini AI Proxy
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post("/api/ai/generate-content", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      }
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "AI Error" });
  }
});

// Image Generation Proxy
app.post("/api/ai/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Defaulting to 2.5 flash image as per skill
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio,
        }
      }
    });

    let imageUrl = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      res.status(404).json({ error: "No image generated" });
    }
  } catch (error) {
    console.error("Gemini Image Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "AI Error" });
  }
});

async function startApp() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nebula Studio Server running on http://localhost:${PORT}`);
  });
}

startApp();
