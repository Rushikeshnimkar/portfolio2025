"use client";

import { useEffect, useRef } from "react";

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
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onClickRef = useRef(onClick);
    const prevChatOpenRef = useRef(isChatOpen);
    const prevInputVisibleRef = useRef(isInputVisible);

    // Keep the click ref up to date so the Clippy handler never goes stale
    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

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

    // Clippy renders itself into the DOM — no JSX needed
    return null;
};

export default ClippyAssistant;
