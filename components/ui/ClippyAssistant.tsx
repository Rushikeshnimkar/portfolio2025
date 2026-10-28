"use client";

import { useEffect, useRef, useState } from "react";
import { MailSendAnimation } from "./MailSendAnimation";

interface ClippyAssistantProps {
    onClick: () => void;
    isChatOpen: boolean;
    isInputVisible: boolean;
    isLoading: boolean;
    error?: string;
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
    "Explain",
    "GestureUp",
    "GetTechy",
    "LookRight",
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
    "GetArtsy",
    "GetWizardy",
    "Hearing_1",
    "Wave",
    "GestureRight",
];

function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function stripHtml(value: string): string {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export const ClippyAssistant: React.FC<ClippyAssistantProps> = ({
    onClick,
    isChatOpen,
    isInputVisible,
    isLoading,
    error,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const agentRef = useRef<any>(null);
    const [mailSending, setMailSending] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onClickRef = useRef(onClick);
    const prevChatOpenRef = useRef(isChatOpen);
    const prevInputVisibleRef = useRef(isInputVisible);
    const animationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const playingRef = useRef(false);
    const lastErrorRef = useRef("");

    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    const clearAnimTimers = () => {
        animationTimersRef.current.forEach(clearTimeout);
        animationTimersRef.current = [];
    };

    const styleBalloon = () => {
        const balloon = agentRef.current?._balloon;
        const el = balloon?._balloon as HTMLElement | undefined;
        const content = balloon?._content as HTMLElement | undefined;
        if (!el) return;

        Object.assign(el.style, {
            background: "#161a24",
            color: "#e8edf4",
            border: "1px solid rgba(212,166,86,0.45)",
            borderRadius: "12px",
            padding: "10px 12px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            zIndex: "80",
            maxWidth: "min(280px, calc(100vw - 32px))",
            fontFamily: "IBM Plex Sans, system-ui, sans-serif",
            pointerEvents: "none",
        });

        if (content) {
            content.style.maxWidth = "260px";
            content.style.minWidth = "120px";
            content.style.fontSize = "13px";
            content.style.lineHeight = "1.45";
            content.style.whiteSpace = "pre-wrap";
            content.style.overflowWrap = "anywhere";
            content.style.wordBreak = "break-word";
        }

        if (balloon) {
            balloon.WORD_SPEAK_TIME = 35;
            balloon.CLOSE_BALLOON_DELAY = 4200;
        }
    };

    const cancelBalloonHide = () => {
        const balloon = agentRef.current?._balloon;
        if (!balloon) return;
        if (balloon._hiding) {
            clearTimeout(balloon._hiding);
            balloon._hiding = null;
        }
        if (balloon._loop) {
            clearTimeout(balloon._loop);
            balloon._loop = null;
        }
        balloon._hidden = false;
        balloon._active = false;
        balloon._hold = false;
    };

    const speakNow = (text: string) => {
        const agent = agentRef.current;
        if (!agent || !text) return;
        const balloon = agent._balloon;
        styleBalloon();
        cancelBalloonHide();

        if (balloon?.speak) {
            balloon.speak(() => {}, text, false);
            requestAnimationFrame(() => balloon.reposition?.());
            return;
        }

        agent.speak(text);
    };

    const playWhenFree = (name: string, onDone?: () => void) => {
        const agent = agentRef.current;
        if (!agent) return;
        playingRef.current = true;

        const finished = () => {
            playingRef.current = false;
            onDone?.();
        };

        try {
            // timeout 0: don't let clippyjs's 5s default kill a finite clip,
            // and don't leave a stray exitAnimation() timer that cuts the next one.
            const ok = agent.play(name, 0, finished);
            if (ok === false) {
                finished();
                return;
            }
        } catch {
            finished();
            return;
        }

        // Idle* loops never fire EXITED. Nudge them out so idle doesn't deadlock.
        if (/^Idle/i.test(name)) {
            const t = setTimeout(() => {
                try {
                    agent._animator?.exitAnimation?.();
                } catch {
                    playingRef.current = false;
                }
            }, 8000);
            animationTimersRef.current.push(t);
        }
    };

    const cue = (anim: string, text?: string) => {
        const agent = agentRef.current;
        if (!agent) return;
        agent.stop();
        playingRef.current = false;
        cancelBalloonHide();
        playWhenFree(anim);
        if (text) speakNow(text);
    };

    const startIdleLoop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (agentRef.current && !playingRef.current) {
                playWhenFree(randomPick(IDLE_ANIMATIONS));
            }
        }, 8000);
    };

    useEffect(() => {
        const handleMailSent = () => {
            if (!agentRef.current) return;

            clearAnimTimers();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            setMailSending(true);
            cue("Writing", "Sealing this up…");

            const flyTimer = setTimeout(() => {
                cue("GestureUp", "And… sent.");
            }, 1700);
            animationTimersRef.current.push(flyTimer);
        };

        window.addEventListener("clippy-mail-sent", handleMailSent);
        return () => {
            window.removeEventListener("clippy-mail-sent", handleMailSent);
            clearAnimTimers();
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
                styleBalloon();

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
                        cue(randomPick(CLICK_ANIMATIONS));
                        onClickRef.current();
                    });
                }

                startIdleLoop();
                cue("Wave", "Hey! I'm Clippy! Click me to chat with Rushikesh's AI assistant!");
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
            clearAnimTimers();
            if (agentRef.current) {
                agentRef.current.dispose();
                agentRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!agentRef.current) return;

        if (isLoading) {
            cue("Writing", "Let me think about that...");

            const thinkingAnims = ["Writing", "Thinking", "Searching"];
            const loadingInterval = setInterval(() => {
                if (agentRef.current && !playingRef.current) {
                    playWhenFree(randomPick(thinkingAnims));
                }
            }, 5000);

            return () => clearInterval(loadingInterval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    useEffect(() => {
        if (!agentRef.current) return;

        const wasChatOpen = prevChatOpenRef.current;
        const wasInputVisible = prevInputVisibleRef.current;

        if (isChatOpen && !wasChatOpen) {
            cue("Searching", randomPick(OPEN_CHAT_PHRASES));
        } else if (!isChatOpen && wasChatOpen) {
            cue("Wave", randomPick(CLOSE_CHAT_PHRASES));
        } else if (isInputVisible && !wasInputVisible && !isChatOpen) {
            cue("GetAttention", randomPick(IDLE_CLICK_PHRASES));
        } else if (!isInputVisible && wasInputVisible && !isChatOpen) {
            cue("Wave");
        }

        prevChatOpenRef.current = isChatOpen;
        prevInputVisibleRef.current = isInputVisible;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChatOpen, isInputVisible]);

    useEffect(() => {
        if (!agentRef.current) return;
        const plain = error ? stripHtml(error) : "";
        if (!plain || plain === lastErrorRef.current) return;
        lastErrorRef.current = plain;
        cue("GetAttention", plain.slice(0, 220));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    return (
        <MailSendAnimation
            active={mailSending}
            onComplete={() => {
                setMailSending(false);
                cue("Congratulate", "It's on its way.");
                const t = setTimeout(() => startIdleLoop(), 2200);
                animationTimersRef.current.push(t);
            }}
        />
    );
};

export default ClippyAssistant;
