"use client";

import ExperiencePage from "./experience/page";
import HeroPage from "./home/page";
import About from "./about/page";
import Skills from "./skills/page";
import Contact from "./contact/page";
import Projects from "./projects/page";
import { AIChatModal } from "../components/tools/ai-chat-modal";
import { useState, useEffect } from "react";
import GitHub from "./github/page";
import NeuralBackground from "../components/neural-background";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Create grid pattern effect with CSS
  useEffect(() => {
    // Create a grid pattern element in the background
    const gridOverlay = document.createElement("div");
    gridOverlay.className = "absolute inset-0 z-[-1]";
    gridOverlay.style.backgroundImage =
      "linear-gradient(rgba(20, 255, 140, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 255, 140, 0.1) 1px, transparent 1px)";
    gridOverlay.style.backgroundSize = "40px 40px";
    gridOverlay.style.opacity = "0.15";

    const bgElement = document.getElementById("gradient-background");
    if (bgElement) {
      bgElement.appendChild(gridOverlay);
    }

    return () => {
      if (bgElement && bgElement.contains(gridOverlay)) {
        bgElement.removeChild(gridOverlay);
      }
    };
  }, []);

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
      ></div>

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
      <section
        id="about"
        className="scroll-mt-20"
        data-theme-target="about-section"
      >
        <About />
      </section>

      <section
        id="experience"
        className="scroll-mt-20"
        data-theme-target="experience-section"
      >
        <ExperiencePage />
      </section>

      <section
        id="skills"
        className="scroll-mt-20"
        data-theme-target="skills-section"
      >
        <Skills />
      </section>

      <section
        id="projects"
        className="scroll-mt-20"
        data-theme-target="projects-section"
      >
        <Projects />
      </section>

      <section
        id="github"
        className="scroll-mt-20"
        data-theme-target="github-section"
      >
        <GitHub />
      </section>

      <section
        id="contact"
        className="scroll-mt-20"
        data-theme-target="contact-section"
      >
        <Contact />
      </section>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-xl transition-all duration-300 transform z-50 
          ${isChatOpen
            ? "bg-neutral-900/80 backdrop-blur-sm border border-emerald-800 hover:bg-neutral-800/80"
            : "bg-gradient-to-r from-emerald-600 to-teal-800 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:scale-105"
          }
          group flex items-center justify-center`}
        data-theme-target="chat-button"
      >
        <div className="relative">
          {isChatOpen ? (
            <svg
              className="w-5 h-5 text-emerald-300"
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </>
          )}
        </div>
      </button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

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

        /* Reset some animations */
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-30px, 30px) scale(1.05);
          }
          50% {
            transform: translate(20px, -20px) scale(0.95);
          }
          75% {
            transform: translate(-20px, -20px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 15s infinite alternate;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
