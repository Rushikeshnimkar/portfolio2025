import React from "react";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="mt-3 w-full">
      <div 
        className="rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border border-cyan-500/20"
        style={{
          background: "rgba(10, 15, 20, 0.6)",
          boxShadow: "0 8px 32px 0 rgba(6, 182, 212, 0.05), inset 0 0 40px rgba(255, 255, 255, 0.01)",
        }}
      >
        {/* Cyber Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <FaCode className="text-cyan-400 w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">Skills & Technologies</h3>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">Professional Stack</span>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <motion.div 
              key={category} 
              variants={itemVariants}
              className="space-y-2"
            >
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-400 border-b border-white/5 pb-1 font-mono uppercase tracking-wider">
                {category}
              </h4>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 4px 12px rgba(6, 182, 212, 0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors cursor-default select-none shadow-sm flex items-center justify-center"
                  >
                    <span className="font-medium text-xs text-white/90 group-hover:text-cyan-300">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsCard;
