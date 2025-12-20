"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaChartLine } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export interface SkillMatch {
    name: string;
    matched: boolean;
    proficiency?: string;
    relevantProjects?: string[];
}

export interface SkillMatchData {
    matchPercentage: number;
    matchedSkills: SkillMatch[];
    missingSkills: SkillMatch[];
    summary: string;
    recommendation: string;
}

interface SkillMatchCardProps {
    data: SkillMatchData;
}

// Circular progress component
const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Get color based on percentage
    const getColor = () => {
        if (percentage >= 80) return { gradient: "from-[var(--teal)] to-[var(--cyan)]", text: "var(--cyan)" };
        if (percentage >= 60) return { gradient: "from-[var(--cyan)] to-[var(--blue)]", text: "var(--blue-light)" };
        if (percentage >= 40) return { gradient: "from-[var(--purple)] to-[var(--pink)]", text: "var(--purple-light)" };
        return { gradient: "from-[var(--pink)] to-[var(--fuchsia)]", text: "var(--pink-light)" };
    };

    const colors = getColor();

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.1)"
                    strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                    cx="72"
                    cy="72"
                    r={radius}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--cyan)" />
                        <stop offset="100%" stopColor="var(--purple)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-3xl font-bold"
                    style={{ color: colors.text }}
                >
                    {percentage}%
                </motion.span>
                <span className="text-xs text-[var(--gray-400)]">Match Score</span>
            </div>
        </div>
    );
};

export const SkillMatchCard: React.FC<SkillMatchCardProps> = ({ data }) => {
    const { matchPercentage, matchedSkills, missingSkills, summary, recommendation } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3"
        >
            <div className="glass-card rounded-xl p-5 border border-[var(--cyan)]/15">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b border-[var(--cyan)]/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] rounded-xl shadow-lg">
                            <FaChartLine className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg">Skill Match Analysis</h3>
                            <p className="text-xs text-[var(--gray-400)]">AI-powered compatibility check</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/20">
                        <HiSparkles className="w-4 h-4 text-[var(--cyan)]" />
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Circular progress */}
                    <div className="flex justify-center">
                        <CircularProgress percentage={matchPercentage} />
                    </div>

                    {/* Skills breakdown */}
                    <div className="flex-1 space-y-4">
                        {/* Matched Skills */}
                        {matchedSkills.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaCheckCircle className="w-4 h-4 text-[var(--teal)]" />
                                    <span className="text-sm font-medium text-[var(--teal-light)]">
                                        Matched Skills ({matchedSkills.length})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {matchedSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium
                                 bg-[var(--teal)]/15 border border-[var(--teal)]/30
                                 text-[var(--teal-light)]"
                                        >
                                            ✓ {skill.name}
                                            {skill.proficiency && (
                                                <span className="ml-1 text-xs opacity-70">({skill.proficiency})</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Missing Skills */}
                        {missingSkills.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FaExclamationCircle className="w-4 h-4 text-[var(--gray-500)]" />
                                    <span className="text-sm font-medium text-[var(--gray-400)]">
                                        Skills to Explore ({missingSkills.length})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {missingSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + index * 0.05 }}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium
                                 bg-[var(--gray-600)]/20 border border-[var(--gray-600)]/30
                                 text-[var(--gray-400)]"
                                        >
                                            {skill.name}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[var(--cyan)]/10 to-[var(--purple)]/10 border border-[var(--cyan)]/20"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <HiSparkles className="w-4 h-4 text-[var(--cyan)]" />
                        <span className="text-sm font-medium text-white">AI Assessment</span>
                    </div>
                    <p className="text-sm text-[var(--gray-300)] leading-relaxed mb-2">
                        {summary}
                    </p>
                    <p className="text-sm text-[var(--cyan-light)] italic">
                        💡 {recommendation}
                    </p>
                </motion.div>

                {/* Footer */}
                <div className="mt-4 h-0.5 bg-gradient-to-r from-[var(--cyan)] via-[var(--purple)] to-transparent rounded-full opacity-30" />
            </div>
        </motion.div>
    );
};

export default SkillMatchCard;
