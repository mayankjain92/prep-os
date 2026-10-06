import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env.js";
import { toolsRegistry } from "./tools.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const geminiTools = [
  {
    functionDeclarations: Object.values(toolsRegistry).map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    })),
  },
];

const SYSTEM_INSTRUCTION = `
You are the Prep OS AI Copilot, an elite technical mentor for software engineering placements and DSA prep.
You have tools to access the user's live preparation data and update their doubts queue.
Rules:
1. When asked about progress or next steps, ALWAYS use 'getUserProgress' or 'getLeetCodeStats' first to give personalized advice based on their real stats.
2. If the user mentions being stuck on a topic or problem, offer to add it to their doubts or use 'createDoubt' if they asked.
3. Be concise, actionable, and encouraging. Never invent stats or progress you didn't fetch via tools.
`;

export interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

export async function askAgent(
  userId: string,
  userMessage: string,
  history: ChatMessage[] = [],
): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const formattedHistory = history.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = ai.chats.create({
    model: "gemini-3.5-flash-lite",
    history: formattedHistory,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: geminiTools as any,
    },
  });

  let response = await chat.sendMessage({ message: userMessage });

  const MAX_TURNS = 5;
  let turns = 0;

  while (
    response.functionCalls &&
    response.functionCalls.length > 0 &&
    turns < MAX_TURNS
  ) {
    turns++;

    for (const call of response.functionCalls) {
      const { name, args } = call;
      if (!name) continue;
      const tool = (toolsRegistry as any)[name];

      let result: any;
      if (tool) {
        try {
          result = await tool.execute(userId, args);
        } catch (err: any) {
          result = { error: `Failed to execute tool ${name}: ${err.message}` };
        }
      } else {
        result = { error: `Tool ${name} does not exist.` };
      }

      response = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name,
              response: { output: result },
            },
          },
        ],
      });
    }
  }

  return response.text || "I have processed your request.";
}
