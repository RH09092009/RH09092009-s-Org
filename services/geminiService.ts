
import { GoogleGenAI, Type } from "@google/genai";
import { VideoAnalysis, GroundingSource } from "../types";

export const analyzeYouTubeVideo = async (videoUrl: string): Promise<VideoAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    I have a YouTube video at this URL: ${videoUrl}.
    
    Using Google Search grounding, find out what this video is about (title, creator, and content).
    Then, provide the following in a structured format:
    1. A concise summary of the video's content.
    2. 3-5 key takeaways or points mentioned.
    3. Additional context or recent news about this creator or the topic.

    Return the data in a clear, readable format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error("ERR_SAFETY_BLOCK");
    }

    const text = response.text;
    if (!text || text.trim().length < 10) {
        throw new Error("ERR_NOT_FOUND");
    }
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    const sections = text.split(/\n(?=[1-3]\.|\*\*)/);
    
    return {
      summary: sections[0]?.replace(/^1\.\s*/, '').trim() || text,
      keyPoints: sections[1]?.split('\n').filter(line => line.trim().startsWith('-') || line.trim().match(/^\d\./)).map(s => s.replace(/^[- \d\.]*/, '').trim()) || [],
      context: sections[2]?.trim() || "Information gathered from search results.",
      sources: sources
    };
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    const message = error.message || "";
    if (message.includes("429")) throw new Error("ERR_RATE_LIMIT");
    if (message.includes("401") || message.includes("403")) throw new Error("ERR_AUTH");
    if (message === "ERR_SAFETY_BLOCK") throw error;
    if (message === "ERR_NOT_FOUND") throw error;
    
    throw new Error("ERR_GENERAL");
  }
};
