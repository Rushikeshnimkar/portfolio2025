import { ReactNode } from "react";

/**
 * Message interface for chat messages
 */
export interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  structuredContent?: StructuredContent | null;
}

/**
 * Structured content interface for formatted display elements
 */
export interface StructuredContent {
  type: "skills" | "projects" | "experience" | "contact" | "links" | "general";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/**
 * Props for the AIChatModal component
 */
export interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isSearching: boolean;
  error: string;
}

/**
 * Props for the header component
 */
export interface HeaderProps {
  onClose: () => void;
}

/**
 * Props for the message display component
 */
export interface MessageDisplayProps {
  messages: Message[];
  isSearching: boolean;
  error: string;
  renderStructuredContent: (content: StructuredContent) => ReactNode;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Props for the input area component
 */
export interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  isThemeMode: boolean;
  themeChangeHistory: string[];
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  resetThemeChanges: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isThemeRequest: (message: string) => boolean;
}

/**
 * Theme change interface
 */
export interface ThemeChange {
  type: string;
  selector: string;
  property?: string;
  value?: string;
  action?: "add" | "remove" | "hide" | "show";
  class?: string;
  attribute?: string;
  destination?: string;
  position?: string;
  parent?: string;
  order?: string[];
}
