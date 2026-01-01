
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, CodeState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAppContent = async (
  prompt: string, 
  currentCode?: CodeState,
  chatHistory: any[] = []
): Promise<GeminiResponse> => {
  // Usando Gemini 3 Pro para tarefas complexas de codificação
  const model = "gemini-3-pro-preview";
  
  const systemInstruction = `Você é o "Kernel" de um Navegador de IA. 
  Sua função é transformar as intenções do usuário em aplicações web completas e funcionais.
  
  Se o usuário enviar um comando novo: Crie um app do zero.
  Se o usuário pedir modificações e você receber o 'currentCode': Altere apenas as partes necessárias do código atual para satisfazer o pedido.
  
  REGRAS:
  - Retorne SEMPRE um JSON com html, css e js.
  - HTML: Estrutura sem tags html/head/body, apenas o que vai dentro do body.
  - CSS: Moderno, usando variáveis e flexbox/grid.
  - JS: Funcionalidade real, sem placeholders. Use APIs do navegador quando apropriado.
  - Design: Estética de software premium, clean e responsivo.`;

  const contents = currentCode 
    ? `PROMPT: ${prompt}\n\nCÓDIGO ATUAL:\nHTML: ${currentCode.html}\nCSS: ${currentCode.css}\nJS: ${currentCode.js}`
    : prompt;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          js: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Breve explicação do que foi feito." }
        },
        required: ["html", "css", "js"],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as GeminiResponse;
  } catch (error) {
    console.error("Gemini Parse Error", error);
    throw error;
  }
};
