
export type TabType = 'html' | 'css' | 'js';

export interface CodeState {
  html: string;
  css: string;
  js: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  html: string;
  css: string;
  js: string;
  explanation?: string;
}
