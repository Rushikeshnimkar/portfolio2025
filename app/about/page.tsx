"use client";
import { motion } from "framer-motion";
import { FlipWords } from "@/components/ui/flip-words";
import { SparklesCore } from "@/components/ui/sparkles";
export default function About() {
  const words = [
    "play video games",
    "do photography",
    "explore new places",
    "listen to music",
  ];
  return (
    <div className="h-screen w-full text-white overflow-hidden relative">
      {/* Pure Black Background */}
      <div className="absolute inset-0 " />

      {/* Animated Sparkles */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 " />

      <div className="relative z-10 h-full">
        <main className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
                About Me
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 text-center md:text-left backdrop-blur-sm bg-neutral-900/20 p-8 rounded-2xl border border-neutral-800"
            >
              <p className="text-2xl md:text-3xl font-semibold text-neutral-200 leading-relaxed">
                I&apos;m a passionate developer and a curious Engineer.
              </p>

              <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
                I&apos;m always looking out for new things to explore. I love to
                collaborate with like-minded people who are fueled by curiosity.
                I play around Golang and Javascript ecosystems for my web dev
                projects.
              </p>

              <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
                Currently I&apos;m diving into Machine Learning after watching
                many cool projects built around image generators and i&apos;m
                ready to dive into it
              </p>

              <div className="text-lg md:text-xl text-neutral-300 leading-relaxed">
                When i&apos;m not coding, i usually
                <FlipWords words={words} className="text-white" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-6"
              ></motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
