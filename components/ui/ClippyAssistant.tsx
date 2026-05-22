"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClippyAssistantProps {
    onClick: () => void;
    isChatOpen: boolean;
    isInputVisible: boolean;
    isLoading: boolean;
}

/**
 * Loads an ES module from a URL using `new Function` to completely
 * bypass webpack's static analysis of `import()` expressions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamicImportFromCDN(url: string): Promise<any> {
    const importFn = new Function("url", "return import(url)");
    return importFn(url);
}

const CDN_BASE = "https://cdn.jsdelivr.net/npm/clippyjs/dist";

// Animations Clippy plays when clicked (randomly picked)
const CLICK_ANIMATIONS = [
    "Wave",
    "GetAttention",
    "Congratulate",
    "Explain",
    "GestureUp",
    "GetTechy",
    "LookRight",
];

// Phrases Clippy says when opening the chat
const OPEN_CHAT_PHRASES = [
    "Let's chat! Ask me anything about Rushikesh! 💬",
    "I'm here to help! What would you like to know? 🤔",
    "Ready to assist! Fire away with your questions! 🔥",
    "Hey there! Let's explore Rushikesh's work together! 🚀",
    "At your service! What's on your mind? 📎",
];

// Phrases Clippy says when closing the chat
const CLOSE_CHAT_PHRASES = [
    "See you later! Click me anytime! 👋",
    "Come back soon! I'll be waiting right here 📎",
    "Bye for now! I'll keep animating while you scroll 😄",
];

// Phrases for idle clicks (when chat is neither opening nor closing)
const IDLE_CLICK_PHRASES = [
    "Click me to open the AI chat! 💬",
    "Want to know something? Let's chat! 🧠",
    "I know a lot about Rushikesh! Try me! 😎",
    "Psst... I can answer questions about this portfolio! 📎",
    "Need help? That's literally what I'm here for! 🎯",
];

// Idle animations that play periodically
const IDLE_ANIMATIONS = [
    "IdleRopePile",
    "IdleAtom",
    "Idle1_1",
    "IdleEyeBrowRaise",
    "IdleFingerTap",
    "IdleHeadScratch",
    "IdleSideToSide",
    "IdleSnooze",
    "Thinking",
    "LookRight",
    "LookLeft",
    "LookUp",
    "LookDown",
    "Explain",
    "Writing",
    "CheckingSomething",
    "GetArtsy",
    "GetWizardy",
    "Hearing_1",
    "Wave",
    "GestureRight",
];

function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const ClippyAssistant: React.FC<ClippyAssistantProps> = ({
    onClick,
    isChatOpen,
    isInputVisible,
    isLoading,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agentRef = useRef<any>(null);
    const [animationStage, setAnimationStage] = useState<"idle" | "packing" | "throwing" | "done">("idle");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onClickRef = useRef(onClick);
    const prevChatOpenRef = useRef(isChatOpen);
    const prevInputVisibleRef = useRef(isInputVisible);
    const animationTimersRef = useRef<NodeJS.Timeout[]>([]);

    // Keep the click ref up to date so the Clippy handler never goes stale
    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    // Listen for custom email success events to play packing/throwing animation
    useEffect(() => {
        const handleMailSent = () => {
            if (!agentRef.current) return;
            const agent = agentRef.current;

            // Clear any active animation timers to prevent collisions
            animationTimersRef.current.forEach(clearTimeout);
            animationTimersRef.current = [];

            // Clear any active idle interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Phase A: Packing (starts immediately)
            agent.stop();
            agent.play("Explain");
            agent.speak("Let's pack up this message! ✉️");
            setAnimationStage("packing");

            // Phase B: Throwing (triggers after 1.5s - letter packed + flap closed)
            const throwingTimer = setTimeout(() => {
                setAnimationStage("throwing");
                agent.stop();
                agent.play("GestureLeft");
                agent.speak("Sending! Fly away! 🚀");
            }, 1500);
            animationTimersRef.current.push(throwingTimer);

            // Phase C: Celebration (triggers after throwing completes, at 3.3s total)
            const doneTimer = setTimeout(() => {
                setAnimationStage("done");
                agent.stop();
                agent.play("Congratulate");
                agent.speak("Message sent successfully! 📧✨");

                // Reset back to idle after celebrating (3 seconds of celebration)
                const resetTimer = setTimeout(() => {
                    setAnimationStage("idle");
                    // Restart standard idle cycle
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = setInterval(() => {
                        if (agentRef.current) {
                            agentRef.current.play(randomPick(IDLE_ANIMATIONS));
                        }
                    }, 6000 + Math.random() * 4000);
                }, 3000);
                animationTimersRef.current.push(resetTimer);
            }, 3300);
            animationTimersRef.current.push(doneTimer);
        };

        window.addEventListener("clippy-mail-sent", handleMailSent);
        return () => {
            window.removeEventListener("clippy-mail-sent", handleMailSent);
            animationTimersRef.current.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        let disposed = false;

        async function init() {
            try {
                const [main, agents] = await Promise.all([
                    dynamicImportFromCDN(`${CDN_BASE}/index.mjs`),
                    dynamicImportFromCDN(`${CDN_BASE}/agents/index.mjs`),
                ]);

                if (disposed) return;

                const agent = await main.initAgent(agents.Clippy);
                if (disposed) {
                    agent.dispose();
                    return;
                }

                // Disable all Clippy sounds
                if (agent._animator && agent._animator._sounds) {
                    agent._animator._sounds = {};
                }

                agentRef.current = agent;
                agent.show();

                // Position Clippy at bottom-right
                const el = agent._el as HTMLElement;
                if (el) {
                    el.style.position = "fixed";
                    el.style.bottom = "24px";
                    el.style.right = "24px";
                    el.style.top = "auto";
                    el.style.left = "auto";
                    el.style.zIndex = "60";
                    el.style.cursor = "pointer";

                    // Click Clippy → play a random animation + trigger the chat toggle
                    el.addEventListener("click", (e: MouseEvent) => {
                        e.stopPropagation();

                        // Play a random click animation
                        agent.stop();
                        const anim = randomPick(CLICK_ANIMATIONS);
                        agent.play(anim);

                        // Trigger the actual chat toggle
                        onClickRef.current();
                    });
                }

                // Varied idle animations every 6-10 seconds
                intervalRef.current = setInterval(() => {
                    if (agentRef.current) {
                        agentRef.current.play(randomPick(IDLE_ANIMATIONS));
                    }
                }, 6000 + Math.random() * 4000);

                // Grand entrance!
                agent.play("Wave");
                agent.speak("Hey! I'm Clippy! Click me to chat with Rushikesh's AI assistant! 📎");
            } catch (err) {
                console.error("Failed to load Clippy:", err);
            }
        }

        init();

        return () => {
            disposed = true;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (agentRef.current) {
                agentRef.current.dispose();
                agentRef.current = null;
            }
        };
    }, []);

    // Show reading/processing animation while AI is loading
    useEffect(() => {
        if (!agentRef.current) return;
        const agent = agentRef.current;

        if (isLoading) {
            agent.stop();
            agent.play("Processing");
            agent.speak("Let me think about that... 🤔");

            // Loop thinking animations while loading
            const thinkingAnims = ["Processing", "Thinking", "Searching", "GetTechy"];
            const loadingInterval = setInterval(() => {
                if (agentRef.current) {
                    agentRef.current.play(randomPick(thinkingAnims));
                }
            }, 3000);

            return () => clearInterval(loadingInterval);
        } else {
            // Loading just finished — celebrate!
            agent.stop();
            agent.play("Congratulate");
        }
    }, [isLoading]);

    // React to chat state changes with contextual animations + speech
    useEffect(() => {
        if (!agentRef.current) return;
        const agent = agentRef.current;

        const wasChatOpen = prevChatOpenRef.current;
        const wasInputVisible = prevInputVisibleRef.current;

        // Chat just opened
        if (isChatOpen && !wasChatOpen) {
            agent.stop();
            agent.play("Searching");
            agent.speak(randomPick(OPEN_CHAT_PHRASES));
        }
        // Chat just closed
        else if (!isChatOpen && wasChatOpen) {
            agent.stop();
            agent.play("Wave");
            agent.speak(randomPick(CLOSE_CHAT_PHRASES));
        }
        // Input bar just appeared (but chat not yet open)
        else if (isInputVisible && !wasInputVisible && !isChatOpen) {
            agent.stop();
            agent.play("GetAttention");
            agent.speak(randomPick(IDLE_CLICK_PHRASES));
        }
        // Input bar just closed (no chat open)
        else if (!isInputVisible && wasInputVisible && !isChatOpen) {
            agent.stop();
            agent.play("Congratulate");
        }

        prevChatOpenRef.current = isChatOpen;
        prevInputVisibleRef.current = isInputVisible;
    }, [isChatOpen, isInputVisible]);

    // Clippy renders itself into the DOM — no JSX needed for clippy, but we render our envelope overlay here
    return (
        <AnimatePresence>
            {animationStage !== "idle" && animationStage !== "done" && (
                <div className="fixed bottom-[120px] right-[40px] z-[70] pointer-events-none select-none">
                    <motion.div
                        style={{ perspective: 1000 }}
                        initial={
                            animationStage === "packing"
                                ? { opacity: 0, scale: 0.5, y: 50, rotate: 0 }
                                : {}
                        }
                        animate={
                            animationStage === "packing"
                                ? { opacity: 1, scale: 1, y: 0 }
                                : {
                                      // Parabolic gravity flight arc!
                                      x: [0, "-20vw", "-50vw", "-80vw", "-110vw"],
                                      y: [0, "-35vh", "-50vh", "-35vh", "10vh"],
                                      rotate: [0, 180, 360, 540, 720],
                                      scale: [1, 1.2, 0.8, 0.4, 0.1],
                                      opacity: [1, 1, 1, 0.8, 0],
                                  }
                        }
                        transition={
                            animationStage === "packing"
                                ? { type: "spring", stiffness: 200, damping: 15 }
                                : { duration: 1.8, ease: "easeOut" }
                        }
                        className="relative w-32 h-20"
                    >
                        {/* 1. Envelope Back */}
                        <div 
                            className="absolute inset-0 bg-[#161925] border border-white/10 rounded-lg shadow-2xl z-[1]"
                            style={{
                                boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.15)",
                            }}
                        />

                        {/* 2. The Letter Sheet */}
                        <motion.div
                            initial={{ y: -80, opacity: 0 }}
                            animate={
                                animationStage === "packing"
                                    ? { y: 0, opacity: 1 }
                                    : { y: 0, opacity: 1 }
                            }
                            transition={{
                                delay: 0.1,
                                duration: 0.6,
                                ease: "easeInOut",
                            }}
                            className="absolute left-2.5 right-2.5 top-1.5 bottom-1.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 rounded z-[2] p-2 flex flex-col gap-1.5 shadow-inner"
                        >
                            {/* Decorative simulated written lines */}
                            <div className="w-full h-1 bg-white/40 rounded animate-pulse" />
                            <div className="w-5/6 h-1 bg-white/30 rounded" />
                            <div className="w-2/3 h-1 bg-white/30 rounded" />
                            <div className="w-4/5 h-1 bg-white/20 rounded" />
                        </motion.div>

                        {/* 3. Envelope Front Pocket */}
                        <div
                            className="absolute inset-0 z-[3] rounded-lg border-t border-white/5"
                            style={{
                                clipPath: "polygon(0 40%, 50% 100%, 100% 40%, 100% 100%, 0 100%)",
                                background: "linear-gradient(135deg, rgba(22, 25, 37, 0.95) 0%, rgba(13, 14, 21, 0.98) 100%)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                        />

                        {/* 4. Folding Flap */}
                        <motion.div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "35px",
                                transformOrigin: "top",
                                zIndex: 4,
                                clipPath: "polygon(0 0, 50% 100%, 100% 0)", // Triangle pointing down
                                background: "rgba(27, 31, 51, 0.95)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                            initial={{ rotateX: 180 }} // Flapped back open
                            animate={
                                animationStage === "packing"
                                    ? { rotateX: [180, 180, 0] } // Folds forward to close envelope
                                    : { rotateX: 0 }
                            }
                            transition={{
                                duration: 1.2,
                                times: [0, 0.6, 1],
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ClippyAssistant;
