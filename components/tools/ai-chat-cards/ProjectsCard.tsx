import React from "react";
import { motion } from "framer-motion";
import { BsCardChecklist } from "react-icons/bs";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
}

interface ProjectsCardProps {
  projects: Project[];
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 20 } 
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-3 space-y-4 w-full"
    >
      {projects.map((project, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(168, 85, 247, 0.08)" }}
          className="rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border border-purple-500/20"
          style={{
            background: "rgba(12, 10, 18, 0.6)",
            boxShadow: "0 8px 32px 0 rgba(168, 85, 247, 0.03), inset 0 0 40px rgba(255, 255, 255, 0.01)",
          }}
        >
          {/* Subtle purple glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <BsCardChecklist className="text-purple-400 w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide line-clamp-2">
                  {project.title}
                </h3>
                <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase">Project Showcase</span>
              </div>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all hover:scale-105 self-start sm:self-auto"
              >
                <FaExternalLinkAlt className="w-3 h-3" />
                View Code
              </a>
            )}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
            {project.description}
          </p>

          <div className="mt-4 space-y-2">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">Technologies Leveraged</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 sm:py-1 bg-purple-500/5 border border-purple-500/10 rounded-md text-[10px] sm:text-xs font-mono text-purple-300/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectsCard;
