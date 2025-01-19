"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TimelineDemo } from "@/components/common/timelinedemo";
import HeroSection from "./home/page";
import About from "./about/page";
import Skills from "./skills/page";
import Contact from "./contact/page";
import Projects from "./projects/page";

export default function Home() {
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
    </main>
  );
}
