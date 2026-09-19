"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import clsx from "@/lib/clsx";

export interface ChatContext {
  moduleSlug?: string;
  lessonSlug?: string;
  isProject?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function ChatPanel({
  context,
  title = "Ask the AI tutor",
  placeholder = "Ask a question…",
  openingMessage,
}: {
  context?: ChatContext;
  title?: string;
  placeholder?: string;
  openingMessage?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    openingMessage ? [{ role: "assistant", text: openingMessage }] : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.text })),
          context,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat request failed.");
      setMessages([...nextMessages, { role: "assistant", text: data.reply as string }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [input, loading, messages, context]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card flex flex-col overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <Sparkles className="w-4 h-4 text-brand-600" />
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-[16rem] max-h-[28rem] overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400 italic">No messages yet — ask anything about this material.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={clsx(
              "text-sm leading-relaxed max-w-[85%] px-3.5 py-2 rounded-2xl whitespace-pre-wrap",
              m.role === "user"
                ? "ml-auto bg-brand-500 text-white rounded-br-sm"
                : "mr-auto bg-slate-100 text-slate-700 rounded-bl-sm"
            )}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto flex items-center gap-2 text-slate-400 text-xs px-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Thinking…
          </div>
        )}
        {error && (
          <div className="mr-auto text-xs text-danger-600 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={placeholder}
          className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 transition-colors"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
