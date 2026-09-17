"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ClippyAssistantProps {
    onClick: () => void;
    isChatOpen: boolean;
    isInputVisible: boolean;
    isLoading: boolean;
    isUserTyping?: boolean;
    isSearching?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamicImportFromCDN(url: string): Promise<any> {
    const importFn = new Function("url", "return import(url)");
    return importFn(url);
}

const CDN_BASE = "https://cdn.jsdelivr.net/npm/clippyjs/dist";

const CLICK_ANIMATIONS = [
    "Wave",
    "GetAttention",
    "Congratulate",
    "Explain",
    "GestureUp",
    "GetTechy",
    "GetWizardy",
    "GetArtsy",
    "Hearing_1",
    "LookRight",
    "GestureRight",
];

const OPEN_CHAT_PHRASES = [
    "Let's chat! Ask me anything about Rushikesh! 💬",
    "I'm here to help! What would you like to know? 🤔",
    "Ready to assist! Fire away with your questions! 🔥",
    "Hey there! Let's explore Rushikesh's work together! 🚀",
    "At your service! What's on your mind? 📎",
];

const CLOSE_CHAT_PHRASES = [
    "See you later! Click me anytime! 👋",
    "Come back soon! I'll be waiting right here 📎",
    "Bye for now! I'll keep animating while you scroll 😄",
];

const IDLE_CLICK_PHRASES = [
    "Click me to open the AI chat! 💬",
    "Want to know something? Let's chat! 🧠",
    "I know a lot about Rushikesh! Try me! 😎",
    "Psst... I can answer questions about this portfolio! 📎",
    "Need help? That's literally what I'm here for! 🎯",
];

const TYPING_PHRASES = [
    "Taking notes… ✍️",
    "Got it, keep going!",
    "Hmm, interesting…",
];

const WRITING_PHRASES = [
    "Drafting a reply… 📝",
    "One sec, typing this out!",
    "Putting it into words…",
];

/** Real Clippy frames chained into little skits. */
const IDLE_SKITS: string[][] = [
    ["Writing"],
    ["Writing", "Explain"],
    ["LookLeft", "LookRight", "LookUp"],
    ["LookDownLeft", "LookDownRight", "Writing"],
    ["IdleFingerTap"],
    ["IdleHeadScratch", "Thinking"],
    ["IdleEyeBrowRaise", "Explain"],
    ["IdleSideToSide"],
    ["IdleRopePile"],
    ["IdleAtom"],
    ["IdleSnooze"],
    ["Idle1_1"],
    ["GetTechy"],
    ["GetWizardy"],
    ["GetArtsy"],
    ["CheckingSomething", "GestureUp"],
    ["Print"],
    ["Save"],
    ["EmptyTrash"],
    ["SendMail"],
    ["Hearing_1", "LookLeft"],
    ["Processing", "Thinking"],
    ["Searching"],
    ["Wave"],
    ["Congratulate"],
    ["GestureDown", "GestureUp"],
    ["LookUpLeft", "LookUpRight", "Wave"],
    ["Alert", "GetAttention"],
];

const LOADING_SKITS: string[][] = [
    ["Writing"],
    ["Writing", "Thinking"],
    ["Processing", "Writing"],
    ["Searching", "Writing"],
    ["GetTechy", "Writing"],
    ["CheckingSomething", "Writing"],
];

function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function playSafe(agent: { play: (name: string) => unknown; hasAnimation?: (name: string) => boolean }, name: string) {
    try {
        if (agent.hasAnimation && !agent.hasAnimation(name)) return false;
        agent.play(name);
        return true;
    } catch {
        return false;
    }
}

