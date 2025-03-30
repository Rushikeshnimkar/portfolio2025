import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  XCircle,
  Send,
  User,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import localforage from "localforage";

interface EmailMessage {
  id: string;
  content: string;
  subject: string;
  senderName?: string;
  senderEmail?: string;
  timestamp: number;
  mode: "ai" | "manual";
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  newEmail?: EmailMessage;
  onMessageCountChange: (count: number) => void;
}

export function ChatHistory({
  isOpen,
  onClose,
  newEmail,
  onMessageCountChange,
}: ChatHistoryProps) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await localforage.getItem<EmailMessage[]>("sentEmails");
        if (stored) {
          setMessages(stored);
          onMessageCountChange(stored.length);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();
  }, [onMessageCountChange]);

  useEffect(() => {
    if (newEmail) {
      const updateMessages = async () => {
        try {
          const currentMessages =
            (await localforage.getItem<EmailMessage[]>("sentEmails")) || [];

          if (!currentMessages.some((msg) => msg.id === newEmail.id)) {
            const updatedMessages = [newEmail, ...currentMessages];
            await localforage.setItem("sentEmails", updatedMessages);
            setMessages(updatedMessages);
            onMessageCountChange(updatedMessages.length);
          }
        } catch (error) {
          console.error("Error updating messages:", error);
        }
      };
      updateMessages();
    }
  }, [newEmail, onMessageCountChange]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Extract subject from AI-generated content if not provided
  const getSubject = (message: EmailMessage) => {
    if (message.subject && message.subject !== "No Subject")
      return message.subject;

    // Try to extract subject from AI-generated content
    if (message.mode === "ai" && message.content) {
      const lines = message.content.split("\n");
      const subjectLine = lines.find(
        (line) =>
          line.toLowerCase().includes("subject:") ||
          line.toLowerCase().includes("re:") ||
          line.toLowerCase().includes("fw:")
      );

      if (subjectLine) {
        return subjectLine.replace(/^(subject|re|fw):\s*/i, "").trim();
      }
    }

    return "No Subject";
  };

  // Format content for display
  const formatContent = (content: string) => {
    // Remove common email formatting lines for cleaner display
    return content
      .split("\n")
      .filter(
        (line) =>
          !line.toLowerCase().startsWith("subject:") &&
          !line.toLowerCase().startsWith("dear") &&
          !line.toLowerCase().startsWith("hello") &&
          !line.toLowerCase().startsWith("hi") &&
          !line.toLowerCase().includes("best regards") &&
          !line.toLowerCase().includes("sincerely") &&
          line.trim() !== ""
      )
      .join("\n");
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: isOpen ? "min(400px, 100%)" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="fixed md:absolute right-0 top-[60px] md:top-1/2 h-[calc(100vh-60px)] md:h-[600px] md:-translate-y-1/2 bg-neutral-900/95 backdrop-blur-lg border-l border-neutral-800/50 overflow-hidden z-50 md:rounded-xl"
    >
      <div className="h-full flex flex-col">
        <div className="sticky top-0 p-3 border-b border-neutral-800/50 flex justify-between items-center bg-neutral-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                Mail History
              </h3>
              <p className="text-[10px] text-neutral-400">
                {messages.length} mails
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-2"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-120px)] md:max-h-[calc(600px-60px)]">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="group relative bg-neutral-800/30 hover:bg-neutral-800/50 rounded-lg p-3 space-y-2 border border-neutral-700/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg ${
                        message.mode === "ai"
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      }`}
                    >
                      {message.mode === "ai" ? (
                        <Send className="w-3 h-3 text-white" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">
                        {getSubject(message)}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-700/30 border border-neutral-700/50 text-neutral-300">
                          {message.mode === "ai" ? "AI" : "Manual"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {message.senderEmail && (
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 pl-8">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">
                      {message.senderName} ({message.senderEmail})
                    </span>
                  </div>
                )}

                <div className="pl-8">
                  <div
                    className={`text-xs text-neutral-300 bg-neutral-900/50 rounded-lg p-2.5 border border-neutral-800/50 transition-all duration-300
                      ${
                        expandedMessage === message.id
                          ? "max-h-none"
                          : "max-h-20 overflow-hidden relative"
                      }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {formatContent(message.content)}
                    </div>
                    {expandedMessage !== message.id && (
                      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-neutral-900/50 to-transparent" />
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setExpandedMessage(
                        expandedMessage === message.id ? null : message.id
                      )
                    }
                    className="text-[10px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1 mt-1"
                  >
                    {expandedMessage === message.id ? "Show less" : "Show more"}
                    <ChevronDown
                      className={`w-2.5 h-2.5 transition-transform ${
                        expandedMessage === message.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
