import React from "react";
import { FaCode } from "react-icons/fa";

export interface Skill {
  name: string;
  category: string;
}

interface SkillsCardProps {
  skills: Skill[];
}

export const SkillsCard: React.FC<SkillsCardProps> = ({ skills }) => {
  // Group skills by category for better organization
  const groupedSkills: Record<string, Skill[]> = {};

  skills.forEach((skill) => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = [];
    }
    groupedSkills[skill.category].push(skill);
  });

  return (
    <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4">
      <div className="bg-neutral-800/70 rounded-lg p-3 sm:p-4 border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <FaCode className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="font-medium text-white text-sm sm:text-base">Skills & Technologies</h3>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-1.5 sm:space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-neutral-400 border-b border-neutral-700/50 pb-1">
                {category}
              </h4>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categorySkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-neutral-700/40 hover:bg-neutral-700/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-colors"
                  >
                    <span className="font-medium text-xs sm:text-sm text-white">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;
