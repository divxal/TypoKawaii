import { GoogleGenAI } from "@google/genai";
import { User } from "../types";

// NOTE: in a real app, strict error handling for missing ENV variables is needed.
// We assume process.env.API_KEY is available.

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const generateAtlasResponse = async (
  message: string,
  user: User,
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!ai) return "Lo siento, no puedo conectar con mi cerebro digital ahora mismo (Falta API Key).";

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    Eres Atlas, un asistente de IA amigable y kawaii dentro del juego de mecanografía "TypoKawaii".
    
    Tu personalidad:
    - Eres alegre, motivador y usas emojis ocasionalmente.
    - Te encanta el universo de Sanrio (Cinnamoroll, Kuromi, etc.).
    - Tu objetivo es ayudar al usuario a mejorar su mecanografía.
    
    Datos del usuario actual:
    - Nombre: ${user.username}
    - Nivel: ${user.stats.level}
    - Rango Infinito: ${user.stats.rankInfinite}
    - Mejor WPM: ${user.stats.highestWpm}
    
    Instrucciones:
    - Responde preguntas sobre el juego, consejos de mecanografía o simplemente charla amigable.
    - Si el usuario pregunta por su rendimiento, usa los datos proporcionados.
    - Mantén las respuestas concisas (máximo 3 párrafos cortos).
  `;

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message });
    return result.text || "¡Ups! Me he quedado en blanco.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tuve un problema al procesar tu mensaje. ¡Inténtalo de nuevo!";
  }
};

export const generateAvatar = async (prompt: string): Promise<string | null> => {
  if (!ai) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana
      contents: {
        parts: [
          {
            text: `A cute, kawaii, vector-style simple avatar icon of ${prompt}, sanrio style art, white background, minimal flat design, circle crop compatible.`
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error", error);
    return null;
  }
};
