import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { RiRobot2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
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
    <div
      onClick={onClose}
      className="border-b border-indigo-500/20 p-4 flex items-center justify-between bg-neutral-900/80 backdrop-blur-md cursor-pointer hover:bg-neutral-800/30 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <RiRobot2Line className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-neutral-200">AI Assistant</h3>
          <p className="text-sm text-neutral-400">
            Powered by Grok 4 Fast & Web Search
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors">
        <IoClose className="w-5 h-5 text-neutral-400" />
      </button>
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
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 filter blur-[80px] -z-10" />

      {error ? (
        <div
          className="bg-neutral-900/90 text-red-600 border border-red-500/30 rounded-lg p-4 text-sm"
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
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
              } group`}
          >
            {message.type === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mr-2 shadow-lg">
                <RiRobot2Line className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] p-3 rounded-xl shadow-lg ${message.type === "user"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-700 text-white border border-indigo-500/30"
                : "bg-neutral-900/70 text-white border border-indigo-500/20 backdrop-blur-sm"
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
              <div className="mt-1 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {message.type === "user" && (
              <div className="w-7 h-7 rounded-xl bg-neutral-800 border border-indigo-500/20 flex items-center justify-center ml-2 shadow-lg">
                <FaUser className="w-4 h-4 text-neutral-300" />
              </div>
            )}
          </motion.div>
        ))
      )}
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
  // Don't show structured content for simple questions like "who made you"
  const isBasicQuestion =
    message.type === "assistant" &&
    message.content &&
    message.content.toLowerCase().includes("rushikesh") &&
    (message.content.toLowerCase().includes("created") ||
      message.content.toLowerCase().includes("made") ||
      message.content.toLowerCase().includes("developer"));

  return (
    <>
      {/* Always show the text response */}
      {message.content && message.content.trim() && (
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
      {message.content &&
        message.content.trim() &&
        message.structuredContent &&
        !isBasicQuestion && (
          <div className="my-2 border-t border-indigo-500/20"></div>
        )}

      {/* Only render structured content if it's not a basic question about the creator */}
      {message.structuredContent &&
        !isBasicQuestion &&
        renderStructuredContent(message.structuredContent)}
    </>
  );
};

/**
 * Animated searching indicator
 */
const SearchingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-2">
        <FiSearch className="w-4 h-4 text-cyan-400 animate-pulse" />
        <motion.div
          className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-cyan-500 bg-clip-text text-transparent"
          animate={glitchAnimation}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            repeatDelay: 5,
          }}
        >
          Searching the web...
        </motion.div>
      </div>
      <div className="relative w-32 h-1 bg-neutral-700/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
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
          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Animated thinking indicator
 */
const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-1">
        <motion.div
          className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
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
          className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
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
          className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
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
      <div className="text-xs text-neutral-400 italic">Thinking...</div>
    </div>
  );
};

/**
 * Input area component with predefined prompts
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
  const promptScrollRef = useRef<HTMLDivElement>(null);
  const [activePromptCategory, setActivePromptCategory] = useState<
    "all" | "theme" | "info" | "contact"
  >("all");

  // Add state to track if prompt panel is expanded
  const [isPromptPanelExpanded, setIsPromptPanelExpanded] = useState(true);

  // Add state to track loading message timing
  const [showSecondaryLoadingMessage, setShowSecondaryLoadingMessage] =
    useState(false);

  // Effect to handle the loading message change timer
  React.useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isThemeMode && isLoading) {
      setShowSecondaryLoadingMessage(false);
      timerId = setTimeout(() => {
        setShowSecondaryLoadingMessage(true);
      }, 10000);
    } else {
      setShowSecondaryLoadingMessage(false);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isThemeMode, isLoading]);

  // Function to toggle prompt panel
  const togglePromptPanel = () => {
    setIsPromptPanelExpanded((prev) => !prev);
  };

  // Function to handle predefined prompt selection
  const handlePromptSelect = (prefix: string, prompt: string) => {
    setInput(`${prefix} ${prompt}`.trim());
    // Collapse panel after selection
    setIsPromptPanelExpanded(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Add horizontal scroll with arrow buttons functionality
  const scrollPrompts = (direction: "left" | "right") => {
    if (promptScrollRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const currentScroll = promptScrollRef.current.scrollLeft;
      promptScrollRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Get filtered prompts based on active category
  const filteredPrompts =
    activePromptCategory === "all"
      ? predefinedPrompts
      : predefinedPrompts.filter(
        (prompt) => prompt.category === activePromptCategory
      );

  return (
    <div className="border-t border-indigo-500/20 p-4 bg-neutral-900/80 backdrop-blur-md">
      {themeChangeHistory.length > 0 && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-indigo-400 font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <span>Custom Theme Active</span>
              <span className="ml-1 text-[10px] text-neutral-400">
                ({themeChangeHistory.length}{" "}
                {themeChangeHistory.length === 1 ? "change" : "changes"})
              </span>
            </div>
            {themeChangeHistory.length > 0 && (
              <button
                onClick={resetThemeChanges}
                className="text-xs px-2 py-0.5 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors border border-red-900/30"
              >
                Reset UI
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapsible prompt suggestion panel */}
      <div className="relative mb-3">
        {/* Toggle button for prompt panel */}
        <button
          onClick={togglePromptPanel}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-neutral-800/80 border border-indigo-500/30 shadow-lg text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3 w-3 transition-transform duration-300 ${isPromptPanelExpanded ? "rotate-360" : ""
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isPromptPanelExpanded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
            />
          </svg>
        </button>

        {/* Animated collapsible panel */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isPromptPanelExpanded ? "auto" : 0,
            opacity: isPromptPanelExpanded ? 1 : 0,
            marginBottom: isPromptPanelExpanded ? 16 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-5">
            {/* Prompt category selector tabs */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex p-0.5 rounded-lg bg-neutral-800/30 backdrop-blur-sm border border-indigo-500/20">
                <button
                  onClick={() => setActivePromptCategory("all")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activePromptCategory === "all"
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActivePromptCategory("theme")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activePromptCategory === "theme"
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                    }`}
                >
                  Themes
                </button>
                <button
                  onClick={() => setActivePromptCategory("info")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activePromptCategory === "info"
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                    }`}
                >
                  Info
                </button>
                <button
                  onClick={() => setActivePromptCategory("contact")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activePromptCategory === "contact"
                    ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white"
                    : "text-neutral-400 hover:text-neutral-300"
                    }`}
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Prompt suggestions */}
            <div className="relative">
              {/* Left scroll button */}
              <button
                onClick={() => scrollPrompts("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-neutral-900/80 border border-indigo-500/20 rounded-full shadow-lg text-neutral-300 hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Predefined prompts scroll container */}
              <div
                ref={promptScrollRef}
                className="flex overflow-x-auto py-2 scrollbar-hide mask-fade-edges"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                }}
              >
                {filteredPrompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptSelect(item.prefix, item.prompt)}
                    className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 mr-2 rounded-full text-sm border backdrop-blur-sm transition-colors ${item.category === "theme"
                      ? "bg-indigo-900/30 text-indigo-200 border-indigo-500/30 hover:bg-indigo-800/30"
                      : item.category === "info"
                        ? "bg-cyan-900/30 text-cyan-200 border-cyan-500/30 hover:bg-cyan-800/30"
                        : "bg-blue-900/30 text-blue-200 border-blue-500/30 hover:bg-blue-800/30"
                      }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    <span>{item.prompt}</span>
                  </button>
                ))}
              </div>

              {/* Right scroll button */}
              <button
                onClick={() => scrollPrompts("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-neutral-900/80 border border-indigo-500/20 rounded-full shadow-lg text-neutral-300 hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Gradient masks for fade effect */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/70 to-transparent pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/70 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative w-full">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isThemeRequest(input)
                ? "Describe your UI changes..."
                : "Type your message or click Suggestions above"
            }
            className="flex-1 w-full bg-neutral-800/50 text-sm text-white placeholder-neutral-400 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-indigo-500/20 resize-none backdrop-blur-sm"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`relative px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center overflow-hidden ${isLoading || !input.trim()
            ? "bg-neutral-800/50 text-neutral-400 cursor-not-allowed border border-neutral-700/50"
            : "bg-[#2a2a2a] border border-indigo-500/30 text-white hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {!(isLoading || !input.trim()) && (
            <div className="absolute inset-0">
              <div
                className={`absolute inset-0 ${isThemeRequest(input)
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
                  : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500"
                  } opacity-20`}
              />
            </div>
          )}

          <div className="relative z-10">
            {isLoading ? (
              <CgSpinner className="animate-spin h-5 w-5" />
            ) : isThemeRequest(input) ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            ) : (
              <IoSend className="w-5 h-5" />
            )}
          </div>
        </button>
      </form>

      {/* Theme and Search pill buttons */}
      <div className="flex mt-2 space-x-2">
        <button
          type="button"
          onClick={() => {
            // Clear any existing keywords first
            let newInput = input.replace(/^(theme:|search:)\s*/i, "").trim();

            // Only add Theme: if it's not already the active mode
            if (!isThemeRequest(input)) {
              newInput = `Theme: ${newInput}`;
            }

            setInput(newInput);

            // Focus the input field after inserting
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                // Position cursor at the end
                const length = inputRef.current.value.length;
                inputRef.current.setSelectionRange(length, length);
              }
            }, 50);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm border ${isThemeRequest(input)
            ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-500/50"
            : "bg-neutral-800 text-indigo-400 border-indigo-500/20 hover:bg-neutral-700"
            } transition-all duration-200`}
        >
          <span>🎨</span>
          <span>Theme:</span>
        </button>

        <button
          type="button"
          onClick={() => {
            // Clear any existing keywords first
            let newInput = input.replace(/^(theme:|search:)\s*/i, "").trim();

            // Only add Search: if it's not already the active mode
            if (!input.trim().toLowerCase().startsWith("search:")) {
              newInput = `Search: ${newInput}`;
            }

            setInput(newInput);

            // Focus the input field after inserting
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                // Position cursor at the end
                const length = inputRef.current.value.length;
                inputRef.current.setSelectionRange(length, length);
              }
            }, 50);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm border ${input.trim().toLowerCase().startsWith("search:")
            ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-500/50"
            : "bg-neutral-800 text-cyan-400 border-cyan-500/20 hover:bg-neutral-700"
            } transition-all duration-200`}
        >
          <span>🔍</span>
          <span>Search:</span>
        </button>
      </div>

      {/* Processing indicator */}
      {isThemeMode && isLoading && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-neutral-900/90 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center shadow-lg border border-indigo-500/30">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 opacity-20 animate-gradient-xy" />
          </div>
          <svg
            className="animate-spin -ml-1 mr-2 h-3 w-3 text-cyan-400 relative z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <motion.span
            key={showSecondaryLoadingMessage ? "secondary" : "primary"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {showSecondaryLoadingMessage
              ? "It may take some time..."
              : "Applying UI changes..."}
          </motion.span>
        </div>
      )}
    </div>
  );
};

/**
 * Function to render structured content
 */
export const renderStructuredContent = (content: StructuredContent) => {
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
