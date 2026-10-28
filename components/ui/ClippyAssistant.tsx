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

    const positionBalloon = () => {
        const agent = agentRef.current;
        if (!agent) return;
        const balloon = agent._balloon;
        const balloonEl = balloon?._balloon as HTMLElement | undefined;
        const agentEl = agent._el as HTMLElement | undefined;
        if (!balloonEl || !agentEl) return;

        const clippyRect = agentEl.getBoundingClientRect();
        if (clippyRect.width === 0 && clippyRect.height === 0) {
            requestAnimationFrame(positionBalloon);
            return;
        }

        // Measure balloon dimensions even if it was display: none
        const prevDisplay = balloonEl.style.display;
        const wasHidden = prevDisplay === "none" || !prevDisplay;
        if (wasHidden) {
            balloonEl.style.visibility = "hidden";
            balloonEl.style.display = "block";
        }

        const bW = balloonEl.offsetWidth || 240;
        const bH = balloonEl.offsetHeight || 60;

        if (wasHidden) {
            balloonEl.style.display = prevDisplay;
            balloonEl.style.visibility = "";
        }

        const margin = 12;

        // Position vertically: prefer above Clippy, fallback to below if clipped at top
        let top = clippyRect.top - bH - margin;
        if (top < 10) {
            top = clippyRect.bottom + margin;
        }

        // Position horizontally: align to Clippy based on which half of viewport Clippy is on
        let left: number;
        const clippyCenter = clippyRect.left + clippyRect.width / 2;
        if (clippyCenter > window.innerWidth / 2) {
            left = clippyRect.right - bW;
        } else {
            left = clippyRect.left;
        }

        // Clamp to stay on screen
        const minLeft = 12;
        const maxLeft = Math.max(minLeft, window.innerWidth - bW - 12);
        left = Math.max(minLeft, Math.min(maxLeft, left));

        balloonEl.style.position = "fixed";
        balloonEl.style.top = `${Math.round(top)}px`;
        balloonEl.style.left = `${Math.round(left)}px`;
        balloonEl.style.bottom = "auto";
        balloonEl.style.right = "auto";
    };

    const styleBalloon = () => {
        const balloon = agentRef.current?._balloon;
        const el = balloon?._balloon as HTMLElement | undefined;
        const content = balloon?._content as HTMLElement | undefined;
        if (!el) return;

        el.setAttribute("data-clippy-balloon", "true");

        Object.assign(el.style, {
            background: "#161a24",
            color: "#e8edf4",
            border: "1px solid rgba(212,166,86,0.45)",
            borderRadius: "12px",
            padding: "10px 12px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            zIndex: "10001",
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
            balloon.reposition = positionBalloon;
            balloon._position = positionBalloon;
        }

        positionBalloon();
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
            positionBalloon();
            requestAnimationFrame(positionBalloon);
            return;
        }

        agent.speak(text);
        positionBalloon();
        requestAnimationFrame(positionBalloon);
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

                const el = agent._el as HTMLElement;
                if (el) {
                    el.style.position = "fixed";
                    el.style.bottom = "24px";
                    el.style.right = "24px";
                    el.style.top = "auto";
                    el.style.left = "auto";
                    el.style.zIndex = "60";
                    el.style.cursor = "pointer";

                    let downPos = { x: 0, y: 0 };
                    el.addEventListener("mousedown", (e: MouseEvent) => {
                        downPos = { x: e.clientX, y: e.clientY };
                    });

                    el.addEventListener("click", (e: MouseEvent) => {
                        e.stopPropagation();
                        const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
                        if (dist > 6) return; // Ignore drag operations
                        cue(randomPick(CLICK_ANIMATIONS));
                        onClickRef.current();
                    });
                }

                // If user drags Clippy, capture current pixel position before clearing bottom/right
                const origStartDrag = agent._startDrag?.bind(agent);
                if (origStartDrag) {
                    agent._startDrag = (e: MouseEvent) => {
                        if (el) {
                            const rect = el.getBoundingClientRect();
                            el.style.top = `${rect.top}px`;
                            el.style.left = `${rect.left}px`;
                            el.style.bottom = "auto";
                            el.style.right = "auto";
                            agent._targetX = rect.left;
                            agent._targetY = rect.top;
                        }
                        origStartDrag(e);
                    };
                }

                const origFinishDrag = agent._finishDrag?.bind(agent);
                if (origFinishDrag) {
                    agent._finishDrag = () => {
                        origFinishDrag();
                        positionBalloon();
                    };
                }

                agent.show(true);
                styleBalloon();

                window.addEventListener("resize", positionBalloon);
                window.addEventListener("scroll", positionBalloon, { passive: true });

                startIdleLoop();
                cue("Wave", "Hey! I'm Clippy! Click me to chat with Rushikesh's AI assistant!");
            } catch (err) {
                console.error("Failed to load Clippy:", err);
            }
        }

        init();

        return () => {
            disposed = true;
            window.removeEventListener("resize", positionBalloon);
            window.removeEventListener("scroll", positionBalloon);
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
