import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { RiRobot2Line } from "react-icons/ri";
import { IoClose, IoSend } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { predefinedPrompts } from "@/data/prompt-data";
import {
  HeaderProps,
  MessageDisplayProps,
  InputAreaProps,
  Message,
  StructuredContent,
} from "./types";
import {
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
  ContactCard,
  LinkCard,
} from "../ai-chat-cards";

// Glitch animation for cyberpunk effect
const glitchAnimation = {
  textShadow: [
    "0 0 0 #00ffff",
    "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff, 2px 2px 0 #ff00ff",
    "0 0 0 #00ffff",
  ],
  opacity: [1, 0.8, 1],
  x: [0, -1, 1, 0],
};

/**
 * Header component for the chat modal
 */
export const ChatHeader: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Minimal Header Content if needed */}
      </div>
      {/* 
      <button 
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
      >
        <IoClose className="w-5 h-5 text-white/50 group-hover:text-white" />
      </button>
      */}
    </div>
  );
};

/**
 * Component to render all messages in the chat
 */
export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  isSearching,
  error,
  renderStructuredContent,
  messagesEndRef,
}) => {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 pb-28 sm:pb-32 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent touch-pan-y">
      {/* Content Fade In */}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 text-red-200 border border-red-500/20 rounded-2xl p-4 text-sm backdrop-blur-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(error),
            }}
          />
        ) : (
          messages.map((message, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                } group`}
            >
              {message.type === "assistant" && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 backdrop-blur-sm">
                  <RiRobot2Line className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-300" />
                </div>
              )}
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm ${message.type === "user"
                  ? "bg-indigo-600/20 text-white border border-indigo-500/20 backdrop-blur-md rounded-br-none"
                  : "bg-white/5 text-white/90 border border-white/10 backdrop-blur-md rounded-bl-none"
                  }`}
              >
                {message.type === "assistant" &&
                  index === messages.length - 1 &&
                  message.content === "..." ? (
                  isSearching ? (
                    <SearchingIndicator />
                  ) : (
                    <ThinkingIndicator />
                  )
                ) : (
                  <MessageContent
                    message={message}
                    renderStructuredContent={renderStructuredContent}
                  />
                )}
                <div className="mt-1 text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))
        )}
        {messagesEndRef && <div ref={messagesEndRef} />}
      </AnimatePresence>
    </div>
  );
};

/**
 * Message content component
 */
const MessageContent: React.FC<{
  message: Message;
  renderStructuredContent: (content: StructuredContent) => React.ReactNode;
}> = ({ message, renderStructuredContent }) => {
  const isBasicQuestion =
    message.type === "assistant" &&
    message.content &&
    message.content.toLowerCase().includes("rushikesh") &&
    (message.content.toLowerCase().includes("created") ||
      message.content.toLowerCase().includes("made") ||
      message.content.toLowerCase().includes("developer"));

  return (
    <>
      {message.content && message.content.trim() && (
        <div
          className="prose prose-invert prose-xs sm:prose-sm max-w-none text-white/90 leading-relaxed [&_p]:text-xs sm:[&_p]:text-sm [&_li]:text-xs sm:[&_li]:text-sm [&_h1]:text-base sm:[&_h1]:text-lg [&_h2]:text-sm sm:[&_h2]:text-base [&_h3]:text-xs sm:[&_h3]:text-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(message.content).toString()
            ),
          }}
        />
      )}

      {message.content &&
        message.content.trim() &&
        message.structuredContent &&
        !isBasicQuestion && (
          <div className="my-3 border-t border-white/10"></div>
        )}

      {message.structuredContent &&
        !isBasicQuestion &&
        renderStructuredContent(message.structuredContent)}
    </>
  );
};

/**
 * Animated searching indicator - compact pill style
 */
const SearchingIndicator: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
      <FiSearch className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
      <span className="text-xs sm:text-sm text-cyan-400/90">Searching...</span>
    </div>
  );
};

/**
 * Animated thinking indicator - compact pill style
 */
const ThinkingIndicator: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
      <span className="text-xs sm:text-sm text-indigo-300/90 mr-1">Thinking</span>
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
};

/**
 * Modern Clean Input Area Component
 * Designed to match AISlideInput aesthetic (centered glass pill)
 */
export const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  isLoading,
  isThemeMode,
  themeChangeHistory,
  handleSubmit,
  handleKeyDown,
  resetThemeChanges,
  inputRef,
  isThemeRequest,
}) => {
  const [activePromptCategory, setActivePromptCategory] = useState<"all" | "theme" | "info" | "contact">("all");
  const [isPromptPanelExpanded, setIsPromptPanelExpanded] = useState(false);

  // Auto-focus input
  React.useEffect(() => {
    // Small delay to ensure render
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  return (
    <div className="flex-shrink-0 p-6 flex justify-center items-end" style={{ paddingBottom: '24px' }}>
      <div className="w-full max-w-3xl relative flex items-center justify-center gap-4">
        {/* Floating Suggestions Panel (Absolute positioned above) */}
        <AnimatePresence>
          {isPromptPanelExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-20 left-4 w-80 bg-[#0f1115]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Suggestions</span>
                  <button onClick={() => setIsPromptPanelExpanded(false)} className="text-white/40 hover:text-white">
                    <IoClose size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {predefinedPrompts.slice(0, 8).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(`${p.prefix} ${p.prompt}`);
                        setIsPromptPanelExpanded(false);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white/80 transition-colors text-left"
                    >
                      {p.prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Separate Action Buttons Group (Left) */}
        <div className="flex items-center gap-3">
          {/* Suggestions Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPromptPanelExpanded(!isPromptPanelExpanded)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border shadow-lg backdrop-blur-sm ${isPromptPanelExpanded
              ? "bg-white/20 text-white border-white/20"
              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            title="Suggestions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const isTheme = isThemeRequest(input);
              setInput(isTheme ? input.replace(/^(theme:|search:)\s*/i, "").trim() : `Theme: ${input.replace(/^(theme:|search:)\s*/i, "").trim()}`);
              inputRef.current?.focus();
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border shadow-lg backdrop-blur-sm ${isThemeRequest(input)
              ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            title="Toggle Theme Mode"
          >
            <span className="text-xl">🎨</span>
          </button>
        </div>

        {/* The Glass Pill Input Container - Matches AISlideInput structure */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center flex-1"
        >
          <div
            className="w-full flex items-center rounded-[28px] overflow-hidden transition-all duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
              height: "56px"
            }}
          >
            {/* Main Input */}
            <div className="flex-1 flex items-center h-full px-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isThemeRequest(input) ? "Describe UI changes..." : "Ask me anything..."}
                disabled={isLoading}
                className="w-full bg-transparent text-white text-lg placeholder-white/40 focus:outline-none h-full px-4"
                style={{ caretColor: "rgba(99, 102, 241, 0.8)" }}
              />
            </div>

            {/* Send Button */}
            <button
              type="button" // Prevent form submission on click to use handleSubmit logic
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
              disabled={!input.trim() || isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 flex-shrink-0 mr-1 ${input.trim() && !isLoading
                ? "bg-white/10 text-white hover:bg-white/20"
                : "text-white/20 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <CgSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <IoSend className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {/* Info Text */}
        <div className="absolute top-full left-0 right-0 mt-3 text-center pointer-events-none">
          <p className="text-white/20 text-xs">Press Enter to send • Esc to close</p>
        </div>
      </div>
    </div>
  );
};
