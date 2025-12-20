"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

import {
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
  ContactCard,
  LinkCard,
} from "./ai-chat-cards";
import {
  MessageDisplay,
} from "./ai-chat/chat-components";
import { AIChatModalProps } from "./ai-chat/types";

interface StructuredContent {
  type: "skills" | "projects" | "experience" | "contact" | "links" | "general";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function AIChatModal({
  isOpen,
  onClose,
  messages,
  isSearching,
  error
}: AIChatModalProps) {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle scroll on mount/open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderStructuredContent = (content: StructuredContent) => {
    switch (content.type) {
      case "skills": return <SkillsCard skills={content.data} />;
      case "projects": return <ProjectsCard projects={content.data} />;
      case "experience": return <ExperienceCard experiences={content.data} />;
      case "contact": return <ContactCard contact={content.data} />;
      case "links": return <LinkCard links={content.data} />;
      default: return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {/* Full-page translucent glass chat UI */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Dimmed Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Chat Content Container - Floating Popup (Responsive) */}
            <motion.div
              className="relative flex flex-col pointer-events-auto border border-white/10 shadow-2xl overflow-hidden
                         fixed inset-x-0 bottom-0 h-[85dvh] rounded-t-[2rem] m-0 w-full z-10 isolate
                         md:relative md:inset-0 md:h-[85vh] md:w-full md:max-w-6xl md:m-8 md:rounded-[2rem]"
              initial={{ scale: 0.95, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 100 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "rgba(10, 10, 15, 0.9)", // Darker background for legibility
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            >
              {/* No visible close button on mobile (User preference) */}

              {/* No Spacer needed as header is relative flex item */}

              {/* Messages Area */}
              <motion.div
                className="flex-1 overflow-y-auto flex flex-col relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <MessageDisplay
                  messages={messages}
                  isSearching={isSearching}
                  error={error}
                  renderStructuredContent={renderStructuredContent}
                  messagesEndRef={messagesEndRef}
                />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatModal;
