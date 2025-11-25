import { GoogleGenAI, Type } from "@google/genai";
import { Topic } from '../types';
import { AI_CONFIG } from './aiConfig';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing via process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateDetailedContent = async (topic: Topic): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    Anda adalah guru Informatika SMP yang ahli dan menyenangkan.
    Tolong buatkan materi pelajaran lengkap dan detail untuk topik: "${topic.title}".
    Deskripsi topik: ${topic.description}.
    
    Struktur materi harus mencakup:
    1. Pengertian/Definisi (Mudah dipahami siswa SMP).
    2. Fungsi dan Manfaat.
    3. Contoh dalam kehidupan nyata (Analogi).
    4. Penjelasan Teknis (Poin-poin penting).
    5. Studi Kasus singkat atau Fakta Unik.
    
    Gunakan format Markdown. Jangan gunakan heading 1 (#). Mulai dari Heading 2 (##).
    Gunakan bahasa Indonesia yang baku namun komunikatif untuk remaja.
  `;

  try {
    // Menggunakan konfigurasi model dari aiConfig
    const response = await ai.models.generateContent({
      model: AI_CONFIG.gemini.modelName,
      contents: prompt,
    });
    return response.text || "Maaf, gagal memuat konten detail saat ini.";
  } catch (error) {
    console.error("Gemini Content Gen Error:", error);
    return `Gagal memuat konten mendalam. Silakan cek koneksi internet atau API Key Anda.\n\nSummary Sementara:\n${topic.contentSummary}`;
  }
};

export const chatWithTutor = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  
  // Logika untuk Custom API (Jika diaktifkan di aiConfig)
  if (AI_CONFIG.custom.enabled) {
      try {
          // Implementasi fetch ke custom endpoint di sini
          // const response = await fetch(AI_CONFIG.custom.endpoint, { ... });
          return "Fitur Custom API belum diimplementasikan sepenuhnya."; 
      } catch (e) {
          return "Error menghubungi Custom API.";
      }
  }

  // Default: Gemini SDK
  const ai = getAiClient();
  try {
    const chat = ai.chats.create({
      model: AI_CONFIG.gemini.modelName,
      config: {
        systemInstruction: AI_CONFIG.systemInstruction,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Maaf, saya tidak mengerti.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Maaf, terjadi kesalahan pada sistem AI Tutor. Coba lagi nanti ya!";
  }
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const generateQuiz = async (topicTitle: string): Promise<QuizQuestion[]> => {
  const ai = getAiClient();
  const prompt = `Buatlah 5 soal pilihan ganda tentang "${topicTitle}" untuk siswa SMP.
  Format output HARUS JSON Array murni tanpa markdown formatting.
  
  Struktur JSON per item:
  {
    "question": "Pertanyaan...",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctAnswerIndex": 0, (0-3)
    "explanation": "Penjelasan singkat kenapa jawaban itu benar"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: AI_CONFIG.gemini.modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    // Parse JSON safely
    const data = JSON.parse(text);
    return data as QuizQuestion[];

  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};