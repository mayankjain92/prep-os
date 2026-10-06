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
  RotateCcw,
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
      const reply = await sendAgentMessage(text, messages);
      setMessages([...newMessages, { role: "model", content: reply }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: `⚠️ Error: ${err.message || "Failed to reach agent backend."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Analyze my overall prep across DSA & CS Theory",
    "Review my active doubts & high-priority blockers",
  ];

  return (
    <>
      {/* 1. Animated Logo Floating Trigger (No text, native app style) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Prep Copilot"
          className="relative w-13 h-13 rounded-full bg-card hover:bg-secondary border border-border shadow-xl flex items-center justify-center text-foreground cursor-pointer transition-colors group"
        >
          {/* Subtle spinning orbital dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border border-dashed border-xblue/30 group-hover:border-xblue/70 transition-colors"
          />

          {/* Center brand icon */}
          <div className="relative w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xblue group-hover:bg-xblue/10 transition-colors">
            {isOpen ? (
              <X className="w-4 h-4 text-xblue transition-transform" />
            ) : (
              <Sparkles className="w-4 h-4 text-xblue transition-transform group-hover:rotate-12" />
            )}
          </div>
        </motion.button>
      </div>

      {/* 2. Native Application Theme Chat Drawer with macOS Genie Lamp Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.06,
              y: 20,
              originX: 0.96,
              originY: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              originX: 0.96,
              originY: 0.98,
            }}
            exit={{
              opacity: 0,
              scale: 0.06,
              y: 20,
              originX: 0.96,
              originY: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 27,
              mass: 0.75,
            }}
            className="fixed bottom-22 right-6 z-50 w-95 md:w-105 h-140 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header: Clean dark style matching Prep OS */}
            <div className="px-4 py-3.5 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-xblue">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    Prep OS Copilot
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Connected to Roadmaps & Doubts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessages([])}
                    title="Reset Conversation"
                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-xblue mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">
                    Placement & DSA Assistant
                  </h4>
                  <p className="text-muted-foreground text-xs mb-4 max-w-70 leading-relaxed">
                    Ask for a gap analysis across DSA and CS Theory, or ask to
                    log doubts directly into your queue.
                  </p>
                  <div className="w-full space-y-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs transition-colors cursor-pointer"
                      >
                        {prompt}
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
                      <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center text-xblue shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed text-xs ${
                        msg.role === "user"
                          ? "bg-xblue text-white rounded-tr-xs"
                          : "bg-secondary/70 text-foreground border border-border rounded-tl-xs"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <div className="space-y-1.5">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="font-bold text-sm text-foreground my-1.5 border-b border-border pb-1">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="font-bold text-xs text-xblue mt-2 mb-1">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="font-semibold text-xs text-foreground mt-1.5 mb-0.5">
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => (
                                <p className="leading-relaxed mb-1.5 last:mb-0 text-foreground/90">
                                  {children}
                                </p>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold text-foreground">
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-4 space-y-1 my-1 text-foreground/90">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-4 space-y-1 my-1 text-foreground/90">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="leading-relaxed">{children}</li>
                              ),
                              code: ({ children }) => (
                                <code className="bg-card border border-border px-1.5 py-0.5 rounded font-mono text-[11px] text-xblue">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-muted-foreground text-xs">
                  <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center text-xblue shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-2xl border border-border">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-xblue" />
                    <span>Analyzing preparation & reasoning...</span>
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
              className="p-3 border-t border-border bg-card flex gap-2 items-center"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your prep or tell agent to log doubts..."
                disabled={isLoading}
                className="text-xs bg-secondary border-border focus-visible:ring-xblue h-10 rounded-xl text-foreground placeholder:text-muted-foreground"
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
