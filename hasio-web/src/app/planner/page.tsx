"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const SUGGESTIONS = [
  "What are the best attractions in Al-Ahsa?",
  "Plan a 3-day trip to Al-Ahsa",
  "Where can I try Hasawi rice?",
  "Best time to visit Al-Ahsa?",
  "Tell me about Jabal Al-Qara caves",
];

export default function PlannerPage() {
  const { t } = useLanguage();
  const { isSignedIn } = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reportMessage = useMutation(api.reportedMessages.reportMessage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call Groq API via client-side fetch
      const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

      let aiText = "I'm sorry, I couldn't process your request. Please make sure AI API keys are configured.";

      if (groqKey) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `You are Hasio, an AI travel guide for Al-Ahsa Oasis, a UNESCO World Heritage site in eastern Saudi Arabia. You are knowledgeable, friendly, and helpful. You know about:
- Al-Ahsa attractions: Jabal Al-Qara caves, Ibrahim Palace, Al-Qaisariya Souk, Yellow Lake, Al-Uqair Beach
- Local food: Hasawi rice, Khalas dates, Kleeja cookies, traditional restaurants
- Culture: UNESCO heritage, date farming, traditional crafts
- Practical info: best times to visit, transportation, accommodation
Answer concisely and helpfully. If asked about things outside Al-Ahsa, politely redirect to Al-Ahsa topics.`,
              },
              ...messages.slice(-10).map((m) => ({
                role: m.isUser ? "user" as const : "assistant" as const,
                content: m.text,
              })),
              { role: "user" as const, content: text.trim() },
            ],
            max_tokens: 1024,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiText = data.choices[0]?.message?.content || aiText;
        }
      } else if (openaiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are Hasio, an AI travel guide for Al-Ahsa Oasis, Saudi Arabia. Be concise and helpful.",
              },
              ...messages.slice(-10).map((m) => ({
                role: m.isUser ? "user" as const : "assistant" as const,
                content: m.text,
              })),
              { role: "user" as const, content: text.trim() },
            ],
            max_tokens: 1024,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiText = data.choices[0]?.message?.content || aiText;
        }
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (msg: ChatMessage) => {
    if (!isSignedIn) return;
    const reason = prompt("Why are you reporting this message?");
    if (reason !== null) {
      try {
        await reportMessage({
          messageId: msg.id,
          messageText: msg.text,
          reportReason: reason || undefined,
        });
        alert("Message reported. Thank you for your feedback.");
      } catch {
        alert("Failed to report message.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      <h1 className="text-3xl font-heading font-bold text-on-surface mb-4">
        AI Travel Planner
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-variant mb-6">
              Ask me anything about Al-Ahsa Oasis
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-sm bg-surface-variant text-on-surface-variant px-3 py-2 rounded-lg hover:bg-border transition-colors border-none cursor-pointer text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.isUser
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-surface border border-border rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {!msg.isUser && isSignedIn && (
                <button
                  onClick={() => handleReport(msg)}
                  className="text-xs text-on-surface-muted hover:text-error mt-2 bg-transparent border-none cursor-pointer"
                >
                  Report
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-sm text-on-surface-muted">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-border pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Ask about Al-Ahsa..."
          className="input flex-1"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
}
