import { Bot, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const DEFAULT_SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Draft a polite follow-up email",
  "Write a Python function to sort a list",
  "Summarize the key points of an article",
  "Help me plan a productive morning routine",
  "Explain how machine learning works",
];

interface WelcomeScreenProps {
  suggestions?: string[];
  onSuggestion: (text: string) => void;
}

export function WelcomeScreen({
  suggestions,
  onSuggestion,
}: WelcomeScreenProps) {
  const chips =
    suggestions && suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4 mb-10"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: "oklch(0.55 0.18 260)" }}
        >
          <Bot size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "oklch(0.18 0.025 240)" }}
          >
            How can I help you today?
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.55 0.02 240)" }}>
            Ask me anything — I'm here to help.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-2 gap-2.5 max-w-xl w-full"
      >
        {chips.slice(0, 6).map((chip, i) => (
          <motion.button
            key={chip}
            data-ocid={`welcome.button.${i + 1}` as any}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
            onClick={() => onSuggestion(chip)}
            className="flex items-start gap-2 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all hover:shadow-md"
            style={{
              background: "white",
              color: "oklch(0.25 0.04 240)",
              border: "1px solid oklch(0.92 0.008 240)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.55 0.18 260 / 0.4)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.97 0.008 260)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.92 0.008 240)";
              (e.currentTarget as HTMLButtonElement).style.background = "white";
            }}
          >
            <Sparkles
              size={14}
              style={{
                color: "oklch(0.55 0.18 260)",
                marginTop: 1,
                flexShrink: 0,
              }}
            />
            <span className="leading-snug">{chip}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
