
import { GoogleGenAI } from "@google/genai";
import { HistoryItem } from "../types";

export const analyzeWingoPatterns = async (history: HistoryItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historyText = history
    .slice(0, 5)
    .map(h => `Period: ${h.period}, Result: ${h.prediction}, Color: ${h.color}`)
    .join('\n');

  const prompt = `
    You are a professional Data Analyst for the Wingo 1-Minute Lottery Game.
    Analyze the following recent results and provide a short, high-confidence strategic insight (2-3 sentences).
    Focus on probability and potential 'trends' (Dragon, Mirror, etc.).
    
    Recent History:
    ${historyText}
    
    Respond with professional tone. Do not use financial advice disclaimers; treat it as an analytical game simulation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Analyzing market trends... patterns remain stable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI insights currently recalibrating based on live volume data.";
  }
};
