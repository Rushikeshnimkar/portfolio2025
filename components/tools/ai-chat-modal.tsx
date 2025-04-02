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

  // Add new state for theme mode
  const [isThemeMode, setIsThemeMode] = useState(false);
  const [themeChangeHistory, setThemeChangeHistory] = useState<string[]>([]);

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

  // Function to load saved theme changes
  useEffect(() => {
    // Load any saved theme changes from localStorage
    const savedThemeChanges = localStorage.getItem("websiteThemeChanges");
    if (savedThemeChanges) {
      try {
        const changes = JSON.parse(savedThemeChanges);
        setThemeChangeHistory(changes);
        // Apply the saved changes
        setTimeout(() => {
          applyThemeChanges(changes);
        }, 500); // Small delay to ensure DOM is fully loaded
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    }
  }, []);

  // Enhanced function to apply theme changes to DOM
  const applyThemeChanges = useCallback((changes: any[]) => {
    if (!changes || !Array.isArray(changes)) return;

    changes.forEach((change) => {
      try {
        switch (change.type) {
          case "style":
            // Apply CSS style changes
            document.querySelectorAll(change.selector).forEach((el) => {
              (el as HTMLElement).style.setProperty(
                change.property,
                change.value
              );
            });
            break;

          case "visibility":
            // Show/hide elements
            document.querySelectorAll(change.selector).forEach((el) => {
              if (change.action === "hide") {
                (el as HTMLElement).style.setProperty("display", "none");
              } else if (change.action === "show") {
                (el as HTMLElement).style.removeProperty("display");
              }
            });
            break;

          case "attribute":
            // Set element attributes
            document.querySelectorAll(change.selector).forEach((el) => {
              el.setAttribute(change.attribute, change.value);
            });
            break;

          case "class":
            // Add or remove classes
            document.querySelectorAll(change.selector).forEach((el) => {
              if (change.action === "add") {
                el.classList.add(change.class);
              } else if (change.action === "remove") {
                el.classList.remove(change.class);
              }
            });
            break;

          case "move":
            // Move elements to new locations in the DOM
            const elToMove = document.querySelector(change.selector);
            const destination = document.querySelector(change.destination);
            if (elToMove && destination) {
              destination.insertAdjacentElement(
                change.position as InsertPosition,
                elToMove
              );
            }
            break;

          case "reorder":
            // Reorder children within a parent
            const parent = document.querySelector(change.parent);
            if (parent && Array.isArray(change.order)) {
              const orderedElements: Element[] = [];
              change.order.forEach((selector: any) => {
                const child = parent.querySelector(selector);
                if (child) {
                  orderedElements.push(child);
                  parent.removeChild(child);
                }
              });
              orderedElements.forEach((el) => {
                parent.appendChild(el);
              });
            }
            break;

          default:
            // For backward compatibility, assume style change if no type specified
            if (change.selector && change.property && change.value) {
              document.querySelectorAll(change.selector).forEach((el) => {
                (el as HTMLElement).style.setProperty(
                  change.property,
                  change.value
                );
              });
            }
        }
      } catch (error) {
        console.error(`Error applying change:`, change, error);
      }
    });
  }, []);

  // Helper function to format changes for display
  const formatChangeForDisplay = (change: any) => {
    switch (change.type) {
      case "style":
        return `Changed \`${change.property}\` to \`${change.value}\` for \`${change.selector}\``;
      case "visibility":
        return `${change.action === "hide" ? "Hidden" : "Showed"} \`${
          change.selector
        }\``;
      case "attribute":
        return `Set attribute \`${change.attribute}=${change.value}\` on \`${change.selector}\``;
      case "class":
        return `${change.action === "add" ? "Added" : "Removed"} class \`${
          change.class
        }\` ${change.action === "add" ? "to" : "from"} \`${change.selector}\``;
      case "move":
        return `Moved \`${change.selector}\` to ${change.position} of \`${change.destination}\``;
      case "reorder":
        return `Reordered children within \`${change.parent}\``;
      default:
        return `Applied change to \`${change.selector}\``;
    }
  };

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

  // Function to determine if a message is a theme request
  const isThemeRequest = (message: string) => {
    return message.toLowerCase().trim().startsWith("theme:");
  };

  // Process theme request
  const processThemeRequest = async (userMessage: string) => {
    setIsLoading(true);
    setIsThemeMode(true);

    try {
      // Call the theme API
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get theme response");
      }

      const data = await response.json();

      // Extract JavaScript code from the response
      const jsCode = extractCodeFromMarkdown(data.response);

      if (!jsCode) {
        throw new Error("No valid JavaScript code found in the response");
      }

      // Execute the code and get the changes
      const changes = await executeThemeCode(jsCode);

      // Save changes to history
      if (changes && changes.length > 0) {
        setThemeChangeHistory((prev) => [...prev, ...changes]);

        // Save to localStorage that theme changes have been applied
        localStorage.setItem("hasThemeChanges", "true");

        return {
          content: `**Theme Applied Successfully!**\n\nChanges made:\n${changes
            .map((c: any) => `- ${c}`)
            .join("\n")}`,
          structuredContent: null,
        };
      } else {
        return {
          content:
            "The theme was processed, but no changes were reported. The changes might still have been applied.",
          structuredContent: null,
        };
      }
    } catch (error) {
      console.error("Theme processing error:", error);
      return {
        content: `**Error applying theme**: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        structuredContent: null,
      };
    } finally {
      setIsLoading(false);
      setIsThemeMode(false);
    }
  };

  // Extract code from markdown
  const extractCodeFromMarkdown = (markdown: string) => {
    const codeRegex = /```(?:js|javascript)([\s\S]*?)```/;
    const match = markdown.match(codeRegex);
    return match ? match[1].trim() : null;
  };

  // Safely execute the theme code
  const executeThemeCode = async (code: string) => {
    // Create a safe function to execute the code
    try {
      // Create a new function from the code
      const AsyncFunction = Object.getPrototypeOf(
        async function () {}
      ).constructor;

      // Wrap the code in an async function that returns the result
      const wrappedCode = `
        ${code}
        return await applyThemeChanges();
      `;

      // Create and execute the function
      const executor = new AsyncFunction(wrappedCode);
      return await executor();
    } catch (error) {
      console.error("Error executing theme code:", error);
      throw new Error("Failed to execute theme changes");
    }
  };

  // Reset all theme changes by reloading the page
  const resetThemeChanges = () => {
    // Clear the localStorage flag
    localStorage.removeItem("hasThemeChanges");

    // Add message about theme reset
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        content:
          "Resetting all theme changes. The page will reload momentarily...",
        timestamp: new Date(),
      },
    ]);

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Check on mount if we have theme changes
  useEffect(() => {
    const hasChanges = localStorage.getItem("hasThemeChanges") === "true";
    if (hasChanges) {
      setThemeChangeHistory(["Previously applied theme changes are active"]);
    }
  }, []);

  // Modified processMessage to handle theme commands
  const processMessage = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);

      try {
        // Check if this is a theme command
        const isThemeCommand = userMessage.toLowerCase().includes("theme:");

        if (isThemeCommand) {
          setIsThemeMode(true);

          // Call the theme API
          const response = await fetch("/api/theme", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: userMessage,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to get theme response");
          }

          const data = await response.json();

          // Parse the AI response as JSON
          let themeData;
          try {
            themeData = JSON.parse(data.response);
          } catch (error) {
            console.error("Failed to parse theme data:", error);
            return {
              content:
                "I couldn't generate valid theme changes. Please try a different theme request.",
              structuredContent: null,
            };
          }

          // Apply the theme changes
          if (
            themeData &&
            themeData.changes &&
            Array.isArray(themeData.changes)
          ) {
            applyThemeChanges(themeData.changes);

            // Save the changes to localStorage
            const currentChanges = [
              ...themeChangeHistory,
              ...themeData.changes,
            ];
            setThemeChangeHistory(currentChanges);
            localStorage.setItem(
              "websiteThemeChanges",
              JSON.stringify(currentChanges)
            );

            return {
              content:
                `**Theme Applied**: ${
                  themeData.explanation || "Theme changes applied successfully!"
                }\n\n` +
                "Changes made:\n" +
                themeData.changes
                  .map((c: any) => `- ${formatChangeForDisplay(c)}`)
                  .join("\n"),
              structuredContent: null,
            };
          }

          return {
            content:
              "I couldn't generate valid theme changes. Please try a different theme request.",
            structuredContent: null,
          };
        } else {
          // Regular chat processing (your existing code)
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: userMessage,
              messages: messages,
              structuredResponse: true,
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
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
        setIsThemeMode(false);
      }
    },
    [messages, themeChangeHistory, applyThemeChanges]
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

  // Modified handleSubmit to handle theme requests
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
                    {themeChangeHistory.length > 0 && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-900/30">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-purple-400 font-medium flex items-center">
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
                            Custom Theme Active
                          </div>
                          <button
                            onClick={resetThemeChanges}
                            className="text-xs px-2 py-0.5 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
                          >
                            Reset UI
                          </button>
                        </div>
                      </div>
                    )}

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
                              : "Type your message or 'Theme: ' to customize UI..."
                          }
                          className="flex-1 w-full bg-neutral-800/50 text-sm text-white placeholder-neutral-400 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none backdrop-blur-sm"
                          disabled={isLoading}
                        />

                        {/* Subtle hint */}
                        {!isThemeRequest(input) && !isLoading && (
                          <div className="absolute -top-5 right-2 text-[10px] text-neutral-500">
                            Try "Theme: dark mode" or "Theme: hide navbar"
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                          isLoading || !input.trim()
                            ? "bg-neutral-800/50 text-neutral-400 cursor-not-allowed"
                            : isThemeRequest(input)
                            ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:scale-105"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
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
                          <IoSend className="w-5 w-5" />
                        )}
                      </button>
                    </form>

                    {/* Processing indicator */}
                    {isThemeMode && isLoading && (
                      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-purple-600/80 text-white px-4 py-1.5 rounded-full text-xs font-medium flex items-center shadow-lg">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                        Applying UI changes...
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
