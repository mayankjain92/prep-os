"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendAgentMessage, ChatMessage } from "@/features/agent/api";
import ReactMarkdown from "react-markdown";
import { AnimatedEmblem } from "@/components/shared/AnimatedEmblem";

function extractCodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractCodeText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractCodeText(props.children);
  }
  return "";
}

function formatMarkdownMath(text: string): string {
  if (!text) return "";
  const parts = text.split(/(```[\s\S]*?```|`[^`\n]*`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`")) return part;
      return part
        .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => " `" + math.trim() + "` ")
        .replace(/\$(?!\s)([^\$\n]+?)(?<!\s)\$/g, (_, math) => "`" + math.trim() + "`");
    })
    .join("");
}

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  let language = "code";
  let rawCode = "";

  if (React.isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      children?: React.ReactNode;
    };
    const match = /language-(\w+)/.exec(childProps.className || "");
    if (match) {
      language = match[1];
    }
    rawCode = extractCodeText(childProps.children || "");
  } else {
    rawCode = extractCodeText(children);
  }

  const cleanedCode = rawCode.replace(/\n$/, "");

  const handleCopy = async () => {
    if (!cleanedCode) return;
    try {
      await navigator.clipboard.writeText(cleanedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-2.5 rounded-xl border border-slate-700/60 dark:border-white/10 bg-[#0d1117] dark:bg-[#0c0c0e] shadow-xs overflow-hidden text-left min-w-0 max-w-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 dark:bg-white/[0.04] border-b border-slate-800 dark:border-white/[0.08] text-[11px] select-none">
        <div className="flex items-center gap-1.5 font-mono font-medium text-slate-300">
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="uppercase tracking-wider text-[10px] font-semibold text-slate-300">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed text-slate-100 dark:text-slate-200">
        <pre className="m-0 p-0 font-mono whitespace-pre selection:bg-sky-500/30">
          <code>{cleanedCode}</code>
        </pre>
      </div>
    </div>
  );
}

export function AgentCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to reach agent backend.";
      setMessages([
        ...newMessages,
        {
          role: "model",
          content: `⚠️ Error: ${errorMsg}`,
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
      {/* 1. Animated Logo Floating Trigger with Stitch Orbital Diamond Emblem */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Prep Copilot"
          className="relative w-14 h-14 rounded-full bg-slate-950 dark:bg-[#121212] hover:bg-slate-900 dark:hover:bg-[#1a1a1a] border border-slate-700/60 dark:border-white/15 shadow-2xl flex items-center justify-center text-foreground cursor-pointer transition-colors group p-1"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-sky-400 transition-transform" />
          ) : (
            <AnimatedEmblem className="w-11 h-11" />
          )}
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
            className={`fixed bottom-22 right-4 sm:right-6 z-50 transition-[width,height] duration-200 ease-out bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-6.5rem)] ${
              isExpanded
                ? "w-[calc(100vw-1.5rem)] sm:w-[680px] md:w-[780px] h-[680px]"
                : "w-[calc(100vw-1.5rem)] sm:w-[450px] md:w-[480px] h-[580px]"
            }`}
          >
            {/* Header: Clean dark style matching Prep OS */}
            <div className="px-4 py-3.5 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 p-0.5">
                  <AnimatedEmblem className="w-7 h-7" />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Collapse width" : "Expand width"}
                  className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer hidden sm:flex items-center justify-center"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </Button>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-sky-500 mb-3">
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
                    className={`flex gap-2.5 min-w-0 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "model" && (
                      <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center text-sky-500 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl leading-relaxed text-xs min-w-0 ${
                        msg.role === "user"
                          ? "max-w-[85%] bg-sky-500 text-white shadow-xs rounded-tr-xs"
                          : "flex-1 max-w-[calc(100%-2rem)] bg-secondary/70 text-foreground border border-border rounded-tl-xs"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                      ) : (
                        <div className="space-y-1.5 min-w-0">
                          <ReactMarkdown
                            components={{
                              pre: CodeBlock,
                              code: ({ className, children, ...props }) => {
                                const isBlock =
                                  Boolean(className?.includes("language-")) ||
                                  (typeof children === "string" && children.includes("\n"));
                                if (isBlock) {
                                  return (
                                    <code
                                      className="font-mono text-[11.5px] leading-relaxed text-slate-100 dark:text-slate-200"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <code
                                    className="bg-secondary border border-border px-1.5 py-0.5 rounded font-mono text-[11px] text-sky-600 dark:text-sky-400 font-medium"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              h1: ({ children }) => (
                                <h1 className="font-bold text-sm text-foreground my-1.5 border-b border-border pb-1">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="font-bold text-xs text-sky-500 dark:text-sky-400 mt-2 mb-1">
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
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-4 space-y-1 my-1.5 text-foreground/90">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal pl-4 space-y-1 my-1.5 text-foreground/90">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="leading-relaxed pl-0.5">{children}</li>
                              ),
                              hr: () => (
                                <hr className="my-2.5 border-border" />
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-2 rounded-lg border border-border custom-scrollbar">
                                  <table className="w-full text-[11px] text-left">{children}</table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="bg-secondary px-2.5 py-1.5 font-semibold text-foreground border-b border-border">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="px-2.5 py-1.5 border-b border-border/50 text-foreground/90">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {formatMarkdownMath(msg.content)}
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
                  <div className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center text-sky-500 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-2xl border border-border">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
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
                className="text-xs bg-secondary border-border focus-visible:ring-sky-500 h-10 rounded-xl text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 p-0 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shrink-0 cursor-pointer"
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
