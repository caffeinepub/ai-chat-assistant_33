import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Message } from "../backend.d";
import { TypingIndicator } from "./TypingIndicator";

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
}

export function ChatView({ messages, isLoading, isTyping }: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message or typing change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 chat-scroll">
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}  gap-3`}
            >
              {i % 2 !== 0 && (
                <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              )}
              <Skeleton
                className="h-14 rounded-2xl"
                style={{ width: `${40 + i * 15}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="chat.panel"
      className="flex-1 overflow-y-auto px-6 py-6 chat-scroll"
    >
      <div className="max-w-2xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <motion.div
                key={`${msg.timestamp}-${idx}`}
                data-ocid={`chat.row.${idx + 1}` as any}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 mb-5 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
                    style={{ background: "oklch(0.55 0.18 260)" }}
                  >
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "rounded-2xl rounded-tr-sm"
                      : "rounded-2xl rounded-tl-sm"
                  }`}
                  style={
                    isUser
                      ? {
                          background: "oklch(0.28 0.08 250)",
                          color: "oklch(0.97 0.005 240)",
                        }
                      : {
                          background: "oklch(0.95 0.008 240)",
                          color: "oklch(0.18 0.025 240)",
                        }
                  }
                >
                  {msg.content}
                </div>
                {isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                    style={{
                      background: "oklch(0.55 0.18 260 / 0.15)",
                      color: "oklch(0.45 0.12 260)",
                    }}
                  >
                    U
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
