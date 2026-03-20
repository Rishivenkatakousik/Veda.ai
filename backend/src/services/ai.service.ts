import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { env } from "../config/env";

type AiResponse = { raw: string };

const callOpenAI = async (
  systemPrompt: string,
  userPrompt: string
): Promise<AiResponse> => {
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: env.AI_MODEL,
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return { raw: content };
};

const callClaude = async (
  systemPrompt: string,
  userPrompt: string
): Promise<AiResponse> => {
  const client = new Anthropic({ apiKey: env.CLAUDE_API_KEY });

  const message = await client.messages.create({
    model: env.AI_MODEL,
    max_tokens: 8192,
    temperature: 0.4,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }]
  });

  const block = message.content[0];
  if (!block || block.type !== "text") {
    throw new Error("Claude returned an empty response");
  }

  return { raw: block.text };
};

export const generateFromAI = async (
  systemPrompt: string,
  userPrompt: string
): Promise<AiResponse> => {
  if (env.AI_PROVIDER === "claude") {
    return callClaude(systemPrompt, userPrompt);
  }
  return callOpenAI(systemPrompt, userPrompt);
};

/**
 * Extracts JSON from an AI response that may contain markdown fences
 * or extra surrounding text.
 */
export const extractJSON = (raw: string): string => {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1);
  }

  return raw.trim();
};
