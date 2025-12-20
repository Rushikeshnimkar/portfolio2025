"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSend, IoClose, IoRefresh } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { predefinedPrompts } from "@/data/prompt-data";

interface UnifiedAIInputProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isLoading: boolean;
    isChatOpen: boolean;
    isInputVisible: boolean;
    buttonPosition: { right: number; bottom: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    themeHandlers: any;
    isThemeRequest: (text: string) => boolean;
}

export const UnifiedAIInput: React.FC<UnifiedAIInputProps> = ({
    input,
    setInput,
    onSubmit,
    onClose,
    isLoading,
    isChatOpen,
    isInputVisible,
    buttonPosition,
    themeHandlers,
    isThemeRequest,
}) => {
    const [windowWidth, setWindowWidth] = useState(0);
    const [isPromptPanelExpanded, setIsPromptPanelExpanded] = useState(false);
    const [showSlowLoadingMessage, setShowSlowLoadingMessage] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Timer for slow loading message and auto-close suggestions
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isLoading) {
            // Auto close suggestions when loading starts
            setIsPromptPanelExpanded(false);

            timer = setTimeout(() => {
                setShowSlowLoadingMessage(true);
            }, 10000); // Back to 10 seconds for production
        } else {
            setShowSlowLoadingMessage(false);
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Focus management
    useEffect(() => {
        if (isInputVisible || isChatOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 400); // Wait for animation
        }
    }, [isInputVisible, isChatOpen]);

    // Position calculations
    const buttonCenter = windowWidth - buttonPosition.right - 28;
    const screenCenter = windowWidth / 2;
    const startX = buttonCenter - screenCenter;

    // Determine max width (Responsive: Less padding on mobile)
    const padding = windowWidth < 768 ? 16 : 200; // Reduced padding on mobile
    // Subtract extra space for side buttons (approx 120px) when chat is open
    const sideButtonsWidth = isChatOpen ? 120 : 0;
    const maxInputWidth = Math.min(600, Math.max(200, windowWidth - padding - sideButtonsWidth));

    // Handle closing logic
    const handleClose = () => {
        setIsPromptPanelExpanded(false);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {(isInputVisible || isChatOpen) && (
                <>
                    {/* Backdrop for Input Only Phase (Optional) */}
                    {!isChatOpen && (
                        <motion.div
                            className="fixed inset-0 z-[55]"
                            onClick={handleClose}
                            style={{ cursor: "default" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}

                    <motion.div
                        className="fixed z-[60] flex flex-col items-center justify-center pointer-events-none"
                        style={{
                            left: "50%",
                            bottom: windowWidth < 768 ? 16 : buttonPosition.bottom,
                            transform: "translateX(-50%)",
                            width: "100%",
                            maxWidth: "100vw",
                        }}
                        // Keep wrapper alive while children animate
                        exit={{ transition: { duration: 0.3 } }}
                    >
                        {/* Slow Loading Message (Desktop - Relative to Input) */}
                        <AnimatePresence>
                            {showSlowLoadingMessage && windowWidth >= 768 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-neutral-900/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-white/70 shadow-lg pointer-events-none flex items-center gap-2 whitespace-nowrap z-[70]"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    Taking longer than usual...
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Suggestions Horizontal Chips (Only when enabled and chat is open and NOT loading) */}
                        <AnimatePresence>
                            {isPromptPanelExpanded && isChatOpen && !isLoading && !showSlowLoadingMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full mb-6 left-0 right-0 mx-auto px-4 w-full md:max-w-[800px] flex justify-center pointer-events-auto"
                                >
                                    <div
                                        className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-4 w-full justify-start items-center flex-nowrap mask-fade-edges"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        <button
                                            onClick={() => setIsPromptPanelExpanded(false)}
                                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5 flex-shrink-0 transition-colors"
                                            title="Close Suggestions"
                                        >
                                            <IoClose size={14} className="text-white/60" />
                                        </button>

                                        {predefinedPrompts.slice(0, 10).map((p, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                onClick={() => {
                                                    setInput(`${p.prefix} ${p.prompt}`);
                                                    setIsPromptPanelExpanded(false);
                                                    inputRef.current?.focus();
                                                }}
                                                className="px-4 py-2 bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-[#1a1d24]/90 rounded-full text-xs text-white/80 whitespace-nowrap transition-all shadow-lg hover:shadow-indigo-500/10"
                                            >
                                                <span className="opacity-50 mr-1">{p.icon}</span>
                                                {p.prompt}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Flex Container for Buttons + Pill */}
                        <motion.div
                            className="flex items-center justify-center gap-3 pointer-events-auto"
                            layout
                        >
                            {/* Side Buttons */}
                            <AnimatePresence>
                                {isChatOpen && (
                                    <motion.div
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                    >
                                        {/* Suggestions Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setIsPromptPanelExpanded(!isPromptPanelExpanded)}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border shadow-lg backdrop-blur-sm ${isPromptPanelExpanded
                                                ? "bg-white/20 text-white border-white/20"
                                                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                                                }`}
                                            title="Suggestions"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="9" y1="3" x2="9" y2="21"></line>
                                            </svg>
                                        </button>

                                        {/* Simplified Theme Toggle button without the sibling Reset button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const isTheme = isThemeRequest(input);
                                                setInput(isTheme ? input.replace(/^(theme:|search:)\s*/i, "").trim() : `Theme: ${input.replace(/^(theme:|search:)\s*/i, "").trim()}`);
                                                inputRef.current?.focus();
                                            }}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 border shadow-lg backdrop-blur-sm ${isThemeRequest(input)
                                                ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                                                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                                                }`}
                                            title="Toggle Theme Mode"
                                        >
                                            <span className="text-xl">🎨</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Input Pill */}
                            <motion.form
                                onSubmit={onSubmit}
                                className="flex items-center overflow-hidden"
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    backdropFilter: "blur(20px)",
                                    WebkitBackdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: `
                                        0 8px 32px rgba(0, 0, 0, 0.4),
                                        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                                        0 0 40px rgba(99, 102, 241, 0.15)
                                    `,
                                    height: 56,
                                }}
                                initial={{
                                    x: startX,
                                    width: 56,
                                    borderRadius: 28,
                                    opacity: 0.5
                                }}
                                animate={{
                                    x: 0,
                                    width: maxInputWidth,
                                    borderRadius: 28,
                                    opacity: 1
                                }}
                                exit={{
                                    x: startX, // Move back to right
                                    width: 56, // Shrink
                                    opacity: 0, // Fade out
                                    transition: { duration: 0.3, ease: "easeInOut" }
                                }}
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 200,
                                    mass: 1,
                                }}
                            >
                                <motion.div
                                    className="flex-1 flex items-center h-full px-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isThemeRequest(input) ? "Describe UI changes..." : "Ask me anything..."}
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-base md:text-lg text-white placeholder-white/40 focus:outline-none h-full px-2 md:px-4"
                                        style={{ caretColor: "rgba(99, 102, 241, 0.8)" }}
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 flex-shrink-0 mr-1 ${input.trim() && !isLoading
                                        ? "bg-white/10 text-white hover:bg-white/20"
                                        : "text-white/20 cursor-not-allowed"
                                        }`}
                                    whileHover={input.trim() && !isLoading ? { scale: 1.1 } : {}}
                                    whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
                                >
                                    {isLoading ? (
                                        <CgSpinner className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <IoSend className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    </motion.div>

                    {/* Slow Loading Message (Mobile - Bottom near input box) */}
                    <AnimatePresence>
                        {showSlowLoadingMessage && windowWidth < 768 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                                exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                                className="fixed bottom-[85px] left-1/2 bg-neutral-900/90 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full text-[10px] font-medium text-white/90 shadow-lg pointer-events-none flex items-center gap-2 whitespace-nowrap z-[100]"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                Taking longer than usual...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
};
