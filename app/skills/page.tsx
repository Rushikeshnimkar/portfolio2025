"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiGo,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiLinux,
  SiMongodb,
  SiNodedotjs,
} from "react-icons/si";
import { RiJavaLine } from "react-icons/ri";
import { FiCode, FiDatabase, FiTool } from "react-icons/fi";
import { TbBrain } from "react-icons/tb";

const skills = {
  "Frontend Development": [
    { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
    { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
    { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6]" /> },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="text-[#06B6D4]" />,
    },
    { name: "JavaScript", icon: <SiJavascript className="text-[#F7DF1E]" /> },
  ],
  "Backend & Databases": [
    { name: "Go", icon: <SiGo className="text-[#00ADD8]" /> },
    { name: "Java", icon: <RiJavaLine className="text-[#ED8B00]" /> },
    { name: "MySQL", icon: <SiMysql className="text-[#4479A1]" /> },
    { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
    { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
    { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
  ],
  "AI & ML Technologies": [
    { name: "LangChain", icon: <TbBrain className="text-[#00A3A3]" /> },
    { name: "LangGraph", icon: <TbBrain className="text-[#FF6B6B]" /> },
  ],
  "Tools & Technologies": [
    { name: "Git", icon: <SiGit className="text-[#F05032]" /> },
    { name: "Docker", icon: <SiDocker className="text-[#2496ED]" /> },
    { name: "Linux", icon: <SiLinux className="text-[#FCC624]" /> },
  ],
};

const categoryIcons = {
  "Frontend Development": <FiCode className="w-6 h-6" />,
  "Backend & Databases": <FiDatabase className="w-6 h-6" />,
  "AI & ML Technologies": <TbBrain className="w-6 h-6" />,
  "Tools & Technologies": <FiTool className="w-6 h-6" />,
};

export default function Skills() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div id="skills-page" className="min-h-screen w-full text-white">
      <div id="skills-container" className="container mx-auto px-4 py-16">
        <motion.div
          id="skills-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 id="skills-title" className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              Skills & Technologies
            </span>
          </h1>
          <p
            id="skills-subtitle"
            className="text-neutral-400 text-base max-w-2xl mx-auto"
          >
            My technical toolkit for building modern applications
          </p>
        </motion.div>

        <div
          id="skills-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {Object.keys(skills).map((category, index) => (
            <motion.div
              key={category}
              id={`skill-category-${category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-700/30 backdrop-blur-lg rounded-2xl border border-neutral-800 overflow-hidden"
            >
              <div
                id={`category-header-${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className=" p-6 border-b border-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    id={`category-icon-${category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30"
                  >
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </div>
                  <h2
                    id={`category-title-${category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-2xl font-bold text-white"
                  >
                    {category}
                  </h2>
                </div>
              </div>

              <div
                id={`skills-list-${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="p-6"
              >
                <div className="flex flex-wrap gap-3">
                  {skills[category as keyof typeof skills].map(
                    (skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        id={`skill-item-${skill.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + skillIndex * 0.05,
                        }}
                        whileHover={{ y: -5 }}
                        className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50"
                      >
                        <div
                          id={`skill-icon-${skill.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="text-xl"
                        >
                          {skill.icon}
                        </div>
                        <span
                          id={`skill-name-${skill.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="text-sm font-medium"
                        >
                          {skill.name}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          id="skills-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div
            id="skills-footer-container"
            className="inline-block relative max-w-2xl"
          >
            <div
              id="skills-footer-glow"
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 blur-sm"
            />
            <div
              id="skills-footer-content"
              className="relative px-6 py-4 bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-700/50"
            >
              <p className="text-sm md:text-base text-neutral-300 font-light">
                Always exploring new technologies to expand my toolkit and solve
                complex problems more effectively.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
