import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ConversationId, Message } from "./backend.d";
import { ChatView } from "./components/ChatView";
import { MessageComposer } from "./components/MessageComposer";
import { Sidebar } from "./components/Sidebar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import {
  useCreateConversation,
  useDeleteConversation,
  useGetMessages,
  useGetWelcomeSuggestions,
  useListConversations,
  useRenameConversation,
  useSendMessage,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function ChatApp() {
  const [activeId, setActiveId] = useState<ConversationId | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  // Optimistic messages shown while waiting for backend
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const { data: conversations = [], isLoading: convsLoading } =
    useListConversations();
  const { data: backendMessages = [], isLoading: msgsLoading } =
    useGetMessages(activeId);
  const { data: suggestions = [] } = useGetWelcomeSuggestions();

  const createConv = useCreateConversation();
  const deleteConv = useDeleteConversation();
  const renameConv = useRenameConversation();
  const sendMsg = useSendMessage(activeId);

  // Merge backend messages with any optimistic ones not yet reflected
  const messages =
    backendMessages.length > 0 ? backendMessages : optimisticMessages;

  const handleNewChat = useCallback(() => {
    setActiveId(null);
    setOptimisticMessages([]);
  }, []);

  const handleSelect = useCallback((id: ConversationId) => {
    setActiveId(id);
    setOptimisticMessages([]);
  }, []);

  const handleDelete = useCallback(
    async (id: ConversationId) => {
      try {
        await deleteConv.mutateAsync(id);
        if (activeId === id) {
          setActiveId(null);
          setOptimisticMessages([]);
        }
        toast.success("Conversation deleted");
      } catch {
        toast.error("Failed to delete conversation");
      }
    },
    [deleteConv, activeId],
  );

  const handleRename = useCallback(
    async (id: ConversationId, name: string) => {
      try {
        await renameConv.mutateAsync({ id, name });
      } catch {
        toast.error("Failed to rename conversation");
      }
    },
    [renameConv],
  );

  const handleSend = useCallback(
    async (userMessage: string) => {
      // If no active conversation, create one first
      let convId = activeId;
      if (convId === null) {
        try {
          const title =
            userMessage.slice(0, 40) + (userMessage.length > 40 ? "…" : "");
          convId = await createConv.mutateAsync(title);
          setActiveId(convId);
        } catch {
          toast.error("Failed to create conversation");
          return;
        }
      }

      // Show optimistic user message immediately
      const now = BigInt(Date.now());
      const userMsgOptimistic: Message = {
        role: "user",
        content: userMessage,
        timestamp: now,
      };
      setOptimisticMessages((prev) => [...prev, userMsgOptimistic]);
      setIsTyping(true);

      try {
        const response = await sendMsg.mutateAsync(userMessage);
        setOptimisticMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.content,
            timestamp: response.timestamp,
          },
        ]);
      } catch {
        toast.error("Failed to send message. Please try again.");
        setOptimisticMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, createConv, sendMsg],
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend],
  );

  const showWelcome = activeId === null && !isTyping && messages.length === 0;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: "oklch(0.979 0.005 240)" }}
    >
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isLoading={convsLoading}
        onNewChat={handleNewChat}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onRename={handleRename}
      />

      {/* Main content */}
      <main className="flex flex-col flex-1 min-w-0 h-full">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid oklch(0.92 0.008 240)",
          }}
        >
          <div className="flex-1">
            {activeId !== null && (
              <p
                className="text-sm font-medium truncate max-w-md"
                style={{ color: "oklch(0.35 0.03 240)" }}
              >
                {conversations.find((c) => c.id === activeId)?.name ??
                  "Conversation"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "oklch(0.55 0.18 260 / 0.15)",
                color: "oklch(0.45 0.12 260)",
              }}
            >
              U
            </div>
          </div>
        </header>

        {/* Chat area */}
        {showWelcome ? (
          <WelcomeScreen
            suggestions={suggestions}
            onSuggestion={handleSuggestion}
          />
        ) : (
          <ChatView
            messages={messages}
            isLoading={msgsLoading && messages.length === 0}
            isTyping={isTyping}
          />
        )}

        {/* Composer */}
        <MessageComposer
          data-ocid="chat.textarea"
          onSend={handleSend}
          isLoading={isTyping || createConv.isPending}
        />
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  );
}
