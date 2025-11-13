import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingMetadata } from "../types";

// Initialize the Gemini API client
// We use process.env.API_KEY as per the runtime requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchCatholicDoctrine = async (query: string): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  try {
    // We use gemini-2.5-flash for speed and efficiency with tools
    // We strictly enable googleSearch tool to force external validation
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: `Você é um assistente respeitoso e preciso, especializado na Doutrina Católica (Catecismo, documentos do Vaticano, Santos Padres, Teologia).
        
        Sua missão é responder perguntas usando EXCLUSIVAMENTE informações encontradas através da ferramenta de busca do Google.
        
        Regras Estritas:
        1. Baseie suas respostas em fontes católicas confiáveis (ex: vatican.va, CNBB, sites de dioceses, enciclopédias católicas respeitadas).
        2. NÃO invente informações. Se a busca não retornar resultados claros, diga que não encontrou informações suficientes nas fontes confiáveis.
        3. Mantenha um tom pastoral, acolhedor e educativo.
        4. Responda sempre em Português do Brasil.`,
        tools: [{ googleSearch: {} }],
        // IMPORTANT: Do not set responseMimeType when using googleSearch
      },
    });

    const text = response.text || "Desculpe, não consegui gerar uma resposta baseada nas buscas.";
    
    // Extract grounding metadata safely
    // The SDK structure for grounding can vary slightly, we access candidate-level metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    return {
      text,
      groundingMetadata
    };

  } catch (error) {
    console.error("Erro na busca:", error);
    throw error;
  }
};