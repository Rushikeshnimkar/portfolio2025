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
  <div className="mt-3 space-y-4">
    {experiences.map((exp, index) => (
      <div
        key={index}
        className="bg-neutral-800/70 rounded-lg p-4 border border-neutral-700/50"
      >
        <div className="flex items-center gap-2">
          <MdWork className="text-green-400" />
          <h3 className="font-medium text-white">{exp.title}</h3>
        </div>
        <div className="mt-1 flex justify-between items-center">
          <span className="text-sm text-blue-400">{exp.company}</span>
          <span className="text-xs text-neutral-400">{exp.period}</span>
        </div>
        <p className="mt-2 text-sm text-neutral-300">{exp.description}</p>
      </div>
    ))}
  </div>
);

export default ExperienceCard;
