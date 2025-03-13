"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { RiRobot2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import {
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
  ContactCard,
  LinkCard,
} from "./ai-chat-cards";
import AIChatAnimation from "../ui/ai-chat-animation";

interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  structuredContent?: StructuredContent | null;
}

interface StructuredContent {
  type: "skills" | "projects" | "experience" | "contact" | "links" | "general";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Array of clickbait prompts to randomly select from
const clickbaitPrompts = [
  "It's not 2025 if you don't interact with the AI!",
  "Discover my portfolio secrets with AI assistance!",
  "Ask my AI anything about my work - it knows more than I do!",
  "This AI can tell you things about me I forgot to mention...",
  "Feeling curious? My AI assistant is waiting to chat!",
  "Don't scroll past without saying hi to my AI!",
  "The future is here - talk to my portfolio AI!",
  "Psst... My AI assistant knows all my coding secrets!",
  "Click me! I'm an AI that can tell you about Rushikesh's skills!",
  "Want to know more? I'm the AI that knows it all!",
];

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // State for the clickbait prompt
  const [showClickbait, setShowClickbait] = useState(true);
  const [clickbaitText, setClickbaitText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Add states for the animation
  const [showAnimation, setShowAnimation] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const chatButtonRef = useRef<HTMLButtonElement>(null);

  // Select a random clickbait prompt on initial load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * clickbaitPrompts.length);
    setClickbaitText(clickbaitPrompts[randomIndex]);

    // Check if user has interacted before
    const hasInteractedBefore = localStorage.getItem("hasInteractedWithAI");
    if (hasInteractedBefore === "true") {
      setShowClickbait(false);
      setHasInteracted(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Show animation first
      setShowAnimation(true);
      // Start loading chat data while animation is playing

      return () => clearTimeout(100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Hide clickbait when chat is opened
      setShowClickbait(false);

      // Mark that user has interacted
      setHasInteracted(true);
      localStorage.setItem("hasInteractedWithAI", "true");
    }
  }, [isOpen]);

  useEffect(() => {
    const initializeChat = async () => {
      if (isOpen) {
        // Get main content excluding specific sections
        const mainElement = document.querySelector("main");
        if (!mainElement) return;

        // Clone the main content
        const mainContent = mainElement.cloneNode(true) as HTMLElement;

        // Remove unwanted sections
        const elementsToRemove = [
          "[data-chat-modal]",
          "#contact",
          "[data-contact-section]",
          "form",
          ".contact-section",
          "script",
          "style",
          "noscript",
          "iframe",
        ];

        elementsToRemove.forEach((selector) => {
          const elements = mainContent.querySelectorAll(selector);
          elements.forEach((element) => element.remove());
        });

        // Set initial message
        setMessages([
          {
            type: "assistant",
            content:
              "👋 Hey! I'm Rushikesh. What would you like to know about my work?",
            timestamp: new Date(),
          },
        ]);
      }
    };

    initializeChat().catch((error) => {
      console.error("Failed to initialize chat:", error);
      setError("Failed to initialize chat. Please try again.");
    });
  }, [isOpen]);

  const parseStructuredContent = (
    content: string
  ): StructuredContent | null => {
    try {
      // Check if the content contains JSON structure markers
      if (content.includes("```json") && content.includes("```")) {
        const jsonMatch = content.match(/```json([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const jsonData = JSON.parse(jsonMatch[1].trim());
          return jsonData;
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to parse structured content:", error);
      return null;
    }
  };

  const processMessage = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);

      try {
        // Pass the entire message history to maintain context
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userMessage,
            messages: messages, // Pass the entire chat history
            structuredResponse: true, // Request structured response when appropriate
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();

        // If search was performed, show search animation for a moment
        if (data.isSearchPerformed) {
          setIsSearching(true);
          // Keep search animation visible for at least 1.5 seconds
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setIsSearching(false);
        }

        // Parse structured content if available
        const structuredContent = parseStructuredContent(data.response);

        return {
          content: data.response,
          structuredContent,
          hasStructuredData: data.hasStructuredData,
          structuredDataType: data.structuredDataType,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  // Function to check if a click event is trusted
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    // isTrusted is true for real user interactions, false for programmatic clicks
    if (e.isTrusted) {
      callback();
    } else {
      setError("Automated clicks are not allowed(Nice try kiddo)");
      console.warn("Detected programmatic click attempt");
    }
  };

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

    try {
      const response = await processMessage(userMessage.content);

      // Extract the structured content if available
      const structuredContent = parseStructuredContent(response.content);

      // If the response has structured data, we can make the text response more concise
      // by removing any duplicated information
      let displayContent = response.content;

      // Remove the JSON block from the displayed content
      if (structuredContent) {
        displayContent = displayContent
          .replace(/```json[\s\S]*?```/g, "")
          .trim();
      }

      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? {
                ...msg,
                content: displayContent,
                structuredContent: structuredContent,
                hasStructuredData: response.hasStructuredData,
                structuredDataType: response.structuredDataType,
              }
            : msg
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, content: `Error: ${errorMessage}` }
            : msg
        )
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Render structured content based on type
  const renderStructuredContent = (content: StructuredContent) => {
    switch (content.type) {
      case "skills":
        return <SkillsCard skills={content.data} />;
      case "projects":
        return <ProjectsCard projects={content.data} />;
      case "experience":
        return <ExperienceCard experiences={content.data} />;
      case "contact":
        return <ContactCard contact={content.data} />;
      case "links":
        return <LinkCard links={content.data} />;
      default:
        return null;
    }
  };

  // Function to capture the button position
  const captureButtonPosition = () => {
    if (chatButtonRef.current) {
      const rect = chatButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  // Function to handle animation completion
  const handleAnimationComplete = () => {
    // Hide animation after it completes
    setTimeout(() => {
      setShowAnimation(false);
    }, 300);

    // Focus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };

  // Function to handle clickbait click
  const handleClickbaitClick = () => {
    captureButtonPosition();
    setShowClickbait(false);
    setHasInteracted(true);
    localStorage.setItem("hasInteractedWithAI", "true");
    // Your existing open chat logic
    if (!isOpen) {
      // Call your open function here
    }
  };

  // Add a new useEffect for auto-dismissal
  useEffect(() => {
    // Auto-dismiss clickbait after 8 seconds
    if (showClickbait && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowClickbait(false);
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [showClickbait, hasInteracted]);

  return (
    <>
      {/* Chat button with ref to capture position */}
      <button
        ref={chatButtonRef}
        onClick={() => {
          captureButtonPosition();
          // Your existing open chat logic
          setShowClickbait(false);
          setHasInteracted(true);
          localStorage.setItem("hasInteractedWithAI", "true");
        }}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      >
        <RiRobot2Line className="w-6 h-6 text-white" />
      </button>

      {/* Clickbait prompt */}
      <AnimatePresence>
        {showClickbait && !isOpen && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: 1, // Delay appearance to not overwhelm user on initial load
            }}
            className="fixed bottom-20 right-6 max-w-xs p-4 rounded-2xl z-40"
            onClick={handleClickbaitClick}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                <RiRobot2Line className="w-6 h-6 text-white" />
              </div>
              <div>
                <motion.p
                  className="text-white text-sm font-medium mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {clickbaitText}
                </motion.p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 8, // Match the 8 second timeout
                    ease: "linear",
                    repeat: 0,
                  }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                />
              </div>
            </div>
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-700 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowClickbait(false);
              }}
            >
              <IoClose className="w-4 h-4 text-neutral-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Show animation when opening */}
        {isOpen && showAnimation && (
          <AIChatAnimation
            onAnimationComplete={handleAnimationComplete}
            buttonPosition={buttonPosition}
          />
        )}

        {/* Show chat modal after animation */}
        {isOpen && !showAnimation && (
          <motion.div
            data-chat-modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl mx-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg">
                <div
                  onClick={onClose}
                  className="border-b border-neutral-800/50 p-4 flex items-center justify-between bg-black/50 backdrop-blur-sm cursor-pointer hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <RiRobot2Line className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-200">
                        AI Assistant
                      </h3>
                      <p className="text-sm text-neutral-400">
                        Powered by Llama 3.3 & Web Search
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors">
                    <IoClose className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                <div className="h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {error ? (
                      <div
                        className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(error),
                        }}
                      />
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          key={index}
                          className={`flex ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          } group`}
                        >
                          {message.type === "assistant" && (
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-lg">
                              <RiRobot2Line className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] p-3 rounded-xl shadow-lg ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                : "bg-neutral-800/50 text-white border border-neutral-700/50 backdrop-blur-sm"
                            }`}
                          >
                            {message.type === "assistant" &&
                            index === messages.length - 1 &&
                            message.content === "..." ? (
                              isSearching ? (
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <FiSearch className="w-4 h-4 text-blue-400 animate-pulse" />
                                    <div className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                                      Searching the web...
                                    </div>
                                  </div>
                                  <div className="relative w-32 h-1 bg-neutral-700/50 rounded-full overflow-hidden">
                                    <motion.div
                                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                      initial={{ width: "0%" }}
                                      animate={{ width: "100%" }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        ease: "easeInOut",
                                      }}
                                    />
                                  </div>
                                  <div className="flex space-x-3 mt-1">
                                    <div
                                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                      className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "150ms" }}
                                    ></div>
                                    <div
                                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                                      style={{ animationDelay: "300ms" }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-1">
                                    <motion.div
                                      className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                      animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                      }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        times: [0, 0.5, 1],
                                      }}
                                    />
                                    <motion.div
                                      className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                      animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                      }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: 0.2,
                                        times: [0, 0.5, 1],
                                      }}
                                    />
                                    <motion.div
                                      className="w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                                      animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                      }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: 0.4,
                                        times: [0, 0.5, 1],
                                      }}
                                    />
                                  </div>
                                  <div className="text-xs text-neutral-400 italic">
                                    Thinking...
                                  </div>
                                </div>
                              )
                            ) : (
                              <>
                                {/* Only show the text response if it's not empty after removing JSON */}
                                {message.content.trim() && (
                                  <div
                                    className="prose prose-invert prose-xs max-w-none text-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        marked.parse(message.content).toString()
                                      ),
                                    }}
                                  />
                                )}

                                {/* Add a small divider if we have both text and structured content */}
                                {message.content.trim() &&
                                  message.structuredContent && (
                                    <div className="my-2 border-t border-neutral-700/30"></div>
                                  )}

                                {/* Render structured content if available */}
                                {message.structuredContent &&
                                  renderStructuredContent(
                                    message.structuredContent
                                  )}
                              </>
                            )}
                            <div className="mt-1 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          {message.type === "user" && (
                            <div className="w-7 h-7 rounded-xl bg-neutral-800 flex items-center justify-center ml-2 shadow-lg">
                              <FaUser className="w-4 h-4 text-neutral-300" />
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-neutral-800/50 p-4 bg-black/30 backdrop-blur-sm">
                    <form
                      onSubmit={(e) =>
                        handleButtonClick(
                          e as unknown as React.MouseEvent,
                          () => handleSubmit(e)
                        )
                      }
                      className="flex gap-3"
                    >
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
                        type="button"
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleSubmit(e as unknown as React.FormEvent)
                          )
                        }
                        disabled={isLoading || !input.trim()}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                          isLoading || !input.trim()
                            ? "bg-neutral-800/50 text-neutral-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        {isLoading ? (
                          <CgSpinner className="animate-spin h-5 w-5" />
                        ) : (
                          <IoSend className="w-5 h-5" />
                        )}
                      </button>
                    </form>

                    {/* Add error message display */}
                    {error && (
                      <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400 text-xs">
                        <div className="flex items-center gap-2">
                          <span>❌</span>
                          <span>{error}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
