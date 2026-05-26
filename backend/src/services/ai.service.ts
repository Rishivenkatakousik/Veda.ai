import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";
import type { InlineFilePart } from "./material-context.service";
type AiResponse = {
    raw: string;
};
export const generateFromAI = async (
    systemPrompt: string,
    userPrompt: string,
    fileParts: InlineFilePart[] = []
): Promise<AiResponse> => {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const parts: Array<{ text: string } | InlineFilePart> = [{ text: userPrompt }, ...fileParts];
    const response = await ai.models.generateContent({
        model: env.AI_MODEL,
        contents: [{ role: "user", parts }],
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
        }
    });
    const text = response.text;
    if (!text?.trim()) {
        throw new Error("Gemini returned an empty response");
    }
    return { raw: text };
};
export { extractJSON } from "../lib/json-utils";
