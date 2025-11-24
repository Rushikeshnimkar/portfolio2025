import { BaseMessage } from "@langchain/core/messages";

export interface ChatMessage {
    type: "user" | "assistant";
    content: string;
}

export interface StructuredContent {
    type: string;
    data: any;
}

export interface ChatResponse {
    content: string;
    structuredContent?: StructuredContent;
}

export interface OpenRouterMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

export interface OpenRouterFields {
    temperature?: number;
    [key: string]: unknown;
}
