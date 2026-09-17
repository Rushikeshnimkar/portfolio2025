"use client";
import { motion } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
import { Reveal } from "@/components/ui/Reveal";

export default function About() {
  const words = [
    "play video games",
    "do photography",
    "explore new places",
    "listen to music",
  ];
  return (
    <div
      id="about-page"
      className="min-h-screen w-full text-ocean-ice overflow-hidden relative"
      data-theme-target="about-page"
    >
      {/* Animated Sparkles */}
      <div
        id="about-sparkles-container"
        className="absolute inset-0 w-full h-full opacity-60"
      >
        <SparklesCore
          id="about-sparkles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={28}
          className="w-full h-full"
          particleColor="#d4a656"
          data-theme-target="about-sparkles"
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <main
          id="about-content"
          className="container mx-auto px-4 min-h-screen flex items-center justify-center py-20"
        >
          <div id="about-container" className="max-w-4xl w-full">
            <motion.div
              id="about-title-container"
              className="text-center mb-10"
            >
              <Reveal>
                <span className="chip mb-4">About Me</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  id="about-title"
                  className="text-4xl md:text-6xl font-bold font-display text-gradient-ocean text-glow"
                  data-theme-target="about-title"
                >
                  Curiosity, compiled.
                </h1>
              </Reveal>
            </motion.div>

            <Reveal delay={0.1}>
              <div
                id="about-card"
                className="space-y-8 text-center md:text-left glass p-8 md:p-10 rounded-2xl"
                data-theme-target="about-card"
              >
                <p
                  id="about-intro"
                  className="text-2xl md:text-3xl font-semibold text-ocean-ice leading-relaxed font-display"
                >
                  I&apos;m a passionate developer and a curious engineer.
                </p>

                <p
                  id="about-description-1"
                  className="text-lg md:text-xl text-ocean-mist leading-relaxed"
                >
                  I&apos;m always looking out for new things to explore. I love to
                  collaborate with like-minded people who are fueled by curiosity.
                  I play around the Golang and JavaScript ecosystems for my web dev
                  projects.
                </p>

                <p
                  id="about-description-2"
                  className="text-lg md:text-xl text-ocean-mist leading-relaxed"
                >
                  Currently I&apos;m diving into Machine Learning after watching
                  many cool projects built around image generators — and I&apos;m
                  ready to dive in.
                </p>

                <div
                  id="about-hobbies"
                  className="text-lg md:text-xl text-ocean-mist leading-relaxed"
                >
                  When I&apos;m not coding, I usually
                  <FlipWords words={words} className="text-ocean-aqua" />
                </div>
              </div>
            </Reveal>
          </div>
        </main>
      </div>
    </div>
  );
}
