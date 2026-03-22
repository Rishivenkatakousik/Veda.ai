import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
type AiResponse = {
    raw: string;
};
export const generateFromAI = async (systemPrompt: string, userPrompt: string): Promise<AiResponse> => {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: env.AI_MODEL,
        systemInstruction: systemPrompt,
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
        }
    });
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    if (!text?.trim()) {
        throw new Error("Gemini returned an empty response");
    }
    return { raw: text };
};
export { extractJSON } from "../lib/json-utils";
