'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";

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
      if (isOpen) {
        // Get main content excluding specific sections
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

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
        
        // Set initial message
        setMessages([
          {
            type: "assistant",
            content: "👋 Hey! I'm Rushikesh. What would you like to know about my work?",
            timestamp: new Date(),
          },
        ]);
      }
    };

    initializeChat().catch(error => {
      console.error('Failed to initialize chat:', error);
      setError("Failed to initialize chat. Please try again.");
    });
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          websiteContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, content: data.response } : msg
        )
      );
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
              className="border-b border-neutral-800/50 p-4 flex items-center justify-between bg-black/50 backdrop-blur-sm cursor-pointer hover:bg-neutral-800/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M17.5 12a5.5 5.5 0 1 0-5.5 5.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-200">AI Assistant</h3>
                  <p className="text-sm text-neutral-400">Ask me anything about the portfolio</p>
                </div>
              </div>
              <button className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-lg">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z" />
                          </svg>
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
                        <div className="w-7 h-7 rounded-xl bg-neutral-800 flex items-center justify-center ml-2 shadow-lg">
                          <svg className="w-4 h-4 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-neutral-800/50 p-4 bg-black/30 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex gap-3">
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
                    className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
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
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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

