import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  if (sourceLang === targetLang) return text;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const translatedText = result.response.text();
    return translatedText;
  } catch (error) {
    throw new Error(`[GoogleGenerativeAI Error]: ${error.message}`);
  }
}