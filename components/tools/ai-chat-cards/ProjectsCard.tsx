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
  <div className="mt-3 space-y-4">
    {projects.map((project, index) => (
      <div
        key={index}
        className="bg-neutral-800/70 rounded-lg p-4 border border-neutral-700/50"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <BsCardChecklist className="text-purple-400" />
            <h3 className="font-medium text-white">{project.title}</h3>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Project
            </a>
          )}
        </div>
        <p className="mt-2 text-sm text-neutral-300">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-neutral-700/50 rounded-md text-xs text-neutral-300"
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
