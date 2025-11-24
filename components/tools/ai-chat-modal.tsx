"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IoClose } from "react-icons/io5";

import {
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
  ContactCard,
  LinkCard,
} from "./ai-chat-cards";
import AIChatAnimation from "../ui/ai-chat-animation";
import { clickbaitPrompts } from "@/data/prompt-data";
import {
  ChatHeader,
  MessageDisplay,
  InputArea,
} from "./ai-chat/chat-components";
import {
  useThemeHandler,
  useMessageHandler,
  initializeChat,
  isTrustedClick,
} from "./ai-chat/chat-utils";
import { AIChatModalProps } from "./ai-chat/types";
import { RiRobot2Line } from "react-icons/ri";

interface StructuredContent {
  type: "skills" | "projects" | "experience" | "contact" | "links" | "general";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  // Theme handling
  const themeHandlers = useThemeHandler();
  const { themeChangeHistory, resetThemeChanges } = themeHandlers;

  // Message handling
  const messageHandlers = useMessageHandler(themeHandlers);
  const {
    messages,
    setMessages,
    isLoading,
    isSearching,
    error,
    setError,
    messagesEndRef,
    isThemeRequest,
    processThemeRequest,
    processMessage,
  } = messageHandlers;

  // UI State
  const [input, setInput] = useState("");
  const [showClickbait, setShowClickbait] = useState(true);
  const [clickbaitText, setClickbaitText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    if (isOpen) {
      initializeChat(setMessages, setError);
    }
  }, [isOpen, setMessages, setError]);

  // Auto-dismiss clickbait after 8 seconds
  useEffect(() => {
    if (showClickbait && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowClickbait(false);
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [showClickbait, hasInteracted]);

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
    setShowClickbait(false);
    setHasInteracted(true);
    localStorage.setItem("hasInteractedWithAI", "true");
    // Additional open logic can be placed here
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: "user" as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    const assistantMessage = {
      type: "assistant" as const,
      content: "...",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      // Check if this is a theme request
      const isTheme = isThemeRequest(userMessage.content);

      // Process accordingly
      const response = isTheme
        ? await processThemeRequest(userMessage.content)
        : await processMessage(userMessage.content);

      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? {
              ...msg,
              content: response.content,
              structuredContent: response.structuredContent,
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

  // Function to check if a click event is trusted
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    if (isTrustedClick(e)) {
      callback();
    } else {
      setError("Automated clicks are not allowed (Nice try kiddo)");
      console.warn("Detected programmatic click attempt");
    }
  };

  // Handle key press events
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

  return (
    <>
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
                <ChatHeader onClose={onClose} />

                <div className="h-[500px] flex flex-col">
                  <MessageDisplay
                    messages={messages}
                    isSearching={isSearching}
                    error={error}
                    renderStructuredContent={renderStructuredContent}
                  />

                  <div ref={messagesEndRef} />

                  <InputArea
                    input={input}
                    setInput={setInput}
                    isLoading={isLoading}
                    isThemeMode={themeHandlers.isThemeMode}
                    themeChangeHistory={themeChangeHistory}
                    handleSubmit={(e) =>
                      handleButtonClick(e as unknown as React.MouseEvent, () =>
                        handleSubmit(e)
                      )
                    }
                    handleKeyDown={handleKeyDown}
                    resetThemeChanges={resetThemeChanges}
                    inputRef={inputRef as React.RefObject<HTMLTextAreaElement>}
                    isThemeRequest={isThemeRequest}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatModal;
