import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function translateSubtitles(
  text: string,
  targetLanguage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

