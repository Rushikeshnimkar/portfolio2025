"use client";

import ExperiencePage from "./experience/page";
import HeroPage from "./home/page";
import About from "./about/page";
import Skills from "./skills/page";
import Contact from "./contact/page";
import Projects from "./projects/page";
import { AIChatModal } from "../components/tools/ai-chat-modal";
import { useState } from "react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <main>
      <div className="min-h-screen w-full    text-white overflow-x-hidden relative">
        <div className="fixed inset-0 z-0 ">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <section id="home" className="relative z-10 b">
          <HeroPage />
        </section>
      </div>

      {/* Main Sections */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      <section id="experience" className="scroll-mt-20">
        <ExperiencePage />
      </section>

      <section id="skills" className="scroll-mt-20">
        <Skills />
      </section>

      <section id="projects" className="scroll-mt-20">
        <Projects />
      </section>

      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-xl transition-all duration-300 transform z-50 
          ${
            isChatOpen
              ? "bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 hover:bg-neutral-800/80"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(88,28,235,0.6)] hover:scale-105"
          }
          group flex items-center justify-center`}
      >
        <div className="relative">
          {isChatOpen ? (
            <svg
              className="w-5 h-5 text-neutral-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          ) : (
            <>
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>
            </>
          )}
        </div>
      </button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
