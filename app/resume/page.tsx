"use client";
import { motion } from "framer-motion";
import PDFViewer from "@/components/resume/pdf-viewer";
import { FiCode, FiBookOpen, FiAward, FiGlobe } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function ResumePage() {
  const [mounted, setMounted] = useState(false);
  const nameLetters = "Rushikesh Nimkar Resume ".split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen text-white overflow-hidden relative">
      {/* Background gradient - always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 z-0" />

      {/* Animated background elements - always visible */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Loading state */}
      {!mounted ? (
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="mt-8 text-center w-full max-w-sm">
            <div className="flex justify-center space-x-1 overflow-hidden h-8">
              {nameLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.02,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className={letter === " " ? "w-2" : "text-lg font-medium"}
                >
                  {letter === " " ? "" : letter}
                </motion.span>
              ))}
            </div>
            <p className="text-neutral-500 text-sm mt-2">Loading Resume...</p>

            {/* Animated dots */}
            <div className="flex justify-center mt-2 space-x-1">
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header - removed navigation buttons */}
          <header className="relative z-10 px-6 py-6 backdrop-blur-sm border-b border-white/5">
            <div className="container mx-auto">
              {/* All buttons removed from header */}
            </div>
          </header>

          {/* Main content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 sm:mb-8"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
                  Resume
                </h1>
                <p className="text-neutral-400 mt-2 max-w-2xl">
                  My qualifications, experience, and skills presented in a
                  comprehensive document.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/50 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-12">
                  {/* Sidebar */}
                  <div className="lg:col-span-3 bg-neutral-900/80 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-neutral-800/50">
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">
                        About This Resume
                      </h2>
                      <p className="text-blue-400 text-sm">Interactive guide</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <FiCode className="text-blue-400" />
                          </div>
                          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
                            Technical Focus
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-400">
                          My resume highlights expertise in full-stack
                          development with React, Node.js, and modern web
                          technologies. I specialize in building responsive,
                          accessible, and performant web applications.
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <FiBookOpen className="text-purple-400" />
                          </div>
                          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
                            Resume Tips
                          </h3>
                        </div>
                        <ul className="text-sm text-neutral-400 space-y-2 list-disc pl-5">
                          <li>
                            Check the &quot;Experience&quot; section for my
                            professional journey
                          </li>
                          <li>
                            The &quot;Skills&quot; section outlines my technical
                            capabilities
                          </li>
                          <li>
                            See &quot;Education&quot; for my academic background
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <FiAward className="text-green-400" />
                          </div>
                          <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
                            Why Hire Me
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-400">
                          I bring a combination of technical expertise,
                          problem-solving abilities, and collaborative skills to
                          every project. My passion for clean code and
                          user-centric design drives me to create exceptional
                          digital experiences.
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 sm:pt-6 border-t border-neutral-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <FiGlobe className="text-orange-400" />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
                          Connect
                        </h3>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <a
                          href="https://github.com/Rushikeshnimkar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a
                          href="https://x.com/RushikeshN22296"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Main PDF viewer */}
                  <div className="lg:col-span-9 flex-1 h-auto lg:min-h-[calc(100vh-220px)]">
                    <PDFViewer />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
