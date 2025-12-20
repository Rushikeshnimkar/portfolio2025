import React from "react";
import { MdWork } from "react-icons/md";

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceCardProps {
  experiences: Experience[];
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experiences,
}) => (
  <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
    {experiences.map((exp, index) => (
      <div
        key={index}
        className="bg-neutral-800/70 rounded-lg p-3 sm:p-4 border border-neutral-700/50"
      >
        <div className="flex items-center gap-2">
          <MdWork className="text-green-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <h3 className="font-medium text-white text-sm sm:text-base line-clamp-1">{exp.title}</h3>
        </div>
        <div className="mt-1.5 sm:mt-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
          <span className="text-xs sm:text-sm text-blue-400">{exp.company}</span>
          <span className="text-[10px] sm:text-xs text-neutral-400">{exp.period}</span>
        </div>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-300 line-clamp-3">{exp.description}</p>
      </div>
    ))}
  </div>
);

export default ExperienceCard;
