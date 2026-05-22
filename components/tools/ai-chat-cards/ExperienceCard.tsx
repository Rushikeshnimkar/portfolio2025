import React from "react";
import { motion } from "framer-motion";
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

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experiences }) => {
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
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(16, 185, 129, 0.08)" }}
          className="rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border border-emerald-500/20"
          style={{
            background: "rgba(10, 18, 14, 0.6)",
            boxShadow: "0 8px 32px 0 rgba(16, 185, 129, 0.03), inset 0 0 40px rgba(255, 255, 255, 0.01)",
          }}
        >
          {/* Subtle emerald glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <MdWork className="text-emerald-400 w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide line-clamp-1">
                  {exp.title}
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase">{exp.company}</span>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-white/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 self-start sm:self-auto">
              {exp.period}
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-light">
            {exp.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExperienceCard;
