"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Head from "next/head";

const glitchAnimation = {
  textShadow: [
    "0 0 0 #00ffff",
    "2px 2px 0 #ff00ff, -2px -2px 0 #00ffff, 2px 2px 0 #ff00ff",
    "0 0 0 #00ffff",
  ],
  opacity: [1, 0.8, 1],
  x: [0, -1, 1, 0],
};

// Define image metadata for SEO
const imageMetadata = {
  profile1: {
    url: "/rushikesh_nimkar.jpg",
    alt: "Rushikesh Nimkar - Full Stack Developer Primary Profile",
    width: 800,
    height: 800,
  },
  profile2: {
    url: "/profile.jpg",
    alt: "Rushikesh Nimkar - Full Stack Developer Alternate Profile",
    width: 800,
    height: 800,
  },
};

export default function HomePage() {
  const [activeImage, setActiveImage] = useState(1); // 1 or 2
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Image transition every 5 seconds
    const imageInterval = setInterval(() => {
      // Start transition
      setIsTransitioning(true);

      // After transition duration, switch the active image
      setTimeout(() => {
        setActiveImage((prev) => (prev === 1 ? 2 : 1));
        setIsTransitioning(false);
      }, 1800); // Transition takes 1.8 seconds (slightly longer for smoother effect)
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(imageInterval);
  }, []);

  return (
    <>
      {/* Add structured data for images to be indexed by Google */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rushikesh Nimkar",
              url: "https://rushikeshnimkar.com",
              image: [
                `https://rushikeshnimkar.com${imageMetadata.profile1.url}`,
                `https://rushikeshnimkar.com${imageMetadata.profile2.url}`,
              ],
              jobTitle: "Full Stack Developer",
              description:
                "Full Stack Developer specializing in Next.js, TypeScript, and Blockchain development.",
            }),
          }}
        />
      </Head>

      <main
        id="home"
        className="container mx-auto px-4 min-h-screen flex items-center justify-center pt-16 md:pt-0"
      >
        <div
          id="home-content-wrapper"
          className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl w-full py-8 md:py-0"
        >
          {/* Profile Image Section - Modern Asymmetric Design */}
          <div
            id="home-profile-section"
            className="flex-1 flex justify-center relative order-1 md:order-2"
          >
            <motion.div
              id="home-profile-image-container"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80"
            >
              {/* Background subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 filter blur-[60px] -z-10" />

              {/* Frame with asymmetric accents */}
              <div className="absolute inset-0">
                {/* Main frame - square with one rounded corner */}
                <div className="absolute inset-0 border-2 border-indigo-500/40 rounded-br-3xl" />

                {/* Floating accent lines */}
                <motion.div
                  className="absolute -top-3 -right-3 w-24 h-1 bg-gradient-to-r from-indigo-600 to-cyan-500"
                  animate={{
                    x: [0, 5, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute -bottom-3 -left-3 w-24 h-1 bg-gradient-to-r from-cyan-500 to-indigo-600"
                  animate={{
                    x: [0, -5, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                />
                <motion.div
                  className="absolute -left-3 -top-3 h-24 w-1 bg-gradient-to-b from-indigo-600 to-cyan-500"
                  animate={{
                    y: [0, 5, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />
              </div>

              {/* Inner image container with diagonal cutout */}
              <div
                className="absolute inset-4 overflow-hidden bg-neutral-900/50 backdrop-blur-sm"
                style={{ perspective: "1200px" }}
              >
                {/* Diagonal cutout */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 bg-black/0 z-10"
                  style={{
                    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                  }}
                />

                {/* New image transition container */}
                <div
                  className="relative w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1200px",
                  }}
                >
                  {/* First image */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    animate={
                      isTransitioning && activeImage === 2
                        ? {
                            x: "-50%",
                            rotateY: 45,
                            scale: 0.85,
                            zIndex: 0,
                            opacity: 0.8,
                            filter: "blur(2px)",
                            z: -100,
                          }
                        : {
                            x: activeImage === 1 ? "0%" : "100%",
                            rotateY: 0,
                            scale: 1,
                            zIndex: activeImage === 1 ? 1 : 0,
                            opacity: activeImage === 1 ? 1 : 0,
                            filter: "blur(0px)",
                            z: 0,
                          }
                    }
                    transition={{
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      zIndex: activeImage === 1 ? 1 : 0,
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      boxShadow:
                        isTransitioning && activeImage === 2
                          ? "12px 12px 20px rgba(0,0,0,0.4)"
                          : "none",
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Image
                        src={imageMetadata.profile1.url}
                        alt={imageMetadata.profile1.alt}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      {/* Dynamic lighting effect */}
                      {isTransitioning && activeImage === 2 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Second image */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    animate={
                      isTransitioning && activeImage === 1
                        ? {
                            x: "50%",
                            rotateY: -45,
                            scale: 0.85,
                            zIndex: 0,
                            opacity: 0.8,
                            filter: "blur(2px)",
                            z: -100,
                          }
                        : {
                            x: activeImage === 2 ? "0%" : "-100%",
                            rotateY: 0,
                            scale: 1,
                            zIndex: activeImage === 2 ? 1 : 0,
                            opacity: activeImage === 2 ? 1 : 0,
                            filter: "blur(0px)",
                            z: 0,
                          }
                    }
                    transition={{
                      duration: 1.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      zIndex: activeImage === 2 ? 1 : 0,
                      transformOrigin: "right center",
                      transformStyle: "preserve-3d",
                      boxShadow:
                        isTransitioning && activeImage === 1
                          ? "12px 12px 20px rgba(0,0,0,0.4)"
                          : "none",
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Image
                        src={imageMetadata.profile2.url}
                        alt={imageMetadata.profile2.alt}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      {/* Dynamic lighting effect */}
                      {isTransitioning && activeImage === 1 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* 3D container effect - perspective container */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1200px",
                    }}
                  >
                    {/* Floating 3D elements for enhanced depth */}
                    {isTransitioning && (
                      <>
                        <motion.div
                          className="absolute w-full h-full border-2 border-cyan-500/30 rounded-sm z-20"
                          initial={{ z: 0, opacity: 0 }}
                          animate={{
                            z: activeImage === 1 ? [-20, 20] : [20, -20],
                            opacity: [0, 0.6, 0],
                          }}
                          transition={{ duration: 1.8, times: [0, 0.5, 1] }}
                          style={{ transformStyle: "preserve-3d" }}
                        />
                        <motion.div
                          className="absolute w-full h-full border border-indigo-500/20 rounded-sm z-10"
                          initial={{ z: 0, opacity: 0 }}
                          animate={{
                            z: activeImage === 1 ? [30, -10] : [-10, 30],
                            opacity: [0, 0.4, 0],
                          }}
                          transition={{ duration: 1.8, times: [0, 0.5, 1] }}
                          style={{ transformStyle: "preserve-3d" }}
                        />
                      </>
                    )}
                  </motion.div>

                  {/* Enhanced transition effect overlay */}
                  {isTransitioning && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/20 to-cyan-500/20 mix-blend-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1.8, times: [0, 0.5, 1] }}
                      style={{ filter: "blur(8px)" }}
                    />
                  )}

                  {/* Always present overlay for consistent styling */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70" />
                </div>
              </div>

              {/* Animated edge highlight */}
              <motion.div
                className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-70"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent 60%, rgba(99, 102, 241, 0.3) 100%)",
                    "linear-gradient(45deg, transparent 60%, rgba(34, 211, 238, 0.3) 100%)",
                    "linear-gradient(45deg, transparent 60%, rgba(99, 102, 241, 0.3) 100%)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Animated particles in corner */}
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <motion.div
                    className="absolute w-1 h-1 rounded-full bg-cyan-500"
                    animate={{
                      y: [0, 8, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 rounded-full bg-indigo-500 ml-5"
                    animate={{
                      y: [0, 5, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 rounded-full bg-purple-500 ml-2 mt-2"
                    animate={{
                      y: [0, 6, 0],
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1,
                    }}
                  />
                </div>
              </div>

              {/* Digital element accent */}
              <div className="absolute -bottom-2 -right-2">
                <motion.div
                  className="text-xs font-mono bg-neutral-900/70 text-cyan-400 px-2 py-1 rounded border border-indigo-500/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                    <span>DEV_2025</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bitcoin Symbol */}
            <motion.div
              id="home-bitcoin-symbol"
              className="absolute -bottom-6 right-0 sm:-bottom-10 md:-bottom-12 scale-50 sm:scale-90 md:scale-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              <TextHoverEffect text="₿" />
            </motion.div>
          </div>

          {/* Text Content Section */}
          <motion.div
            id="home-text-content"
            className="flex-1 text-center md:text-left space-y-4 md:space-y-8 order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              id="home-title"
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
              id="home-subtitle"
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Full Stack Developer | Tech Enthusiast
            </motion.p>

            <motion.p
              id="home-description"
              className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              I turn coffee into code and bugs into features. Full-stack
              developer who enjoys building digital puzzles and occasionally
              solving them. Currently exploring blockchain, because why not add
              more blocks to my stacks
            </motion.p>

            <motion.div
              id="home-action-buttons"
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div
                id="home-main-buttons"
                className="flex flex-row gap-4 items-center"
              >
                {/* CV Button */}
                <div
                  id="home-cv-button-wrapper"
                  className="relative w-[140px] overflow-hidden rounded-md"
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                  </div>
                  <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                  <button
                    onClick={() => (window.location.href = "/resume")}
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
                  </button>
                </div>

                {/* Sponsor Button */}
                <div
                  id="home-sponsor-button-wrapper"
                  className="relative w-[140px] overflow-hidden rounded-md"
                >
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-xy" />
                  </div>
                  <div className="absolute inset-[2px] bg-[#2a2a2a] rounded-[4px]" />
                  <button
                    onClick={() =>
                      window.open(
                        "https://github.com/sponsors/Rushikeshnimkar",
                        "_blank"
                      )
                    }
                    className="relative z-10 w-full px-6 py-[6px] flex items-center justify-center gap-2 text-sm md:text-base"
                  >
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
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <motion.div
                id="home-social-links"
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
    </>
  );
}
