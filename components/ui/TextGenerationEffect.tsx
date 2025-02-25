"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextGenerationEffectProps {
  text: string;
  className?: string;
  once?: boolean;
  interval?: number;
  onComplete?: () => void;
  speed?: "slow" | "normal" | "fast" | "instant";
}

export const TextGenerationEffect: React.FC<TextGenerationEffectProps> = ({
  text,
  className = "",
  once = false,
  interval = 0.03,
  onComplete,
  speed = "normal",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Determine actual interval based on speed
  const actualInterval =
    speed === "instant"
      ? 0
      : speed === "fast"
      ? 0.005
      : speed === "slow"
      ? 0.05
      : interval;

  // For instant mode, we'll show chunks of text at once
  const chunkSize =
    speed === "instant" ? text.length : speed === "fast" ? 5 : 1;

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsGenerating(true);
    setHasStarted(false);
  }, [text]);

  useEffect(() => {
    if (!text || (once && hasStarted)) return;

    setHasStarted(true);

    // For instant mode, just set the full text immediately
    if (speed === "instant") {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsGenerating(false);
      if (onComplete) onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        // Add next chunk of characters
        const nextChunk = text.slice(
          currentIndex,
          Math.min(currentIndex + chunkSize, text.length)
        );
        setDisplayedText((prev) => prev + nextChunk);
        setCurrentIndex((prev) => Math.min(prev + chunkSize, text.length));
      } else {
        // Finished generating
        setIsGenerating(false);
        if (onComplete) onComplete();
      }
    }, actualInterval * 1000);

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    text,
    actualInterval,
    once,
    hasStarted,
    onComplete,
    speed,
    chunkSize,
  ]);

  // Split text into paragraphs
  const paragraphs = displayedText.split("\n").filter(Boolean);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Initial zoom effect for the container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <div className="relative">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={`p-${index}`}
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.4,
                delay: index * 0.1,
              }}
              className="mb-2"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Blinking cursor */}
          {isGenerating && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-[2px] h-[1.2em] bg-white ml-[1px] align-middle"
            />
          )}
        </div>
      </motion.div>

      {/* macOS-style dock reflection */}
      {isGenerating && speed !== "instant" && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.1, scaleY: 0.2 }}
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent blur-sm origin-bottom"
          style={{
            maskImage: "linear-gradient(to bottom, black 20%, transparent 80%)",
          }}
        />
      )}

      {/* macOS-style bounce effect on completion */}
      <AnimatePresence>
        {!isGenerating &&
          currentIndex === text.length &&
          speed !== "instant" && (
            <motion.div
              initial={{ scaleY: 1.1, y: -5 }}
              animate={{ scaleY: 1, y: 0 }}
              exit={{ scaleY: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
                mass: 1,
              }}
              className="absolute inset-0 pointer-events-none"
            />
          )}
      </AnimatePresence>

      {/* Subtle glow effect */}
      {isGenerating && speed !== "instant" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-md pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)",
          }}
        />
      )}
    </div>
  );
};
