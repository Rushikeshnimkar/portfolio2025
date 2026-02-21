"use client";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { useEffect, useRef, useCallback } from "react";
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
    src: string;
    thumbnail?: string;
  };
  tags: string[];
  link: string;
  github: string;
};

const extractYouTubeId = (url: string): string => {
  if (url.includes("youtu.be")) return url.split("/").pop() || "";
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([^/?]+)/);
  if (embedMatch) return embedMatch[1];
  return url;
};

const projects: Project[] = [
  {
    id: 1,
    title: "CryptoRage",
    description:
      "Cryptorage is a Chrome extension that integrates with Sui wallet to provide secure storage and sharing of screenshots within teams. It allows users to capture, store, and share screenshots with team members, all while leveraging blockchain technology for enhanced security and transparency.",
    media: { type: "image", src: "/projects/cryptorage.webp" },
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "https://cryptorage-login.vercel.app/",
    github: "https://github.com/Rushikeshnimkar/CryptoRage",
  },
  {
    id: 2,
    title: "GitSplit",
    description:
      "A Web App for Open-Source projects to raise funding and split among its contributors. Discover and Showcase your projects on this platform.",
    media: { type: "image", src: "/projects/gitsplit.webp" },
    tags: ["React", "Next.js", "Tailwind", "SQL", "Golang"],
    link: "",
    github: "https://github.com/GitSplit-org",
  },
  {
    id: 3,
    title: "Communepro",
    description:
      "Communepro is a modern, customizable NPM package that provides a comment section component for React applications. It offers features like nested replies, real-time updates, dark mode support, and a responsive design, making it easy to enhance your app with an intuitive and engaging commenting experience.",
    media: { type: "image", src: "/projects/communepro.webp" },
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
      thumbnail: `https://img.youtube.com/vi/${extractYouTubeId("https://youtu.be/TwaQDbr75z4")}/hqdefault.jpg`,
    },
    tags: ["Node.js", "TypeScript", "Qwen AI", "Commander.js", "Chalk"],
    link: "https://www.npmjs.com/package/terminal-ai-assistant",
    github:
      "https://github.com/Rushikeshnimkar/terminal-ai-assistant-windows.git",
  },
  {
    id: 5,
    title: "Fleet Management System",
    description:
      "A full-stack vehicle rental platform handling 100+ hub locations with real-time inventory, dynamic pricing, booking workflows, secure JWT + OAuth2 authentication, role-based access control, and Razorpay payment integration with automated invoice generation.",
    media: { type: "image", src: "/projects/fleeman.webp" },
    tags: ["Java Spring Boot", "Next.js", "MySQL", "Razorpay", "JWT"],
    link: "",
    github: "https://github.com/orgs/fleet-management-cdac/repositories",
  },
];

// Animation variants
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const projectCardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

export default function Projects() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layoutRef = useRef<any>(null);

  // Dynamically import animejs/layout
  useEffect(() => {
    let disposed = false;
    async function initLayout() {
      try {
        const { createLayout } = await import("animejs/layout");
        if (disposed || !dialogRef.current) return;
        layoutRef.current = createLayout(dialogRef.current, {
          children: [".item", "h2", ".item-tags", ".item-media"],
          properties: ["--overlay-alpha"],
        });
      } catch (err) {
        console.warn("Failed to init animejs layout:", err);
      }
    }
    initLayout();
    return () => {
      disposed = true;
      if (layoutRef.current?.revert) layoutRef.current.revert();
    };
  }, []);

  // SEO structured data
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: SEO.title,
      description: SEO.description,
      mainEntity: {
        "@type": "Person",
        name: "Rushikesh Nimkar",
        url: "https://github.com/Rushikeshnimkar",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const closeModal = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const openItem = document.querySelector(
      "#projects-grid .item.is-open"
    ) as HTMLElement | null;

    if (layoutRef.current) {
      layoutRef.current.update(() => {
        dialog.close();
        if (openItem) {
          openItem.classList.remove("is-open");
          openItem.focus();
        }
      });
    } else {
      dialog.close();
      if (openItem) openItem.classList.remove("is-open");
    }

    document.body.style.overflow = "auto";
  }, []);

  const openModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Don't open modal if clicking a link
      const target = e.target as HTMLElement;
      if (target.closest("a")) return;

      const item = (e.currentTarget as HTMLElement).closest(
        ".item"
      ) as HTMLElement;
      if (!item) return;

      // Clone the card and put it in the dialog
      const clone = item.cloneNode(true) as HTMLElement;
      dialog.innerHTML = "";
      dialog.appendChild(clone);

      // After cloning, replace YouTube thumbnails with actual iframes
      const youtubeMedia = clone.querySelector(
        ".item-media[data-youtube-id]"
      ) as HTMLElement | null;
      if (youtubeMedia) {
        const ytId = youtubeMedia.getAttribute("data-youtube-id");
        if (ytId) {
          // Replace thumbnail with iframe
          youtubeMedia.innerHTML = `
            <iframe
              src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&loop=1&playlist=${ytId}"
              class="item-media-iframe"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          `;
        }
      }

      const duration = 600;

      if (layoutRef.current) {
        layoutRef.current.update(
          () => {
            dialog.showModal();
            item.classList.add("is-open");
          },
          { duration }
        );
      } else {
        dialog.showModal();
        item.classList.add("is-open");
      }

      document.body.style.overflow = "hidden";
    },
    [closeModal]
  );

  // Dialog event listeners
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      closeModal();
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === dialog || target.closest(".dialog-close-btn")) {
        closeModal();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [closeModal]);

  return (
    <>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
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

          <motion.div
            id="projects-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
          >
            {projects.map((project) => {
              const ytId =
                project.media.type === "youtube"
                  ? extractYouTubeId(project.media.src)
                  : undefined;

              return (
                <motion.div key={project.id} variants={projectCardVariants}>
                  <button
                    type="button"
                    className="item"
                    data-layout-id={`project-${project.id}`}
                    onClick={openModal}
                  >
                    {/* Close button - only visible in dialog */}
                    <span className="dialog-close-btn" aria-label="Close">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </span>

                    {/* Media */}
                    <div
                      className="item-media"
                      data-layout-id={`media-${project.id}`}
                      {...(ytId ? { "data-youtube-id": ytId } : {})}
                    >
                      <img
                        src={
                          project.media.type === "youtube"
                            ? project.media.thumbnail
                            : project.media.src
                        }
                        alt={project.title}
                        className="item-media-img"
                        loading="lazy"
                      />
                      {project.media.type === "youtube" && (
                        <div className="item-play-overlay">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 64 64"
                            fill="none"
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
                      )}
                    </div>

                    {/* Content wrapper - becomes the right column in dialog */}
                    <div className="item-content">
                      {/* Title */}
                      <h2 data-layout-id={`title-${project.id}`}>
                        {project.title}
                      </h2>

                      {/* Tags */}
                      <div
                        className="item-tags"
                        data-layout-id={`tags-${project.id}`}
                      >
                        {project.tags.map((tag) => (
                          <span key={tag} className="item-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Description - hidden in grid, visible in dialog */}
                      <p className="item-description">{project.description}</p>

                      {/* Links - hidden in grid, visible in dialog */}
                      <div className="item-links">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="item-link item-link-github"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiGithub className="w-5 h-5" />
                          View Source
                        </a>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="item-link item-link-live"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiExternalLink className="w-5 h-5" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Anime.js Layout Dialog */}
      <dialog ref={dialogRef} id="layout-dialog" />
    </>
  );
}
