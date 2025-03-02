"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { useState, useEffect } from "react";
import { GitHubContributions } from "@/components/tools/githubcontribution";
import Head from "next/head";

// SEO keywords and descriptions
const SEO = {
  title: "Rushikesh Nimkar | Projects Portfolio",
  description:
    "Explore my portfolio of web development and software engineering projects. Featuring Next.js, React, TypeScript, and blockchain applications.",
  keywords:
    "portfolio, portfolio-template, web developer portfolio, software engineer, React projects, Next.js portfolio, TypeScript, blockchain projects, GitHub contributions, developer showcase, open source, frontend developer, full stack developer, responsive design, UI/UX, modern portfolio",
};

type MediaType = "image" | "youtube";

type Project = {
  id: number;
  title: string;
  description: string;
  media: {
    type: MediaType;
    src: string; // image path or YouTube video ID
  };
  tags: string[];
  link: string;
  github: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "CryptoRage",
    description:
      "Cryptorage is a Chrome extension that integrates with Sui wallet to provide secure storage and sharing of screenshots within teams. It allows users to capture, store, and share screenshots with team members, all while leveraging blockchain technology for enhanced security and transparency.",
    media: {
      type: "image",
      src: "/projects/cryptorage.png",
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://cryptorage-login.vercel.app/",
    github: "https://github.com/Rushikeshnimkar/CryptoRage",
  },
  {
    id: 2,
    title: "GitSplit",
    description:
      "A Web App for Open-Source projects to raise funding and split among its contributors. Discover and Showcase your projects on this platform.",
    media: {
      type: "image",
      src: "/projects/gitsplit.png",
    },
    tags: ["React", "Next.js", "Tailwind", "SQL", "Golang"],
    link: "",
    github: "https://github.com/GitSplit-org",
  },
  {
    id: 3,
    title: "Communepro",
    description:
      "Communepro is a modern, customizable NPM package that provides a comment section component for React applications. It offers features like nested replies, real-time updates, dark mode support, and a responsive design, making it easy to enhance your app with an intuitive and engaging commenting experience.",
    media: {
      type: "image",
      src: "/projects/communepro.png",
    },
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    link: "https://communepro.vercel.app/",
    github: "https://www.npmjs.com/package/addcomment",
  },
  {
    id: 4,
    title: "Terminal AI Assistant",
    description:
      "A powerful CLI tool that helps users interact with the Windows command line using natural language. Built with Node.js and powered by Qwen: Qwen2.5 VL 72B Instruct AI.",
    media: {
      type: "youtube",
      src: "https://youtu.be/TwaQDbr75z4",
    },
    tags: ["Node.js", "TypeScript", "Qwen AI", "Commander.js", "Chalk"],
    link: "https://www.npmjs.com/package/terminal-ai-assistant",
    github:
      "https://github.com/Rushikeshnimkar/terminal-ai-assistant-windows.git",
  },
];

// Function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
  // Handle youtu.be format
  if (url.includes("youtu.be")) {
    return url.split("/").pop() || "";
  }

  // Handle youtube.com format
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];

  // Handle youtube.com/embed format
  const embedMatch = url.match(/youtube\.com\/embed\/([^/?]+)/);
  if (embedMatch) return embedMatch[1];

  // If it's already just an ID or we can't parse it, return as is
  return url;
};

