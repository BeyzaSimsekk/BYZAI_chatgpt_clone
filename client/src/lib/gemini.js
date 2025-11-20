import { GoogleGenAI } from "@google/genai";

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
];

const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);

const model = {
  genAI,
  modelName: "gemini-2.0-flash",
  safetySettings,
};

export default model;