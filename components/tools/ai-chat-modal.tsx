"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";

import {
  SkillsCard,
  ProjectsCard,
  ExperienceCard,
  ContactCard,
  LinkCard,
  FleetManagementCard,
} from "./ai-chat-cards";
import { MessageDisplay } from "./ai-chat/chat-components";
import { AIChatModalProps } from "./ai-chat/types";

interface StructuredContent {
  type:
    | "skills"
    | "projects"
    | "experience"
    | "contact"
    | "links"
    | "general"
    | "fleeman_project";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function AIChatModal({
  isOpen,
  onClose,
  messages,
  isSearching,
  error,
}: AIChatModalProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    window.dispatchEvent(new Event("lenis:stop"));
    document.body.style.overflow = "hidden";
    return () => {
      window.dispatchEvent(new Event("lenis:start"));
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen, isSearching]);

  const trapScroll = (e: React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

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
      case "fleeman_project":
        return <FleetManagementCard data={content.data} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-black/70 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="AI chat"
            className="relative pointer-events-auto flex flex-col overflow-hidden isolate
                       w-full h-[86dvh] rounded-t-3xl
                       md:h-[min(780px,84vh)] md:w-full md:max-w-3xl md:rounded-3xl md:mb-0 md:mx-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onWheel={trapScroll}
            onTouchMove={trapScroll}
            style={{
              background: "#0c0e14",
              border: "1px solid rgba(212,166,86,0.18)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
            }}
          >
            <header className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid place-items-center w-9 h-9 rounded-full bg-ocean-aqua/15 border border-ocean-aqua/30">
                  <RiRobot2Line className="w-4 h-4 text-ocean-aqua" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-display font-semibold text-ocean-ice leading-tight">
                    Ask Rushikesh
                  </p>
                  <p className="text-[11px] text-ocean-mist font-mono truncate">
                    Portfolio assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="grid place-items-center w-9 h-9 rounded-full border border-white/10 text-ocean-mist hover:text-ocean-ice hover:bg-white/5 transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
              onWheel={trapScroll}
              onTouchMove={trapScroll}
            >
              <MessageDisplay
                messages={messages}
                isSearching={isSearching}
                error={error}
                renderStructuredContent={renderStructuredContent}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AIChatModal;
