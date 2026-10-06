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
You have tools to access the user's live preparation data, sync with external platforms, and update their doubts queue.

Available Tools:
- 'getUserProgress': Inspects full telemetry (streak, live LeetCode stats, NeetCode solved IDs, CS Theory roadmap progress, active doubts). Automatically triggers a real-time sync with LeetCode before returning data to ensure stats are 100% fresh.
- 'getLeetCodeStats': Inspects live LeetCode problem solve counts and contest rank. Automatically syncs with LeetCode.
- 'syncLeetCode': Explicitly triggers on-demand synchronization with LeetCode to refresh problem solve counts and update the database.
- 'createDoubt': Logs a new study doubt or problem to revisit in the user's doubts queue.

Rules for Progress Analysis & Study Advice:
1. ALWAYS use 'getUserProgress' to inspect their full data before answering progress or study plan questions. It will auto-sync their latest solves from LeetCode.
2. Perform a rigorous Gap Analysis:
   - Check their solved NeetCode problems: Which patterns have they done (e.g. Arrays, Two Pointers), and which critical patterns are completely untouched (e.g. Binary Search, Trees, Graphs, Dynamic Programming)?
   - Check their CS Theory roadmap: Which subjects (OS, DBMS, CN, OOP) are neglected?
   - Check their unresolved doubts: Highlight high-priority doubts that need immediate review.
3. Structure your response cleanly with clear Markdown headings, bullet points, and specific actionable next steps.
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
