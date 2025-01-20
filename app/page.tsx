"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TimelineDemo } from "@/components/common/timelinedemo";
import HeroSection from "./home/page";
import About from "./about/page";
import Skills from "./skills/page";
import Contact from "./contact/page";
import Projects from "./projects/page";
import {AIChatModal } from "../components/tools/ai-chat-modal";
import { useState } from "react";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <main>

      
      {/* Hero Section with Background */}
      <div className="min-h-screen w-full bg-black text-white overflow-x-hidden relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60" />
        </BackgroundBeamsWithCollision>
        
        <section id="home" className="relative z-10">
          <HeroSection />
        </section>
      </div>
      
      {/* Main Sections */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>
      
      <section id="experience" className="scroll-mt-20">
        <TimelineDemo />
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
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 transform z-50 
          ${isChatOpen 
            ? 'bg-neutral-900 border border-neutral-800 hover:bg-neutral-800' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-[0_0_15px_rgba(88,28,235,0.5)] hover:scale-110'
          }
          group flex items-center justify-center`}
      >
        <div className="relative">
          <span className="text-xl animate-pulse">✨</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        </div>
      </button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}
