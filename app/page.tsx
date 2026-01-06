"use client";

import ExperiencePage from "./experience/page";
import HeroPage from "./home/page";
import About from "./about/page";
import Skills from "./skills/page";
import Contact from "./contact/page";
import Projects from "./projects/page";
import { AIChatModal } from "../components/tools/ai-chat-modal";
import { UnifiedAIInput } from "../components/tools/UnifiedAIInput";
import { useState, useEffect, useCallback, useRef } from "react";
import GitHub from "./github/page";
import NeuralBackground from "../components/neural-background";
import { useThemeHandler, useMessageHandler, initializeChat } from "../components/tools/ai-chat/chat-utils";

export default function Home() {
  // Theme and Message Handlers
  const themeHandlers = useThemeHandler();
  // Lifted Chat State
  const messageHandlers = useMessageHandler(themeHandlers);
  const {
    messages,
    setMessages,
    isLoading,
    isSearching,
    error,
    setError,
    processThemeRequest,
    processMessage,
    isThemeRequest,
  } = messageHandlers;

  // UI State
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");

  // Initialize chat when opened
  useEffect(() => {
    if (isChatOpen) {
      if (messages.length === 0) {
        initializeChat(setMessages, setError);
      }
      localStorage.setItem("hasInteractedWithAI", "true");
    }
  }, [isChatOpen, messages.length, setMessages, setError]);

  // Button position for sliding input
  const buttonPosition = { right: 24, bottom: 24 };

  // Handle Form Submission
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if this is the first interaction (Chat not open yet)
    if (!isChatOpen) {
      setIsChatOpen(true);
      // We don't close input, it just expands via UnifiedAIInput state
    }

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

    // Add messages locally immediately
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Clear input
    const currentInput = input;
    setInput("");

    // Process Request
    try {
      const isTheme = isThemeRequest(userMessage.content);
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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? { ...msg, content: `Error: ${errorMessage}` }
            : msg
        )
      );
    }
  };

  // Handle AI button click - toggle input visibility
  const handleAIButtonClick = useCallback(() => {
    if (isChatOpen) {
      // If chat is open, close it
      setIsChatOpen(false);
      setIsInputVisible(false); // Also hide input
    } else if (isInputVisible) {
      // If input is visible, hide it
      setIsInputVisible(false);
    } else {
      // Show the sliding input
      setIsInputVisible(true);
    }
  }, [isChatOpen, isInputVisible]);

  // Handle close
  const handleClose = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
      setIsInputVisible(false); // Fully close? Or return to input only? Usually full close.
    } else {
      setIsInputVisible(false);
    }
  };

  // Grid overlay ref for React-managed DOM
  const gridOverlayRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="main-content"
      id="main-content"
      data-theme-target="main-content"
    >
      {/* Dark tech background */}
      <div
        className="fixed inset-0 bg-black z-[-2]"
        id="page-background-base"
        data-theme-target="page-background-base"
      >
        {/* Grid overlay - rendered as React element instead of DOM manipulation */}
        <div
          ref={gridOverlayRef}
          className="absolute inset-0 z-[-1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20, 255, 140, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 255, 140, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.15,
          }}
        />
      </div>

      <div className="min-h-screen w-full text-white overflow-x-hidden relative">
        {/* Gradient cyberpunk background */}
        <NeuralBackground />

        <section
          id="home"
          className="relative z-10"
          data-theme-target="home-section"
        >
          <HeroPage />
        </section>
      </div>

      {/* Main Sections with clear data attributes */}
      <section id="about" className="scroll-mt-20" data-theme-target="about-section">
        <About />
      </section>

      <section id="experience" className="scroll-mt-20" data-theme-target="experience-section">
        <ExperiencePage />
      </section>

      <section id="skills" className="scroll-mt-20" data-theme-target="skills-section">
        <Skills />
      </section>

      <section id="projects" className="scroll-mt-20" data-theme-target="projects-section">
        <Projects />
      </section>

      <section id="github" className="scroll-mt-20" data-theme-target="github-section">
        <GitHub />
      </section>

      <section id="contact" className="scroll-mt-20" data-theme-target="contact-section">
        <Contact />
      </section>

      {/* Circular AI Button */}
      {/* Circular AI Button */}

      <button
        onClick={handleAIButtonClick}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full shadow-xl transition-all duration-300 transform z-[60] 
          ${isChatOpen || isInputVisible
            ? "bg-neutral-900/80 backdrop-blur-sm border border-indigo-500/50 hover:bg-neutral-800/80 rotate-0 hover:rotate-90"
            : "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:scale-105"
          }
          group flex items-center justify-center`}
        style={{
          boxShadow: isChatOpen || isInputVisible
            ? "0 0 20px rgba(99, 102, 241, 0.3)"
            : "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(99, 102, 241, 0.2)",
        }}
        data-theme-target="chat-button"
      >
        <div className="relative">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
        </div>
      </button>

      {/* Unified Input Component - Always on top */}
      <UnifiedAIInput
        input={input}
        setInput={setInput}
        onSubmit={handlePromptSubmit}
        onClose={handleClose}
        isLoading={isLoading}
        isChatOpen={isChatOpen}
        isInputVisible={isInputVisible}
        buttonPosition={buttonPosition}
        themeHandlers={themeHandlers}
        isThemeRequest={isThemeRequest}
      />

      {/* Full Page Chat Modal - Background & Messages */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={handleClose}
        messages={messages}
        isSearching={isSearching}
        error={error}
      />

      <style jsx global>{`
        /* Scanlines effect */
        .bg-scanlines {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(32, 255, 177, 0.05) 50%,
            transparent 51%,
            rgba(32, 255, 177, 0.05) 100%
          );
          background-size: 100% 4px;
          height: 100%;
        }
        /* ... existing styles ... */
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-30px, 30px) scale(1.05); }
          50% { transform: translate(20px, -20px) scale(0.95); }
          75% { transform: translate(-20px, -20px) scale(1.05); }
        }
        .animate-blob { animation: blob 15s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </main>
  );
}
