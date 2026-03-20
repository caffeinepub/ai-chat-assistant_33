import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ConversationId, Message } from "../backend.d";
import { useActor } from "./useActor";

export function useListConversations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      const list = await actor.listConversations();
      return list.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMessages(conversationId: ConversationId | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages", conversationId?.toString()],
    queryFn: async () => {
      if (!actor || conversationId === null) return [];
      return actor.getMessages(conversationId);
    },
    enabled: !!actor && !isFetching && conversationId !== null,
  });
}

export function useGetWelcomeSuggestions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["welcome-suggestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWelcomeSuggestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createConversation(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: ConversationId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteConversation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useRenameConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: ConversationId; name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.renameConversation(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage(conversationId: ConversationId | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userMessage: string): Promise<Message> => {
      if (!actor || conversationId === null) throw new Error("Actor not ready");
      return actor.sendMessage(conversationId, userMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId?.toString()],
      });
    },
  });
}
