"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "CryptoRage",
    description: "Cryptorage is a Chrome extension that integrates with Sui wallet to provide secure storage and sharing of screenshots within teams. It allows users to capture, store, and share screenshots with team members, all while leveraging blockchain technology for enhanced security and transparency.",
    image: "/projects/cryptorage.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://cryptorage-login.vercel.app/",
    github: "https://github.com/Rushikeshnimkar/CryptoRage",
  },
  {
    id: 2,
    title: "GitSplit",
    description: "A Web App for Open-Source projects to raise funding and split among its contributors. Discover and Showcase your projects on this platform.",
    image: "/projects/gitsplit.png",
    tags: ["React", "Next.js","Tailwind", "SQL", "Golang"],
    link: "",
    github: "https://github.com/GitSplit-org",
  },
  {
    id: 3,
    title: "Communepro",
    description: "Communepro is a modern, customizable NPM package that provides a comment section component for React applications. It offers features like nested replies, real-time updates, dark mode support, and a responsive design, making it easy to enhance your app with an intuitive and engaging commenting experience.",
    image: "/projects/communepro.png",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    link: "https://communepro.vercel.app/",
    github: "https://www.npmjs.com/package/addcomment",
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
            Projects
          </h1>
        </motion.div>

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
                    ${activeProject === index ? 'bg-neutral-900' : 'hover:bg-neutral-900/50'}`}
                >
                  <div className="relative z-10">
                    <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors
                      ${activeProject === index ? 'text-blue-400' : 'text-neutral-400'}`}>
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
              <div className="relative aspect-[16/9] sm:aspect-[16/7] max-w-2xl mx-auto rounded-xl overflow-hidden group">
                <Image
                  src={projects[activeProject].image}
                  alt={projects[activeProject].title}
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
                      >
                        <FiExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
