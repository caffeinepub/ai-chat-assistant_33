import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Message {
    content: string;
    role: string;
    timestamp: bigint;
}
export interface ConversationSummary {
    id: ConversationId;
    name: string;
    createdAt: bigint;
    messageCount: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export type ConversationId = bigint;
export interface backendInterface {
    createConversation(name: string): Promise<ConversationId>;
    deleteConversation(id: ConversationId): Promise<void>;
    getMessages(id: ConversationId): Promise<Array<Message>>;
    getWelcomeSuggestions(): Promise<Array<string>>;
    listConversations(): Promise<Array<ConversationSummary>>;
    makeAIRequest(prompt: string): Promise<string>;
    renameConversation(id: ConversationId, newName: string): Promise<void>;
    sendMessage(conversationId: ConversationId, userMessage: string): Promise<Message>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
