
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDoodleCode = async (prompt: string): Promise<GeminiResponse> => {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a fun, visual web animation or interactive doodle based on this prompt: "${prompt}". 
    Return the HTML, CSS, and JS separately in a JSON format. 
    The HTML should only contain the internal body content (no <html>, <head>, or <body> tags). 
    The CSS should be ready to put in a <style> tag.
    The JS should be ready to put in a <script> tag.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          js: { type: Type.STRING },
        },
        required: ["html", "css", "js"],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as GeminiResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      html: "<h1>Error</h1>",
      css: "h1 { color: red; }",
      js: "console.log('Error generating code');"
    };
  }
};
