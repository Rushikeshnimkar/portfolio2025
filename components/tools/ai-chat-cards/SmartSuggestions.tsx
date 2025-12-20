"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

interface SmartSuggestionsProps {
    suggestions: string[];
    onSuggestionClick: (suggestion: string) => void;
    isVisible: boolean;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
    suggestions,
    onSuggestionClick,
    isVisible,
}) => {
    if (!isVisible || suggestions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
        >
            <div className="flex items-center gap-2 mb-2">
                <HiSparkles className="w-3.5 h-3.5 text-[var(--cyan)]" />
                <span className="text-xs text-[var(--gray-400)]">Suggested questions</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="group relative px-3 py-2 rounded-xl text-sm text-left
                       bg-gradient-to-r from-[var(--navy-light)] to-[var(--navy-medium)]
                       border border-[var(--cyan)]/20 hover:border-[var(--cyan)]/50
                       text-[var(--gray-200)] hover:text-white
                       transition-all duration-300 max-w-[280px]"
                    >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--cyan)]/5 to-[var(--purple)]/5 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Icon */}
                        <span className="relative flex items-start gap-2">
                            <HiLightningBolt className="w-3.5 h-3.5 text-[var(--cyan)] mt-0.5 flex-shrink-0 
                                          group-hover:text-[var(--cyan-light)] transition-colors" />
                            <span className="leading-relaxed">{suggestion}</span>
                        </span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default SmartSuggestions;
