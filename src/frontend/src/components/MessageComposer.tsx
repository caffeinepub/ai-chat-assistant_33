import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef, useState } from "react";

interface MessageComposerProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export function MessageComposer({
  onSend,
  isDisabled,
  isLoading,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isDisabled || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  };

  return (
    <div
      className="shrink-0 px-4 py-4"
      style={{ borderTop: "1px solid oklch(0.92 0.008 240)" }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="flex items-end gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "white",
            border: "1px solid oklch(0.88 0.01 240)",
            boxShadow: "0 2px 12px 0 oklch(0.18 0.025 240 / 0.06)",
          }}
        >
          <textarea
            data-ocid="chat.textarea"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Message AI Assistant…"
            rows={1}
            disabled={isDisabled || isLoading}
            className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed py-0.5"
            style={{ color: "oklch(0.18 0.025 240)", maxHeight: "180px" }}
          />
          <Button
            data-ocid="chat.submit_button"
            onClick={handleSend}
            disabled={!value.trim() || isDisabled || isLoading}
            size="icon"
            className="h-8 w-8 rounded-lg shrink-0 transition-all"
            style={{
              background:
                value.trim() && !isDisabled && !isLoading
                  ? "oklch(0.55 0.18 260)"
                  : "oklch(0.9 0.008 240)",
              color:
                value.trim() && !isDisabled && !isLoading
                  ? "white"
                  : "oklch(0.6 0.015 240)",
            }}
          >
            <Send size={15} />
          </Button>
        </div>
        <p
          className="text-center text-xs mt-2"
          style={{ color: "oklch(0.65 0.01 240)" }}
        >
          AI may make mistakes. Check important information.{" "}
          <span className="hover:underline cursor-pointer">Terms</span> ·{" "}
          <span className="hover:underline cursor-pointer">Privacy</span> ·{" "}
          <span className="hover:underline cursor-pointer">Help</span>
        </p>
      </div>
    </div>
  );
}
