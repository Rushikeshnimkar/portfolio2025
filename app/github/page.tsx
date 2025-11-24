"use client";
import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { useState } from "react";
import { GitHubContributions } from "@/components/tools/githubcontribution";
import Head from "next/head";

// SEO keywords and descriptions
const SEO = {
  title: "Rushikesh Nimkar | GitHub Contributions",
  description: "View my GitHub contribution history and coding activity.",
  keywords:
    "GitHub contributions, coding activity, open source, developer portfolio",
};

export default function Contributions() {
  const [isContributionVisible, setIsContributionVisible] = useState(false);

  // Animation variants for the contribution section
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
      </Head>

      <div className="min-h-auto w-full text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl mb-10 text-center sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
            GitHub Contributions
          </h1>

          <motion.section
            className="mb-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onViewportEnter={() => setIsContributionVisible(true)}
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl shadow-xl overflow-hidden relative"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Contribution Activity
                  </h2>
                </div>

                <motion.a
                  href="https://github.com/Rushikeshnimkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg z-10 bg-neutral-800/80 hover:bg-neutral-700/80 transition-all duration-300 text-sm border border-neutral-700/50 hover:border-blue-500/30 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiGithub className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span>View GitHub Profile</span>
                </motion.a>
              </motion.div>

              {/* Contribution graph */}
              <div className="relative rounded-sm overflow-x-auto">
                {isContributionVisible && (
                  <div className="relative">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                    >
                      <GitHubContributions username="Rushikeshnimkar" />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
