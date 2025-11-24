"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export const TextReveal: React.FC<TextRevealProps> = ({
    text,
    className = "",
    delay = 0,
}) => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let iteration = 0;
        let timer: NodeJS.Timeout;

        const startAnimation = () => {
            timer = setInterval(() => {
                setDisplayText(() =>
                    text
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(timer);
                    setIsComplete(true);
                }

                iteration += 1 / 3;
            }, 30);
        };

        const delayTimer = setTimeout(startAnimation, delay * 1000);

        return () => {
            clearTimeout(delayTimer);
            clearInterval(timer);
        };
    }, [text, delay]);

    return (
        <motion.span
            className={`${className} inline-block`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {displayText}
            {!isComplete && (
                <span className="inline-block w-2 h-4 ml-1 bg-cyan-500 animate-pulse" />
            )}
        </motion.span>
    );
};
