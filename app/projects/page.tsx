"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
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
      src: "/projects/cryptorage.webp",
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
      src: "/projects/gitsplit.webp",
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
      src: "/projects/communepro.webp",
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
  if (url.includes("youtu.be")) {
    return url.split("/").pop() || "";
  }
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([^/?]+)/);
  if (embedMatch) return embedMatch[1];
  return url;
};

// Helper to get YouTube thumbnail from video URL or ID
const getYouTubeThumbnail = (url: string): string => {
  const id = extractYouTubeId(url);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

// YouTube embed component with autoplay
const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  const id = extractYouTubeId(videoId);
  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`}
        className="absolute inset-0 w-full h-full rounded-lg"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// 1. Grid Container Variants: For staggering the project cards
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time delay between each child animation
    },
  },
};

// 2. Project Card Variants: For individual card animations
const projectCardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

// 3. Modal Content Variants: For animating content inside the modal
const modalContentVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
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
        sameAs: ["https://github.com/Rushikeshnimkar"],
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.head.removeChild(script);
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]);

  return (
    <>
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

      <div
        id="projects-page"
        className="min-h-screen w-full text-white mt-10 relative z-10"
      >
        <div id="projects-container" className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1
            id="projects-title"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500"
          >
            Projects
          </motion.h1>

          {/* Project Grid Layout with new variants */}
          <motion.div
            id="projects-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                id={`project-card-${project.id}`}
                layoutId={`project-${project.id}`}
                variants={projectCardVariants} // Apply card animation
                className="bg-neutral-700/30 rounded-xl overflow-hidden border-black border backdrop-blur-sm flex flex-col h-full group cursor-pointer will-change-transform"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Media */}
                <div
                  id={`project-media-${project.id}`}
                  className="relative w-full aspect-video overflow-hidden bg-neutral-950"
                >
                  {project.media.type === "image" ? (
                    <Image
                      src={project.media.src}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="relative w-full h-full cursor-pointer">
                      <Image
                        src={getYouTubeThumbnail(project.media.src)}
                        alt={project.title + " video thumbnail"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="32"
                            cy="32"
                            r="32"
                            fill="rgba(0,0,0,0.5)"
                          />
                          <polygon points="26,20 48,32 26,44" fill="#fff" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div
                  id={`project-details-${project.id}`}
                  className="p-4 sm:p-6 flex flex-col flex-grow"
                >
                  <h2
                    id={`project-title-${project.id}`}
                    className="text-base sm:text-lg md:text-xl font-semibold text-neutral-200 mb-2"
                  >
                    {project.title}
                  </h2>

                  {/* Enhanced 3-line description with better ellipsis handling */}
                  <div
                    id={`project-description-${project.id}`}
                    className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-3 flex-grow relative"
                  >
                    <p
                      className="overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.5",
                        maxHeight: "4.5em", // 3 lines * 1.5 line-height
                      }}
                      title={project.description} // Show full text on hover
                    >
                      {project.description}
                    </p>

                    {/* Gradient fade effect for better visual indication of truncation */}
                    {project.description.length > 150 && (
                      <div className="absolute bottom-0 right-0 w-8 h-6 bg-gradient-to-l from-neutral-700/30 to-transparent pointer-events-none" />
                    )}
                  </div>

                  <div
                    id={`project-tags-${project.id}`}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs sm:text-sm rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div
                    id={`project-links-${project.id}`}
                    className="flex flex-wrap gap-3 mt-auto"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, "_blank");
                      }}
                      className="flex items-center gap-2 text-white/80 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                      aria-label={`View source code for ${project.title} on GitHub`}
                      title="View on GitHub"
                    >
                      <FiGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </button>
                    {project.link && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.link, "_blank");
                        }}
                        className="flex items-center gap-2 text-white/90 hover:text-white bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                        aria-label={`View live demo of ${project.title}`}
                        title="View Live Demo"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <footer className="mt-20 text-center text-sm text-neutral-600 hidden">
            <p>
              Portfolio template showcasing web development and software
              engineering projects. Built with Next.js, React, TypeScript, and
              Tailwind CSS.
            </p>
          </footer>
        </div>
      </div>

      {/* Enhanced Modal with better transitions */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            id="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              id={`project-modal-${selectedProject.id}`}
              layoutId={`project-${selectedProject.id}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/50 w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row will-change-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(null);
                }}
                className="absolute top-6 right-6 z-20 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
              >
                <FiX className="w-6 h-6" />
              </button>

              <div className="relative w-full md:w-[60%] bg-black/20 flex items-center justify-center p-6 md:p-8">
                <div className="w-full max-w-4xl">
                  {selectedProject.media.type === "image" ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 shadow-2xl">
                      <Image
                        src={selectedProject.media.src}
                        alt={selectedProject.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="60vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                      <YouTubeEmbed videoId={selectedProject.media.src} />
                    </div>
                  )}
                </div>
              </div>

              {/* Animated Modal Content */}
              <motion.div
                className="p-8 md:p-12 overflow-y-auto md:w-[40%] flex flex-col bg-gradient-to-b from-neutral-900/95 to-neutral-800/95 backdrop-blur-sm"
                variants={gridContainerVariants} // Reuse container for staggering
                initial="hidden"
                animate="show"
              >
                <div className="space-y-8">
                  <motion.div variants={modalContentVariants}>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {selectedProject.title}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </motion.div>

                  <motion.div
                    variants={modalContentVariants}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-neutral-200 uppercase tracking-wide">
                      About
                    </h3>
                    <p className="text-neutral-300 leading-relaxed text-lg">
                      {selectedProject.description}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={modalContentVariants}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-neutral-200 uppercase tracking-wide">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-neutral-800 to-neutral-700 text-neutral-200 border border-neutral-600/50 hover:border-neutral-500/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={modalContentVariants}
                    className="space-y-4 pt-4"
                  >
                    <h3 className="text-lg font-semibold text-neutral-200 uppercase tracking-wide">
                      Links
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() =>
                          window.open(selectedProject.github, "_blank")
                        }
                        className="flex items-center justify-center gap-3 text-white bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 px-6 py-3 rounded-xl transition-all duration-200 font-medium border border-neutral-600/50 hover:border-neutral-500/50 hover:scale-105 shadow-lg"
                      >
                        <FiGithub className="w-5 h-5" />
                        <span>View Source</span>
                      </button>
                      {selectedProject.link && (
                        <button
                          onClick={() =>
                            window.open(selectedProject.link, "_blank")
                          }
                          className="flex items-center justify-center gap-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:scale-105"
                        >
                          <FiExternalLink className="w-5 h-5" />
                          <span>Live Demo</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
