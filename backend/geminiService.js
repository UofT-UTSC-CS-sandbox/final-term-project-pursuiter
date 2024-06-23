/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */


import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const GeminiService = {
    
  // Generate a response
  generateResponse: async (prompt) => {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error in generateResponse:", error);
      throw new Error("Failed to generate response");
    }
  },
};

export default GeminiService;
