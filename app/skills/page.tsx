"use client";
import { motion, useInView } from "framer-motion";

import { useRef } from "react";

const skills = {
  "Frontend Development": [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "JavaScript", level: 90 },
  ],
  "Backend Development": [
    { name: "Go", level: 80 },
    { name: "MySQL", level: 80 },
    { name: "PostgreSQL", level: 75 },
  ],
  "Tools & Technologies": [
    { name: "Git", level: 90 },
    { name: "Docker", level: 80 },
    { name: "Linux", level: 85 },
  ],
};

const SkillBar = ({
  name,
  level,
  delay,
}: {
  name: string;
  level: number;
  delay: number;
}) => {
  const skillRef = useRef(null);
  const isInView = useInView(skillRef, { once: true });

  return (
    <motion.div
      ref={skillRef}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
      className="mb-4 sm:mb-6"
    >
      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay }}
          className="text-neutral-300 text-sm sm:text-base"
        >
          {name}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 1 }}
          className="text-neutral-400 text-xs sm:text-sm"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-1.5 sm:h-2 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={
            isInView
              ? { width: `${level}%`, opacity: 1 }
              : { width: 0, opacity: 0 }
          }
          transition={{
            duration: 1.5,
            delay: delay + 0.2,
            ease: [0.34, 1.56, 0.64, 1], // Custom spring animation
          }}
          className="h-full rounded-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: "skewX(-20deg)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function Skills() {
  return (
    <div className="min-h-screen w-full  text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 " />
      <div className="absolute inset-0 w-full h-full"></div>
      <div className="absolute inset-0 " />

      <div className="relative z-10 h-full overflow-y-auto">
        <main className="container mx-auto px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              Skills & Expertise
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Object.entries(skills).map(
              ([category, skillList], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="backdrop-blur-sm bg-neutral-900/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-neutral-800"
                >
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    {category}
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {skillList.map((skill, index) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={index * 0.2}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 sm:mt-16 text-center"
          >
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-neutral-800 backdrop-blur-sm">
              <span className="text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">
                Always learning, always growing
              </span>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
