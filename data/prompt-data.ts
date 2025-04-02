/**
 * Collection of prompt data for the AI assistant
 */

// Clickbait prompts shown in the floating bubble
export const clickbaitPrompts = [
  "It's not 2025 if you don't interact with the AI!",
  "Discover my portfolio secrets with AI assistance!",
  "Ask my AI anything about my work - it knows more than I do!",
  "This AI can tell you things about me I forgot to mention...",
  "Feeling curious? My AI assistant is waiting to chat!",
  "Don't scroll past without saying hi to my AI!",
  "The future is here - talk to my portfolio AI!",
  "Psst... My AI assistant knows all my coding secrets!",
  "Want to know more? I'm the AI that knows it all!",
];

// Interface for predefined prompt suggestions
export interface PredefinedPrompt {
  icon: string;
  text?: string;
  prefix: string;
  prompt: string;
  category: "theme" | "info" | "contact";
}

// Predefined prompts for the horizontal scroll suggestions
export const predefinedPrompts: PredefinedPrompt[] = [
  // Theme prompts
  {
    icon: "🌙",
    prefix: "Theme:",
    prompt: "dark mode with blue accents",
    category: "theme",
  },
  {
    icon: "📱",
    prefix: "Theme:",
    prompt: "hide navbar and make content wider",
    category: "theme",
  },
  {
    icon: "🔤",
    prefix: "Theme:",
    prompt: "larger text and serif fonts",
    category: "theme",
  },
  {
    icon: "🌃",
    prefix: "Theme:",
    prompt: "cyberpunk neon city vibes",
    category: "theme",
  },
  {
    icon: "📜",
    prefix: "Theme:",
    prompt: "retro terminal aesthetic with monospace font",
    category: "theme",
  },
  {
    icon: "⚪",
    prefix: "Theme:",
    prompt: "brutalist all-caps concrete-style typography",
    category: "theme",
  },
  // Information prompts
  {
    icon: "📊",
    prefix: "",
    prompt: "What are your skills?",
    category: "info",
  },
  {
    icon: "💰",
    prefix: "",
    prompt: "what was price pool of Sui overflow hackathon?",
    category: "info",
  },
  {
    icon: "📂",
    prefix: "",
    prompt: "Tell me about your projects",
    category: "info",
  },
  {
    icon: "👨‍💻",
    prefix: "",
    prompt: "Tell me about your experience",
    category: "info",
  },
  {
    icon: "🏆",
    prefix: "",
    prompt: "What are your achievements?",
    category: "info",
  },

  // Contact prompts
  {
    icon: "📧",
    prefix: "",
    prompt: "How can I contact you?",
    category: "contact",
  },
 
];
