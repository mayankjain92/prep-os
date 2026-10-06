"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendAgentMessage, ChatMessage } from "@/features/agent/api";
import ReactMarkdown from "react-markdown";

export function AgentCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Pass past history excluding current message
      const reply = await sendAgentMessage(text, messages);
      setMessages([...newMessages, { role: "model", content: reply }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: `⚠️ Error: ${err.message || "Something went wrong. Please check your backend connection."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Check my current study streak & solved problems",
    "Log a high-priority doubt about OS Paging",
    "What topic should I focus on next?",
  ];

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-13 px-5 bg-gradient-to-r from-xblue to-cyan-500 hover:opacity-95 text-white shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2.5 font-bold cursor-pointer"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Prep Copilot</span>
        </Button>
      </div>

      {/* 2. Slide-over Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-6 z-50 w-95 md:w-105 h-140 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-border bg-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-xblue/10 border border-xblue/20 flex items-center justify-center text-xblue">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    Prep Copilot
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-mono">
                      Gemini Flash
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Connected to your Roadmaps & Doubts
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xblue mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">
                    How can I help you today?
                  </h4>
                  <p className="text-muted-foreground text-xs mb-4">
                    I can inspect your live stats, diagnose weak spots, or log
                    doubts on your behalf.
                  </p>
                  <div className="w-full space-y-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left p-2.5 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
                      >
                        ⚡ {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "model" && (
                      <div className="w-6 h-6 rounded-full bg-xblue/10 border border-xblue/20 flex items-center justify-center text-xblue shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed text-xs ${
                        msg.role === "user"
                          ? "bg-xblue text-white rounded-br-xs font-medium"
                          : "bg-muted text-foreground border border-border rounded-bl-xs"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <div className="prose prose-invert prose-xs max-w-none space-y-1.5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>strong]:text-foreground [&>strong]:font-bold [&>code]:bg-background/80 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-[11px]">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-muted-foreground text-xs">
                  <div className="w-6 h-6 rounded-full bg-xblue/10 flex items-center justify-center text-xblue shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted px-3 py-2 rounded-2xl border border-border">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-xblue" />
                    <span>Agent executing tools & reasoning...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border bg-muted/20 flex gap-2 items-center"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your prep or tell agent to log doubts..."
                disabled={isLoading}
                className="text-xs bg-background h-10 rounded-xl"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 p-0 rounded-xl bg-xblue hover:bg-xhover text-white shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
