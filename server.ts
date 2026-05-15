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
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
// If getGenerativeModel is missing, it might be in .models
const model = (genAI as any).getGenerativeModel ? (genAI as any).getGenerativeModel({ 
  model: "gemini-3-flash-preview",
  systemInstruction: "Eres Nebula AI, el motor creativo de Nebula Studio. Tu objetivo es generar contenido visual y creativo para diseñadores profesionales. Sé preciso, minimalista y elegante."
}) : (genAI as any).models.get("gemini-3-flash-preview");

app.post("/api/ai/generate-content", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "AI Error" });
  }
});

// Image Generation Proxy (Using the correct model for image generation if available, or a mock/fallback for now)
app.post("/api/ai/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const imageModel = (genAI as any).getGenerativeModel ? (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash" }) : (genAI as any).models.get("gemini-2.0-flash");
    
    // In a real production app, you'd use a dedicated image generation API (DALL-E, Stable Diffusion, etc.)
    // or a Gemini model that supports image generation output if available in the region.
    // For now, we use a structured prompt to ensure we get something meaningful or handle the absence of native image output.
    
    const result = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate a high-quality professional image for: ${prompt}. Aspect ratio: ${aspectRatio}` }] }],
    });
    
    const response = await result.response;
    const candidates = response.candidates || [];
    let imageUrl = null;

    // Check for inlineData (base64 images)
    for (const part of candidates[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (imageUrl) {
      res.json({ imageUrl });
    } else {
      // Fallback: If no image is returned, we can't really "fake" it here without a third party.
      // But we'll try to provide a descriptive error.
      res.status(404).json({ error: "The AI did not return a visual component. Please try a different prompt." });
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
