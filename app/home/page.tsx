"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const glitchAnimation = {
  textShadow: [
    "0 0 0 #00ffff",
    "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff, 2px 2px 0 #ff00ff",
    "0 0 0 #00ffff",
  ],
  opacity: [1, 0.8, 1],
  x: [0, -1, 1, 0],
};

export default function HomePage() {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 100);
    }, 15000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <main
      id="home"
      className="container mx-auto px-4 min-h-screen flex items-center justify-center pt-16 md:pt-0"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl w-full py-8 md:py-0">
        {/* Profile Image Section - Moved to top for mobile */}
        <div className="flex-1 flex justify-center relative order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-[40px]" />
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-dashed"
              />
              <motion.div
                className="absolute inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full overflow-hidden border-2 border-blue-500/30"
                animate={{
                  x: isGlitching ? [-2, 2, -2, 0] : 0,
                  y: isGlitching ? [1, -1, 1, 0] : 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/rushikesh_nimkar.jpg"
                    alt="Profile"
                    fill
                    className={`object-cover rounded-full p-2 transition-opacity duration-100 ${
                      isGlitching ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                  />
                  <Image
                    src="/profile2.png"
                    alt="Profile Glitch"
                    fill
                    className={`object-cover rounded-full p-2 transition-opacity duration-100 ${
                      isGlitching ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                  />
                </div>
                {isGlitching && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500/30"
                    animate={{
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 0.1,
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Bitcoin Symbol */}
          <motion.div
            className="absolute -bottom-6 right-0 sm:-bottom-10 md:-bottom-12 scale-50 sm:scale-90 md:scale-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <TextHoverEffect text="₿" />
          </motion.div>
        </div>

        {/* Text Content - Moved to bottom for mobile */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 text-center md:text-left space-y-4 md:space-y-8 order-2 md:order-1"
        >
          <motion.h1
            className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hi, I&apos;m <br className="hidden sm:block" />
            <motion.span
              className="text-blue-500 inline-block"
              animate={glitchAnimation}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay: 5,
              }}
            >
              Rushikesh Nimkar
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Full Stack Developer | Tech Enthusiast
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            I turn coffee into code and bugs into features. Full-stack developer
            who enjoys building digital puzzles and occasionally solving them.
            Currently exploring blockchain, because why not add more blocks to
            my stack?
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="/resume"
                className="w-full sm:w-auto px-6 py-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>View CV</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-6 py-3 border border-blue-500 rounded-full hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>Contact Me</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <motion.div
              className="flex gap-4 items-center mt-4 sm:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="https://github.com/Rushikeshnimkar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://x.com/RushikeshN22296"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaXTwitter size={20} />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