// YouTube embed component with autoplay
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  // Extract the video ID if a full URL was provided
  const id = extractYouTubeId(videoId);

  return (
    <div className="relative w-full h-full">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`}
        className="absolute inset-0 w-full h-full rounded-xl"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0);
  const [isContributionVisible, setIsContributionVisible] = useState(false);

  // Add structured data for SEO
  useEffect(() => {
    // Create JSON-LD structured data for portfolio
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: SEO.title,
      description: SEO.description,
      keywords: SEO.keywords,
      mainEntity: {
        "@type": "Person",
        name: "Rushikesh Nimkar",
        url: "https://github.com/Rushikeshnimkar",
        sameAs: [
          "https://github.com/Rushikeshnimkar",
          // Add other social profiles if available
        ],
      },
    };

    // Add structured data to the document
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Animation variants for the contribution section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      {/* Add SEO metadata */}
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
      </Head>

      <div className="min-h-screen w-full text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
            Projects
          </h1>

          {/* GitHub contributions section with block-by-block reveal animation */}
          <motion.section
            className="mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onViewportEnter={() => setIsContributionVisible(true)}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl shadow-xl overflow-hidden relative"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    GitHub Contributions
                  </h2>
                </div>

                <motion.a
                  href="https://github.com/Rushikeshnimkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg z-10 bg-neutral-800/80 hover:bg-neutral-700/80 transition-all duration-300 text-sm border border-neutral-700/50 hover:border-blue-500/30 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiGithub className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span>View GitHub Profile</span>
                </motion.a>
              </motion.div>

              {/* Contribution graph with block-by-block reveal animation */}
              <div className="relative rounded-sm overflow-x-auto">
                {isContributionVisible && (
                  <div className="relative">
                    {/* Hidden actual graph that will be revealed */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 5 }} // Show the real graph after 5 seconds
                      className="w-full"
                    >
                      <GitHubContributions username="Rushikeshnimkar" />
                    </motion.div>

                    {/* Loading animation overlay that matches GitHub's appearance */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 bottom-0 z-20 overflow-x-auto pointer-events-none"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.4, delay: 4 }} // Fade out after 5 seconds
                    >
                      {/* Grid of blocks that will be revealed one by one with GitHub colors */}
                      <div style={{ minWidth: "750px", padding: "16px" }}>
                        <div className="grid grid-cols-[repeat(53,1fr)] grid-rows-7 gap-[4px]">
                          {Array.from({ length: 371 }).map((_, index) => {
                            // Use GitHub's actual color palette
                            const colors = [
                              "rgba(22, 27, 34, 0.5)", // level0 - No contributions
                              "rgba(14, 68, 41, 0.8)", // level1 - Light contributions
                              "rgba(0, 109, 50, 0.8)", // level2 - Medium contributions
                              "rgba(38, 166, 65, 0.8)", // level3 - Heavy contributions
                              "rgba(57, 211, 83, 0.8)", // level4 - Very heavy contributions
                            ];

                            // Randomly select a color, with higher probability for level0 (empty cells)
                            const random = Math.random();
                            let colorIndex;
                            if (random < 0.6)
                              colorIndex = 0; // 60% chance of no contributions
                            else if (random < 0.8)
                              colorIndex = 1; // 20% chance of light contributions
                            else if (random < 0.9)
                              colorIndex = 2; // 10% chance of medium contributions
                            else if (random < 0.97)
                              colorIndex = 3; // 7% chance of heavy contributions
                            else colorIndex = 4; // 3% chance of very heavy contributions

                            return (
                              <motion.div
                                key={`block-${index}`}
                                className="w-full h-full rounded-sm"
                                style={{
                                  backgroundColor: colors[colorIndex],
                                  height: "14px",
                                  minHeight: "8px",
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                  duration: 0.2,
                                  delay: Math.random() * 4.5, // Random reveal within 4.5 seconds
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Loading indicator */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="px-4 py-2 bg-neutral-800/80 rounded-full flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-[rgba(38,166,65,0.8)] rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-xs text-neutral-300">
                            Loading contribution data...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.section>

          {/* Project showcase section with SEO-friendly headings and descriptions */}
          <div className="relative min-h-[600px] flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Project Navigation */}
            <div className="lg:w-1/3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-4 lg:gap-0 pb-4 lg:pb-0">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="min-w-[280px] sm:min-w-[320px] lg:min-w-0"
                >
                  <button
                    onClick={() => setActiveProject(index)}
                    className={`w-full text-left p-4 sm:p-6 transition-all duration-300 rounded-xl lg:mb-4 relative overflow-hidden group
                      ${
                        activeProject === index
                          ? "bg-neutral-900"
                          : "hover:bg-neutral-900/50"
                      }`}
                    aria-label={`View ${project.title} project details`}
                  >
                    <div className="relative z-10">
                      <h3
                        className={`text-lg sm:text-xl font-semibold mb-2 transition-colors
                        ${
                          activeProject === index
                            ? "text-blue-400"
                            : "text-neutral-400"
                        }`}
                      >
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-neutral-800/50 text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {activeProject === index && (
                      <motion.div
                        layoutId="activeProject"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Project Display */}
            <div className="lg:w-2/3 relative">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="relative aspect-[16/9] sm:aspect-[16/7] max-w-2xl mx-auto rounded-md overflow-hidden group">
                  {projects[activeProject].media.type === "image" ? (
                    <>
                      <Image
                        src={projects[activeProject].media.src}
                        alt={`${projects[activeProject].title} - Portfolio Project by Rushikesh Nimkar`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-wrap gap-3 sm:gap-4">
                          <a
                            href={projects[activeProject].github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/50 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm transition-colors text-sm sm:text-base"
                            aria-label={`View source code for ${projects[activeProject].title} on GitHub`}
                          >
                            <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>View Code</span>
                          </a>
                          {projects[activeProject].link && (
                            <a
                              href={projects[activeProject].link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-white/90 hover:text-white bg-black/50 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm transition-colors text-sm sm:text-base"
                              aria-label={`View live demo of ${projects[activeProject].title}`}
                            >
                              <FiExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <YouTubeEmbed videoId={projects[activeProject].media.src} />
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-200">
                    {projects[activeProject].title}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    {projects[activeProject].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {projects[activeProject].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project links for both image and video types */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={projects[activeProject].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/90 hover:text-white bg-neutral-800 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <FiGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    {projects[activeProject].link && (
                      <a
                        href={projects[activeProject].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-blue-600/80 hover:bg-blue-600 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* SEO-friendly footer section with additional keywords */}
          <footer className="mt-20 text-center text-sm text-transparent ">
            <p>
              Portfolio template showcasing web development and software
              engineering projects. Built with Next.js, React, TypeScript, and
              Tailwind CSS.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
