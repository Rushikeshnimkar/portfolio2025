import { useState, useCallback, useEffect, useRef } from "react";
import { Message, StructuredContent, ThemeChange } from "./types";

/**
 * Hook for handling theme changes
 */
export const useThemeHandler = () => {
  const [isThemeMode, setIsThemeMode] = useState(false);
  const [themeChangeHistory, setThemeChangeHistory] = useState<string[]>([]);

  // Function to apply theme changes to DOM
  const applyThemeChanges = useCallback((changes: ThemeChange[]) => {
    if (!changes || !Array.isArray(changes)) return;

    changes.forEach((change) => {
      try {
        switch (change.type) {
          case "style":
            // Apply CSS style changes
            document.querySelectorAll(change.selector).forEach((el) => {
              (el as HTMLElement).style.setProperty(
                change.property!,
                change.value!
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
              el.setAttribute(change.attribute!, change.value!);
            });
            break;

          case "class":
            // Add or remove classes
            document.querySelectorAll(change.selector).forEach((el) => {
              if (change.action === "add") {
                el.classList.add(change.class!);
              } else if (change.action === "remove") {
                el.classList.remove(change.class!);
              }
            });
            break;

          case "move":
            // Move elements to new locations in the DOM
            const elToMove = document.querySelector(change.selector);
            const destination = document.querySelector(change.destination!);
            if (elToMove && destination) {
              destination.insertAdjacentElement(
                change.position as InsertPosition,
                elToMove
              );
            }
            break;

          case "reorder":
            // Reorder children within a parent
            const parent = document.querySelector(change.parent!);
            if (parent && Array.isArray(change.order)) {
              const orderedElements: Element[] = [];
              change.order.forEach((selector) => {
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
                  change.property!,
                  change.value!
                );
              });
            }
        }
      } catch (error) {
        console.error(`Error applying change:`, change, error);
      }
    });
  }, []);

  // Load saved theme changes from localStorage
  useEffect(() => {
    const savedThemeChanges = localStorage.getItem("websiteThemeChanges");
    if (savedThemeChanges) {
      try {
        const changes = JSON.parse(savedThemeChanges);
        setThemeChangeHistory(changes);
        setTimeout(() => {
          applyThemeChanges(changes);
        }, 500); // Small delay to ensure DOM is fully loaded
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    }
  }, [applyThemeChanges]);

  // Check on mount if we have theme changes
  useEffect(() => {
    const hasChanges = localStorage.getItem("hasThemeChanges") === "true";
    if (hasChanges) {
      setThemeChangeHistory(["Previously applied theme changes are active"]);
    }
  }, []);

  // Reset all theme changes
  const resetThemeChanges = useCallback(() => {
    // Clear the localStorage flag
    localStorage.removeItem("hasThemeChanges");
    localStorage.removeItem("websiteThemeChanges");

    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, []);

  // Helper function to format changes for display
  const formatChangeForDisplay = useCallback((change: ThemeChange): string => {
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
  }, []);

  return {
    isThemeMode,
    setIsThemeMode,
    themeChangeHistory,
    setThemeChangeHistory,
    applyThemeChanges,
    resetThemeChanges,
    formatChangeForDisplay,
  };
};

/**
 * Hook for handling messages and API calls
 */
export const useMessageHandler = (
  themeHandlers: ReturnType<typeof useThemeHandler>
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Destructure only what we need from themeHandlers to avoid unused variables
  const { setIsThemeMode, setThemeChangeHistory } = themeHandlers;

  // Function to determine if a message is a theme request
  const isThemeRequest = useCallback((message: string) => {
    return message.toLowerCase().trim().startsWith("theme:");
  }, []);

  // Extract code from markdown
  const extractCodeFromMarkdown = useCallback((markdown: string) => {
    const codeRegex = /```(?:js|javascript)([\s\S]*?)```/;
    const match = markdown.match(codeRegex);
    return match ? match[1].trim() : null;
  }, []);

  // Safely execute the theme code
  const executeThemeCode = useCallback(async (code: string) => {
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
  }, []);

  // Process theme request
  const processThemeRequest = useCallback(
    async (userMessage: string) => {
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

          // Remove any potential JSON blocks from the displayed message
          const cleanContent =
            `**Theme Applied Successfully!**\n\nChanges made:\n${changes
              .map((change: string) => `- ${change}`)
              .join("\n")}`
              .replace(/```json[\s\S]*?```/g, "")
              .trim();

          return {
            content: cleanContent,
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
    },
    [
      extractCodeFromMarkdown,
      executeThemeCode,
      setIsLoading,
      setIsThemeMode,
      setThemeChangeHistory,
    ]
  );

  // Parse structured content from response
  const parseStructuredContent = useCallback(
    (content: string): StructuredContent | null => {
      try {
        // Check if the content contains JSON structure markers
        if (content.includes("```json") && content.includes("```")) {
          const jsonMatch = content.match(/```json([\s\S]*?)```/);
          if (jsonMatch && jsonMatch[1]) {
            const jsonData = JSON.parse(jsonMatch[1].trim());

            // Return the parsed structured content
            return jsonData;
          }
        }
        return null;
      } catch (error) {
        console.error("Failed to parse structured content:", error);
        return null;
      }
    },
    []
  );

  // Modified processMessage to handle structured content properly
  const processMessage = useCallback(
    async (userMessage: string) => {
      setIsLoading(true);

      try {
        // Regular chat processing
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

        // Remove the JSON code block from the text content
        let cleanContent = data.response;
        if (structuredContent) {
          // Remove the JSON code block from the displayed text
          cleanContent = data.response
            .replace(/```json[\s\S]*?```/g, "")
            .trim();
        }

        return {
          content: cleanContent,
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
    [messages, parseStructuredContent, setIsLoading, setIsSearching]
  );

  // Scroll to bottom after messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    isSearching,
    setIsSearching,
    error,
    setError,
    messagesEndRef,
    isThemeRequest,
    processThemeRequest,
    processMessage,
    parseStructuredContent,
  };
};

/**
 * Check if a click event is trusted
 */
export const isTrustedClick = (e: React.MouseEvent): boolean => {
  return e.isTrusted;
};

/**
 * Initialize the chat with a welcome message
 */
export const initializeChat = async (
  setMessages: (messages: Message[]) => void,
  setError: (error: string) => void
) => {
  try {
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
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    setError("Failed to initialize chat. Please try again.");
  }
};
