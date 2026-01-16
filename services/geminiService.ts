
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const refineMoodToPrompt = async (mood: string, style: string): Promise<{ prompt: string, colors: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this mood: "${mood}". 
    Create a detailed artistic prompt for a ${style} style image. 
    Also, provide a palette of 5 hex color codes that represent this emotional state.
    
    Return the response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prompt: {
            type: Type.STRING,
            description: "The highly detailed artistic image prompt.",
          },
          colors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 5 hex color strings.",
          },
        },
        required: ["prompt", "colors"],
      },
    }
  });

  try {
    const data = JSON.parse(response.text);
    return {
      prompt: data.prompt,
      colors: data.colors || ['#ffffff', '#888888', '#444444', '#222222', '#000000']
    };
  } catch (e) {
    return {
      prompt: mood,
      colors: ['#ffffff', '#888888', '#444444', '#222222', '#000000']
    };
  }
};

export const generateMoodSketch = async (refinedPrompt: string, style: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Artistic Masterpiece. Style: ${style}. Subject: ${refinedPrompt}. High resolution, 4k, cinematic, emotive lighting.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data found in response");
};
