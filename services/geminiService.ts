import { GoogleGenAI, Type } from "@google/genai";
import { ResumeTheme, TemplateId, FontFamily } from '../types';

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

/**
 * Enhances text using Gemini Flash (text-only)
 */
export const enhanceText = async (text: string, context: string): Promise<string> => {
  if (!text) return "";
  
  try {
    const prompt = `
      You are an expert resume writer and career coach. 
      Your task is to rewrite the following ${context} content to be more professional, concise, and impactful.
      Use strong action verbs. Do not add any conversational filler. Just return the improved text.
      
      Original Text:
      "${text}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Error enhancing text:", error);
    throw error;
  }
};

/**
 * Generates a summary based on resume details
 */
export const generateSummary = async (jobTitle: string, skills: string[], experience: string): Promise<string> => {
  try {
    const prompt = `
      Write a professional resume summary (max 3-4 sentences) for a ${jobTitle}.
      Key skills: ${skills.join(', ')}.
      Experience highlights: ${experience}.
      Focus on value proposition and professional achievements.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};

/**
 * Generates a design configuration based on a user description
 */
export const generateDesignTheme = async (description: string): Promise<Partial<ResumeTheme>> => {
  try {
    const prompt = `
      You are a high-end personal branding consultant.
      The user wants a resume design that matches this description: "${description}".
      
      Your goal is to pick the PERFECT template, font, and accent color.
      
      CRITICAL RULES:
      1.  **LISTEN TO ADJECTIVES**: 
          - If user says "with photo", "headshot", or "picture", ensure you pick a template where a photo looks good (e.g., 'modern', 'creative', 'tech', 'minimal', 'student').
          - If user says "no photo", pick a text-heavy one like 'classic' or 'professional' (though all templates support photos now, focus on layout style).
      
      2.  **ROLE MATCHING (Soft Guidelines)**:
          - "Developer", "Code", "Tech" -> Recommend 'tech' or 'modern'.
          - "Designer", "Creative" -> Recommend 'creative', 'bold', or 'minimal'.
          - "CEO", "Executive" -> Recommend 'executive'.
          - "Student" -> Recommend 'student'.
          - "Lawyer", "Classic" -> Recommend 'classic'.
      
      3.  **CONFLICT RESOLUTION**:
          - If user says "Developer with photo", you can still pick 'tech' because the 'tech' template now supports photos. 
          - Prioritize the VISUAL VIBE requested by the user over the strict role category.

      4.  **Color Psychology**:
          - Tech: Green, Indigo, Cyan.
          - Creative: Purple, Orange, Bold Red.
          - Corporate: Navy, Slate, Black.

      AVAILABLE TEMPLATES:
      ['modern', 'classic', 'minimal', 'professional', 'creative', 'executive', 'student', 'tech', 'compact', 'bold']

      Return JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            templateId: { 
              type: Type.STRING, 
              enum: [
                'modern', 'classic', 'minimal', 'professional', 'creative', 
                'executive', 'student', 'tech', 'compact', 'bold'
              ] 
            },
            primaryColor: { type: Type.STRING },
            fontFamily: { type: Type.STRING, enum: ['sans', 'serif', 'mono'] },
          },
          required: ['templateId', 'primaryColor', 'fontFamily']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Partial<ResumeTheme>;
  } catch (error) {
    console.error("Error generating design theme:", error);
    // Fallback if AI fails or returns invalid JSON
    return {
      templateId: 'modern',
      primaryColor: '#4F46E5',
      fontFamily: 'sans'
    };
  }
}

/**
 * Edits an image using Gemini Flash Image (Nano Banana)
 */
export const editProfileImage = async (
  base64Image: string, 
  prompt: string, 
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // Remove header from base64 string if present (data:image/x;base64,)
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Specific model for efficient image editing tasks
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit this image based on the following instruction: ${prompt}. Return ONLY the image.`
          },
        ],
      },
    });

    // We need to find the image part in the response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};