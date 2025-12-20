"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
                         fixed inset-0 m-0 rounded-none w-full h-full
                         md:relative md:w-full md:max-w-6xl md:h-[85vh] md:m-8 md:rounded-[2rem]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "rgba(10, 10, 15, 0.4)", // Darker glass
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
              }}
            >
              {/* Invisible Header Area (Spacer) - Adjusted for popup */}
              <div className="h-12 flex-shrink-0" />

              {/* Messages Area */}
              <motion.div
                className="flex-1 overflow-hidden flex flex-col relative"
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
                />

                {/* Bottom Spacer to ensure content isn't hidden behind the floating Input */}
                {/* Since Input is fixed to screen bottom, and Popup is centered h-[85vh],
                      The input sits roughly at the bottom of the popup or slightly below it.
                      We need a large spacer. */}
                <div className="h-32 flex-shrink-0" />

                <div ref={messagesEndRef} />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatModal;
