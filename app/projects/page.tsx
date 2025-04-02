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
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`}
        className="absolute inset-0 w-full h-full rounded-t-xl"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Add this new constant for shared transition config
const transitionConfig = {
  type: "spring",
  bounce: 0.15,
  duration: 0.4,
};

export default function Projects() {
  // State to hold the currently selected project for the modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

    // Add effect to handle body scroll lock when modal is open
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to restore scroll on component unmount or modal close
    return () => {
      document.head.removeChild(script);
      document.body.style.overflow = "auto";
    };
  }, [selectedProject]); // Re-run effect when selectedProject changes

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

      <div className="min-h-screen w-full text-white mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
            Projects
          </h1>

          {/* Project Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layoutId={`project-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transitionConfig}
                className="bg-neutral-900 rounded-xl overflow-hidden shadow-lg flex flex-col h-full group cursor-pointer will-change-transform"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Media */}
                <div className="relative w-full aspect-video overflow-hidden bg-neutral-950">
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
                    <YouTubeEmbed videoId={project.media.src} />
                  )}
                </div>

                {/* Project Details - Simplified structure */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-200 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-3 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project Links */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    <button
                      onClick={() => window.open(project.github, "_blank")}
                      className="flex items-center gap-2 text-white/80 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                      aria-label={`View source code for ${project.title} on GitHub`}
                      title="View on GitHub"
                    >
                      <FiGithub className="w-4 h-4" />
                      <span>GitHub</span>
                    </button>
                    {project.link && (
                      <button
                        onClick={() => window.open(project.link, "_blank")}
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
          </div>

          {/* SEO-friendly footer section */}
          <footer className="mt-20 text-center text-sm text-neutral-600 hidden">
            <p>
              Portfolio template showcasing web development and software
              engineering projects. Built with Next.js, React, TypeScript, and
              Tailwind CSS.
            </p>
          </footer>
        </div>
      </div>

      {/* Optimized Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 mt-16"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={`project-${selectedProject.id}`}
              transition={transitionConfig}
              className="bg-neutral-900 rounded-xl overflow-hidden shadow-2xl w-full max-h-[85vh] max-w-5xl flex flex-col md:flex-row will-change-transform"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Media Section - Simplified */}
              <div className="relative w-full md:w-[65%] bg-neutral-950 flex items-center justify-center p-4 md:p-8">
                {selectedProject.media.type === "image" ? (
                  <Image
                    src={selectedProject.media.src}
                    alt={selectedProject.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-contain rounded-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, 65vw"
                  />
                ) : (
                  <div className="w-full aspect-video">
                    <YouTubeEmbed videoId={selectedProject.media.src} />
                  </div>
                )}
              </div>

              {/* Modal Content Section - Simplified */}
              <div className="p-6 md:p-8 overflow-y-auto md:w-[35%] flex flex-col bg-neutral-900">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-100 mb-6">
                  {selectedProject.title}
                </h2>

                <div className="space-y-6">
                  <p className="text-base text-neutral-300 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() =>
                        window.open(selectedProject.github, "_blank")
                      }
                      className="flex items-center gap-2 text-white/90 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </button>
                    {selectedProject.link && (
                      <button
                        onClick={() =>
                          window.open(selectedProject.link, "_blank")
                        }
                        className="flex items-center gap-2 text-white hover:text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        <span>Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button - Simplified */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(null);
                }}
                className="absolute top-4 right-4 text-white/90 hover:text-white bg-black/50 hover:bg-black/60 rounded-full p-2.5 transition-colors z-10"
              >
                <FiX className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
