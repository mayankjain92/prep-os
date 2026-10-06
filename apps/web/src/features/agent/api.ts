import { apiFetch } from "@/lib/api-client";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function sendAgentMessage(
  message: string,
  history: ChatMessage[] = [],
): Promise<string> {
  const data = await apiFetch<{ reply: string }>("/api/agent/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });

  return data.reply;
}
