import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Bot,
  Check,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ConversationId, ConversationSummary } from "../backend.d";

interface SidebarProps {
  conversations: ConversationSummary[];
  activeId: ConversationId | null;
  isLoading: boolean;
  onNewChat: () => void;
  onSelect: (id: ConversationId) => void;
  onDelete: (id: ConversationId) => void;
  onRename: (id: ConversationId, name: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  isLoading,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<ConversationId | null>(null);
  const [editingId, setEditingId] = useState<ConversationId | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (conv: ConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditName(conv.name);
  };

  const commitEdit = (id: ConversationId) => {
    if (editName.trim()) onRename(id, editName.trim());
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <aside
      className="flex flex-col w-[270px] shrink-0 h-full"
      style={{ background: "oklch(0.18 0.025 240)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.55 0.18 260)" }}
        >
          <Bot size={18} className="text-white" />
        </div>
        <span
          className="font-semibold text-base tracking-tight"
          style={{ color: "oklch(0.93 0.008 240)" }}
        >
          AI Assistant
        </span>
      </div>

      {/* New Chat */}
      <div className="px-3 pb-3 shrink-0">
        <Button
          data-ocid="chat.primary_button"
          onClick={onNewChat}
          className="w-full justify-start gap-2 font-medium text-sm h-9 rounded-lg"
          style={{
            background: "oklch(0.55 0.18 260)",
            color: "white",
          }}
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Conversation list */}
      <div className="px-2 pb-2 shrink-0">
        <p
          className="text-xs font-medium px-2 py-1 uppercase tracking-wider"
          style={{ color: "oklch(0.55 0.02 240)" }}
        >
          Recent
        </p>
      </div>

      <ScrollArea className="flex-1 px-2">
        {isLoading ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-9 w-full rounded-lg"
                style={{ background: "oklch(0.24 0.025 240)" }}
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <p
            className="text-xs text-center py-6"
            style={{ color: "oklch(0.5 0.015 240)" }}
          >
            No conversations yet
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {conversations.map((conv, idx) => {
              const isActive = conv.id === activeId;
              const isHovered = conv.id === hoveredId;
              const isEditing = conv.id === editingId;
              const markerIdx = idx + 1;

              return (
                <motion.div
                  key={conv.id.toString()}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  data-ocid={`chat.item.${markerIdx}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !isEditing) {
                      onSelect(conv.id);
                    }
                  }}
                  className={cn(
                    "group relative flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer mb-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    isActive
                      ? "bg-[oklch(0.27_0.03_240)]"
                      : "hover:bg-[oklch(0.24_0.025_240)]",
                  )}
                  onClick={() => !isEditing && onSelect(conv.id)}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <MessageSquare
                    size={14}
                    style={{
                      color: isActive
                        ? "oklch(0.55 0.18 260)"
                        : "oklch(0.55 0.02 240)",
                      flexShrink: 0,
                    }}
                  />

                  {isEditing ? (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only, no action
                    <div
                      className="flex items-center gap-1 flex-1 min-w-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        data-ocid="chat.input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(conv.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="h-6 text-xs px-1.5 flex-1"
                        style={{
                          background: "oklch(0.27 0.03 240)",
                          border: "1px solid oklch(0.55 0.18 260)",
                          color: "oklch(0.93 0.008 240)",
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        data-ocid="chat.save_button"
                        onClick={() => commitEdit(conv.id)}
                        className="p-0.5 rounded hover:opacity-80"
                      >
                        <Check
                          size={12}
                          style={{ color: "oklch(0.7 0.15 150)" }}
                        />
                      </button>
                      <button
                        type="button"
                        data-ocid="chat.cancel_button"
                        onClick={cancelEdit}
                        className="p-0.5 rounded hover:opacity-80"
                      >
                        <X size={12} style={{ color: "oklch(0.6 0.02 240)" }} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="flex-1 text-sm truncate"
                        style={{
                          color: isActive
                            ? "oklch(0.93 0.008 240)"
                            : "oklch(0.75 0.015 240)",
                        }}
                      >
                        {conv.name}
                      </span>

                      {(isHovered || isActive) && (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only
                        <div
                          className="flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            data-ocid={`chat.edit_button.${markerIdx}`}
                            onClick={(e) => startEdit(conv, e)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                          >
                            <Pencil
                              size={12}
                              style={{ color: "oklch(0.6 0.02 240)" }}
                            />
                          </button>
                          <button
                            type="button"
                            data-ocid={`chat.delete_button.${markerIdx}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(conv.id);
                            }}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                          >
                            <Trash2
                              size={12}
                              style={{ color: "oklch(0.6 0.02 240)" }}
                            />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </ScrollArea>

      {/* Footer */}
      <div
        className="px-4 py-4 shrink-0 border-t"
        style={{ borderColor: "oklch(0.27 0.025 240)" }}
      >
        <p className="text-xs" style={{ color: "oklch(0.5 0.015 240)" }}>
          AI Assistant v1.0
        </p>
      </div>
    </aside>
  );
}
