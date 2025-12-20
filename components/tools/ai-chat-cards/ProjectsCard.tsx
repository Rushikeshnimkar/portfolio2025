import React from "react";
import { BsCardChecklist } from "react-icons/bs";

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

export const ProjectsCard: React.FC<ProjectsCardProps> = ({ projects }) => (
  <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
    {projects.map((project, index) => (
      <div
        key={index}
        className="bg-neutral-800/70 rounded-lg p-3 sm:p-4 border border-neutral-700/50"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <BsCardChecklist className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <h3 className="font-medium text-white text-sm sm:text-base line-clamp-2">{project.title}</h3>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm flex-shrink-0 ml-6 sm:ml-0"
            >
              View →
            </a>
          )}
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-300 line-clamp-3">{project.description}</p>
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-neutral-700/50 rounded-md text-[10px] sm:text-xs text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ProjectsCard;
