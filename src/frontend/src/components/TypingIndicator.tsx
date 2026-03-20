export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
        style={{ background: "oklch(0.55 0.18 260)" }}
      >
        AI
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: "oklch(0.95 0.008 240)" }}
      >
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: "oklch(0.55 0.02 240)" }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: "oklch(0.55 0.02 240)" }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: "oklch(0.55 0.02 240)" }}
        />
      </div>
    </div>
  );
}
