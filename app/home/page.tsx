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
    }, 15000); // Changed the interval to 1000ms

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
            <div className="relative w-40 sm:w-56 md:w-64 lg:w-72">
              <Image
                src="/rushikesh.png"
                alt="Profile"
                width={400}
                height={400}
                className="w-full h-auto rounded-lg shadow-xl"
                priority
              />
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
            <div className="flex flex-row gap-4 items-center">
              <div className="relative w-[140px] overflow-hidden rounded-md">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                </div>
                <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                <a
                  href="/resume"
                  className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <span className="text-white">View CV</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
              </div>

              <a
                href="https://github.com/sponsors/Rushikeshnimkar"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-[140px] overflow-hidden rounded-md"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                </div>
                <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                <div className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base">
                  <span className="text-white">Sponsor</span>
                  <svg
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    className="text-red-500"
                    fill="currentColor"
                  >
                    <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
                  </svg>
                </div>
              </a>
            </div>

            <motion.div
              className="flex gap-6 items-center mt-4 sm:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="https://github.com/Rushikeshnimkar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:rotate-12"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:-rotate-12"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://x.com/RushikeshN22296"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-125 hover:rotate-12"
              >
                <FaXTwitter size={24} />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
