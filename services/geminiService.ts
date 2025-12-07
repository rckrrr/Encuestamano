import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, ExtractedContent } from '../types';

export const extractContentFromImage = async (base64Data: string, mimeType: string): Promise<ExtractedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analiza esta imagen o documento que contiene texto manuscrito o impreso (probablemente en ESPAÑOL).
    Tu objetivo es extraer el contenido para una publicación en redes sociales.
    
    1. Identifica el tipo de contenido:
       - 'TRIVIA': Una pregunta de opción múltiple o quiz.
       - 'QA': Una pregunta simple con su respuesta.
       - 'QUOTE': Una cita, frase inspiradora o dicho.
       - 'OTHER': Texto general.
       
    2. Extrae el texto con precisión, corrigiendo errores de escritura manual. ASUME QUE EL TEXTO ESTÁ EN ESPAÑOL a menos que sea claramente otro idioma.

    3. CRÍTICO PARA OPCIONES: Si las opciones en la imagen tienen etiquetas (ej: "A)", "B)", "C)", "1.", "a."), DEBES INCLUIR estas etiquetas en las cadenas de texto extraídas para el array de opciones. No las elimines. Si no hay etiquetas en la imagen, no las inventes.
    
    4. Devuelve los datos estrictamente en la estructura JSON especificada.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: [ContentType.TRIVIA, ContentType.QA, ContentType.QUOTE, ContentType.OTHER],
              description: "El tipo de contenido detectado."
            },
            question: {
              type: Type.STRING,
              description: "El texto principal de la pregunta o título.",
              nullable: true
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de opciones para preguntas de opción múltiple. Mantén prefijos como 'A)' o '1.' si existen.",
              nullable: true
            },
            correctAnswer: {
              type: Type.STRING,
              description: "La respuesta correcta si está indicada (ej: circulada o marcada).",
              nullable: true
            },
            text: {
              type: Type.STRING,
              description: "El cuerpo del texto principal para citas o notas generales.",
              nullable: true
            },
            author: {
              type: Type.STRING,
              description: "El autor de la cita, si es visible.",
              nullable: true
            }
          },
          required: ["type"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(response.text) as ExtractedContent;
    return data;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("No se pudo extraer contenido de la imagen.");
  }
};