export const ClippyAssistant: React.FC<ClippyAssistantProps> = ({
    onClick,
    isChatOpen,
    isInputVisible,
    isLoading,
    isUserTyping = false,
    isSearching = false,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agentRef = useRef<any>(null);
    const [animationStage, setAnimationStage] = useState<"idle" | "packing" | "throwing" | "done">("idle");
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onClickRef = useRef(onClick);
    const prevChatOpenRef = useRef(isChatOpen);
    const prevInputVisibleRef = useRef(isInputVisible);
    const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const busyRef = useRef(false);
    const lastTypingSpeak = useRef(0);
    const wasWorkingRef = useRef(false);

    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    const clearIdleLoop = () => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
        if (skitTimerRef.current) {
            clearTimeout(skitTimerRef.current);
            skitTimerRef.current = null;
        }
    };

    const playSkit = (skit: string[]) => {
        const agent = agentRef.current;
        if (!agent) return;
        agent.stop();
        let i = 0;
        const step = () => {
            if (!agentRef.current) return;
            playSafe(agentRef.current, skit[i]);
            i += 1;
            if (i < skit.length) {
                skitTimerRef.current = setTimeout(step, 2200);
            }
        };
        step();
    };

    const scheduleIdle = () => {
        clearIdleLoop();
        if (busyRef.current) return;
        idleTimerRef.current = setTimeout(() => {
            if (!agentRef.current || busyRef.current) return;
            playSkit(randomPick(IDLE_SKITS));
            scheduleIdle();
        }, 3800 + Math.random() * 3200);
    };

    useEffect(() => {
        const handleMailSent = () => {
            if (!agentRef.current) return;
            const agent = agentRef.current;
            busyRef.current = true;
            animationTimersRef.current.forEach(clearTimeout);
            animationTimersRef.current = [];
            clearIdleLoop();

            agent.stop();
            playSafe(agent, "SendMail");
            agent.speak("Let's pack up this message! ✉️");
            setAnimationStage("packing");

            const throwingTimer = setTimeout(() => {
                setAnimationStage("throwing");
                agent.stop();
                playSafe(agent, "GestureLeft");
                agent.speak("Sending! Fly away! 🚀");
            }, 1500);
            animationTimersRef.current.push(throwingTimer);

            const doneTimer = setTimeout(() => {
                setAnimationStage("done");
                agent.stop();
                playSafe(agent, "Congratulate");
                agent.speak("Message sent successfully! 📧✨");

                const resetTimer = setTimeout(() => {
                    setAnimationStage("idle");
                    busyRef.current = false;
                    scheduleIdle();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                if (agent._animator && agent._animator._sounds) {
                    agent._animator._sounds = {};
                }

                agentRef.current = agent;
                agent.show();

                const el = agent._el as HTMLElement;
                if (el) {
                    el.style.position = "fixed";
                    el.style.bottom = "24px";
                    el.style.right = "24px";
                    el.style.top = "auto";
                    el.style.left = "auto";
                    el.style.zIndex = "60";
                    el.style.cursor = "pointer";

                    el.addEventListener("click", (e: MouseEvent) => {
                        e.stopPropagation();
                        agent.stop();
                        playSafe(agent, randomPick(CLICK_ANIMATIONS));
                        onClickRef.current();
                    });

                    el.addEventListener("mouseenter", () => {
                        if (busyRef.current) return;
                        playSafe(agent, randomPick(["GetAttention", "Wave", "LookUp", "Hearing_1"]));
                    });
                }

                playSafe(agent, "Greeting") || playSafe(agent, "Wave");
                agent.speak("Hey! I'm Clippy! Click me to chat with Rushikesh's AI assistant! 📎");
                scheduleIdle();
            } catch (err) {
                console.error("Failed to load Clippy:", err);
            }
        }

        init();

        return () => {
            disposed = true;
            clearIdleLoop();
            if (agentRef.current) {
                agentRef.current.dispose();
                agentRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // User is typing in the chat box → Clippy takes notes
    useEffect(() => {
        if (!agentRef.current) return;
        if (busyRef.current || isLoading) return;
        if (!isUserTyping) return;

        clearIdleLoop();
        const agent = agentRef.current;
        agent.stop();
        playSafe(agent, "Writing");
        const now = Date.now();
        if (now - lastTypingSpeak.current > 8000) {
            lastTypingSpeak.current = now;
            agent.speak(randomPick(TYPING_PHRASES));
        }
    }, [isUserTyping, isLoading]);

    // Resume idle after typing stops
    useEffect(() => {
        if (isUserTyping || isLoading || isSearching || busyRef.current) return;
        scheduleIdle();
        return () => clearIdleLoop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserTyping, isLoading, isSearching]);

    // AI is working → Clippy types / searches / thinks
    useEffect(() => {
        if (!agentRef.current) return;
        const agent = agentRef.current;

        if (isLoading || isSearching) {
            wasWorkingRef.current = true;
            busyRef.current = true;
            clearIdleLoop();
            agent.stop();
            playSkit(isSearching ? ["Searching"] : randomPick(LOADING_SKITS));
            agent.speak(isSearching ? "Digging through the archives…" : randomPick(WRITING_PHRASES));

            const loadingInterval = setInterval(() => {
                if (agentRef.current) {
                    playSkit(randomPick(LOADING_SKITS));
                }
            }, 3200);

            return () => {
                clearInterval(loadingInterval);
                busyRef.current = false;
            };
        }

        if (wasWorkingRef.current) {
            wasWorkingRef.current = false;
            agent.stop();
            playSafe(agent, "Congratulate");
            busyRef.current = false;
            if (!isUserTyping) scheduleIdle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isSearching]);

    useEffect(() => {
        if (!agentRef.current) return;
        const agent = agentRef.current;

        const wasChatOpen = prevChatOpenRef.current;
        const wasInputVisible = prevInputVisibleRef.current;

        if (isChatOpen && !wasChatOpen) {
            agent.stop();
            playSafe(agent, "Searching");
            agent.speak(randomPick(OPEN_CHAT_PHRASES));
        } else if (!isChatOpen && wasChatOpen) {
            agent.stop();
            playSafe(agent, "GoodBye") || playSafe(agent, "Wave");
            agent.speak(randomPick(CLOSE_CHAT_PHRASES));
        } else if (isInputVisible && !wasInputVisible && !isChatOpen) {
            agent.stop();
            playSafe(agent, "GetAttention");
            agent.speak(randomPick(IDLE_CLICK_PHRASES));
        } else if (!isInputVisible && wasInputVisible && !isChatOpen) {
            agent.stop();
            playSafe(agent, "Congratulate");
        }

        prevChatOpenRef.current = isChatOpen;
        prevInputVisibleRef.current = isInputVisible;
    }, [isChatOpen, isInputVisible]);

    // Look toward the cursor now and then
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!agentRef.current || busyRef.current || isUserTyping || isLoading) return;
            if (Math.random() > 0.015) return;
            const cx = window.innerWidth - 80;
            const cy = window.innerHeight - 80;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const name =
                Math.abs(dx) > Math.abs(dy)
                    ? dx < 0
                        ? "LookLeft"
                        : "LookRight"
                    : dy < 0
                      ? "LookUp"
                      : "LookDown";
            playSafe(agentRef.current, name);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [isUserTyping, isLoading]);

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
                        <div
                            className="absolute inset-0 bg-[#161925] border border-white/10 rounded-lg shadow-2xl z-[1]"
                            style={{
                                boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.15)",
                            }}
                        />

                        <motion.div
                            initial={{ y: -80, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay: 0.1,
                                duration: 0.6,
                                ease: "easeInOut",
                            }}
                            className="absolute left-2.5 right-2.5 top-1.5 bottom-1.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/30 rounded z-[2] p-2 flex flex-col gap-1.5 shadow-inner"
                        >
                            <div className="w-full h-1 bg-white/40 rounded animate-pulse" />
                            <div className="w-5/6 h-1 bg-white/30 rounded" />
                            <div className="w-2/3 h-1 bg-white/30 rounded" />
                            <div className="w-4/5 h-1 bg-white/20 rounded" />
                        </motion.div>

                        <div
                            className="absolute inset-0 z-[3] rounded-lg border-t border-white/5"
                            style={{
                                clipPath: "polygon(0 40%, 50% 100%, 100% 40%, 100% 100%, 0 100%)",
                                background:
                                    "linear-gradient(135deg, rgba(22, 25, 37, 0.95) 0%, rgba(13, 14, 21, 0.98) 100%)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                            }}
                        />

                        <motion.div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "35px",
                                transformOrigin: "top",
                                zIndex: 4,
                                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                                background: "rgba(27, 31, 51, 0.95)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                            initial={{ rotateX: 180 }}
                            animate={
                                animationStage === "packing"
                                    ? { rotateX: [180, 180, 0] }
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
