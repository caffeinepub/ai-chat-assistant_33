# AI Chat Assistant

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Full ChatGPT-like conversational chat interface
- Conversation history sidebar (create, rename, delete chats)
- AI response via HTTP outcalls to an external AI API
- Message streaming-style display with typing indicator
- Suggested prompts on welcome screen
- User and assistant chat bubbles
- Persistent conversation storage in backend

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select http-outcalls component for AI API calls
2. Generate Motoko backend: conversation storage, message history, send message (triggers http outcall to AI)
3. Build frontend: sidebar with chat history, main chat panel, message composer, welcome screen with suggestion chips
