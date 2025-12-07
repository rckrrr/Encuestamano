import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, ExtractedContent } from '../types';

export const extractContentFromImage = async (base64Data: string, mimeType: string): Promise<ExtractedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze this image or document which contains handwritten or printed text.
    Your goal is to extract the content for a social media post.
    
    1. Identify the type of content:
       - 'TRIVIA': A multiple choice question or quiz.
       - 'QA': A simple question and answer pair.
       - 'QUOTE': A quote, phrase, or saying.
       - 'OTHER': General text.
       
    2. Extract the text accurately, correcting any handwriting errors.

    3. CRITICAL FOR OPTIONS: If the options in the image are labeled (e.g., "A)", "B)", "C)", "1.", "a."), YOU MUST INCLUDE these labels in the extracted text strings for the options array. Do not strip them out. If no labels exist in the image, do not invent them.
    
    4. Return the data in the specified JSON structure.
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
              description: "The type of content detected."
            },
            question: {
              type: Type.STRING,
              description: "The main question text or headline.",
              nullable: true
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of options for multiple choice questions. Keep prefixes like 'A)' or '1.' if present.",
              nullable: true
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The correct answer if indicated (e.g., circled or marked).",
              nullable: true
            },
            text: {
              type: Type.STRING,
              description: "The main body text for quotes or general notes.",
              nullable: true
            },
            author: {
              type: Type.STRING,
              description: "The author of the quote, if visible.",
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
    throw new Error("Failed to extract content from the image.");
  }
};