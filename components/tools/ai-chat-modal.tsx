'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Type declarations
interface AIModelCapabilities {
  available: string;
  // Add other capability properties as needed
}

interface AIModelSession {
  promptStreaming: (prompt: string) => AsyncIterableIterator<string>;
  // Add other session properties as needed
}

interface AILanguageModel {
  create: () => Promise<AIModelSession>;
  capabilities: () => Promise<AIModelCapabilities>;
  promptStreaming: (prompt: string) => Promise<AsyncIterableIterator<string>>;
}

declare global {
  interface Window {
    ai?: {
      languageModel: AILanguageModel;
    };
  }
}

interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<AIModelSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [websiteContent, setWebsiteContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const initializeChat = async () => {
      if (typeof window !== 'undefined' && isOpen) {
        if (!window.ai?.languageModel) {
          setError(`
            <div class="space-y-4">
              <div class="flex items-center space-x-2 text-yellow-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Gemini Nano Setup Required</span>
              </div>

              <div class="space-y-3">
                <p class="text-neutral-300">System Requirements:</p>
                <ul class="space-y-1 text-neutral-300 text-sm list-disc list-inside pl-2">
                  <li>Chrome Version 128.0.6545.0 or above (Dev/Canary)</li>
                  <li>Windows 10/11 or MacOS 13+</li>
                  <li>Non-metered internet connection</li>
                </ul>
              </div>

              <div class="space-y-3">
                <p class="text-neutral-300">Setup Steps:</p>
                <ol class="space-y-2 list-decimal list-inside text-neutral-300 text-sm">
                  <li>Download <a href="https://www.google.com/chrome/dev/" class="text-blue-400 hover:underline" target="_blank">Chrome Dev</a> or Canary</li>
                  <li>Visit <code class="bg-neutral-800 px-2 py-0.5 rounded">chrome://flags/#prompt-api-for-gemini-nano</code></li>
                  <li>Enable "Generative AI features"</li>
                  <li>Relaunch Chrome</li>
                  <li>Visit <code class="bg-neutral-800 px-2 py-0.5 rounded">chrome://components</code></li>
                  <li>Check for updates to download Gemini Nano</li>
                </ol>
              </div>

              <div class="bg-neutral-800/50 rounded-lg p-3 mt-2 space-y-2">
                <p class="text-neutral-400 text-xs">
                  <strong>Note:</strong> Currently only supported on desktop Chrome (Dev/Canary).
                </p>
                <p class="text-neutral-400 text-xs">
                  <strong>Troubleshooting:</strong> If setup fails, try relaunching Chrome and checking components again.
                </p>
              </div>
            </div>
          `);
          return;
        }
        
        // Get main content excluding specific sections
        const mainElement = document.querySelector('main');
        if (!mainElement) {
          
          return;
        }

        // Clone the main content
        const mainContent = mainElement.cloneNode(true) as HTMLElement;
        
        // Remove unwanted sections
        const elementsToRemove = [
          '[data-chat-modal]',
          '#contact',
          '[data-contact-section]',
          'form',
          '.contact-section',
          'script',
          'style',
          'noscript',
          'iframe'
        ];
        
        elementsToRemove.forEach(selector => {
          const elements = mainContent.querySelectorAll(selector);
          elements.forEach(element => element.remove());
        });

        // Extract text content and clean it up
        const textContent = mainContent.innerText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

      
        
        setWebsiteContent(textContent);
        await initializeSession();
      }
    };

    initializeChat().catch(() => {
      
    });
  }, [isOpen]);

  const initializeSession = async () => {
    try {
      if (window.ai?.languageModel) {
        const newSession = await window.ai.languageModel.create();
        setSession(newSession);
        setMessages([
          {
            type: "assistant",
            content: "👋 Hey! I'm Rushikesh. What would you like to know about my work?",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize';
      setError("Failed to initialize: " + errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session || isLoading) return;

    const userMessage: Message = {
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      type: "assistant",
      content: "...",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `
        You are Rushikesh. Keep responses short and use "I" statements.
        
        Content: ${websiteContent}

        Rules:
        1. Speak as Rushikesh using "I" and "my"
        2. Keep responses under 2 sentences
        3. Focus on skills and projects
        4. If unsure, say "Contact me directly"

        Message: ${userMessage.content}
      `;

    

      const stream = await session.promptStreaming(prompt);
      let fullResponse = "";

      for await (const chunk of stream) {
        fullResponse = chunk.trim();
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, content: `Error: ${errorMessage}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-chat-modal
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-20 right-6 z-50 w-[350px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg">
            <div 
              onClick={onClose}
              className="border-b border-neutral-800/50 p-3 flex items-center space-x-3 bg-black/50 backdrop-blur-sm cursor-pointer hover:bg-neutral-800/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-sm">✨</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Chat with Gemini Nano</h2>
                <p className="text-xs text-neutral-400">Powered by Google AI</p>
              </div>
            </div>

            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {error ? (
                  <div 
                    className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 text-sm"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error) }}
                  />
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key={index}
                      className={`flex ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      } group`}
                    >
                      {message.type === "assistant" && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-lg">
                          <span className="text-xs">✨</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] p-3 rounded-xl shadow-lg ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-neutral-800/50 text-white border border-neutral-700/50 backdrop-blur-sm"
                        }`}
                      >
                        <div 
                          className="prose prose-invert prose-xs max-w-none text-sm"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(marked.parse(message.content).toString())
                          }}
                        />
                        <div className="mt-1 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {message.type === "user" && (
                        <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center ml-2 shadow-lg">
                          <span className="text-neutral-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-neutral-800/50 p-3 bg-black/30 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 bg-neutral-800/50 text-sm text-white placeholder-neutral-400 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`px-3 py-2 rounded-xl transition-all duration-200 ${
                      isLoading || !input.trim()
                        ? "bg-neutral-800/50 text-neutral-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}