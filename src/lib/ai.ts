import { GoogleGenAI } from "@google/genai";

export const googleAi = new GoogleGenAI({
  apiKey: String(process.env.GOOGLE_GENAI_API_KEY),
});