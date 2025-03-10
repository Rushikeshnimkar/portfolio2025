import React from "react";
import { motion } from "framer-motion";

interface AIChatAnimationProps {
  onAnimationComplete?: () => void;
  buttonPosition?: { x: number; y: number } | null;
}

export const AIChatAnimation: React.FC<AIChatAnimationProps> = ({
  onAnimationComplete,
  buttonPosition = null,
}) => {
  // Default position (bottom right) if no button position is provided
  const defaultPosition = {
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  };
  const startPosition = buttonPosition || defaultPosition;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      />

      <motion.div
        className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-lg w-full max-w-3xl mx-auto"
        initial={{
          position: "fixed",
          top: startPosition.y,
          left: startPosition.x,
          width: "50px",
          height: "50px",
          borderRadius: "25px",
          opacity: 0.5,
        }}
        animate={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          width: "100%",
          height: "auto",
          borderRadius: "16px",
          opacity: 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.4,
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {/* Placeholder content that fades in after the zoom animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="h-[500px] flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="text-white text-3xl font-bold"
            >
              AI
            </motion.div>
          </div>

          <motion.div
            className="text-lg font-medium text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            AI Assistant
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-2">
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AIChatAnimation;
