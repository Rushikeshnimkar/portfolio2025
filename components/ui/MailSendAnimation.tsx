"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Phase = "compose" | "seal" | "fly";

interface MailSendAnimationProps {
    active: boolean;
    onComplete?: () => void;
}

const PAPER = "#efe6d0";
const ENVELOPE = "#e8d7b5";
const ENVELOPE_DARK = "#d4c09a";
const INK = "#3a3226";
const SEAL = "#d4a656";
const SEAL_DEEP = "#a67c32";

export function MailSendAnimation({ active, onComplete }: MailSendAnimationProps) {
    const reduce = useReducedMotion();
    const [phase, setPhase] = useState<Phase>("compose");
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (!active) {
            setPhase("compose");
            return;
        }

        if (reduce) {
            const t = setTimeout(() => onCompleteRef.current?.(), 800);
            return () => clearTimeout(t);
        }

        const seal = setTimeout(() => setPhase("seal"), 900);
        const fly = setTimeout(() => setPhase("fly"), 1700);
        const done = setTimeout(() => onCompleteRef.current?.(), 3450);
        return () => {
            clearTimeout(seal);
            clearTimeout(fly);
            clearTimeout(done);
        };
    }, [active, reduce]);

    return (
        <AnimatePresence>
            {active && (
                <div className="fixed bottom-[118px] right-[28px] z-[70] pointer-events-none select-none">
                    <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.86, rotate: -4 }}
                        animate={
                            phase === "fly"
                                ? {
                                      x: [0, -72, -240, -520],
                                      y: [0, -110, -240, -420],
                                      rotate: [-2, -10, -14, -8],
                                      scale: [1, 1.04, 0.62, 0.12],
                                      opacity: [1, 1, 0.85, 0],
                                      filter: [
                                          "blur(0px)",
                                          "blur(0px)",
                                          "blur(1.5px)",
                                          "blur(6px)",
                                      ],
                                  }
                                : { opacity: 1, y: 0, scale: 1, rotate: -2 }
                        }
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={
                            phase === "fly"
                                ? {
                                      duration: 1.45,
                                      ease: [0.22, 1, 0.36, 1],
                                      times: [0, 0.22, 0.58, 1],
                                  }
                                : { type: "spring", stiffness: 280, damping: 22 }
                        }
                        style={{ perspective: 900, transformStyle: "preserve-3d" }}
                        className="relative w-[168px] h-[108px]"
                    >
                        <Envelope phase={phase} />
                    </motion.div>

                    {phase === "fly" && <LaunchTrail />}
                    {phase === "seal" && <StampBurst />}
                </div>
            )}
        </AnimatePresence>
    );
}

function Envelope({ phase }: { phase: Phase }) {
    const writing = phase === "compose";
    const sealed = phase !== "compose";

    return (
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            <div
                className="absolute -bottom-2 left-3 right-3 h-3 rounded-full blur-md"
                style={{ background: "rgba(0,0,0,0.45)" }}
            />

            <svg
                viewBox="0 0 168 108"
                className="absolute inset-0 w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
            >
                <defs>
                    <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ENVELOPE} />
                        <stop offset="100%" stopColor={ENVELOPE_DARK} />
                    </linearGradient>
                </defs>

                <path
                    d="M8 28 L84 72 L160 28 L160 98 Q160 104 154 104 L14 104 Q8 104 8 98 Z"
                    fill="url(#envBody)"
                />
                <path d="M8 28 L84 72 L8 98 Z" fill="#cbb58a" opacity="0.35" />
                <path d="M160 28 L84 72 L160 98 Z" fill="#cbb58a" opacity="0.22" />
                <text
                    x="84"
                    y="92"
                    textAnchor="middle"
                    fill="#6b5a3e"
                    fontSize="8"
                    fontFamily="IBM Plex Sans, sans-serif"
                    opacity="0.7"
                >
                    R. Nimkar
                </text>
            </svg>

            <motion.div
                className="absolute left-[18px] right-[18px] top-[10px] h-[78px] origin-bottom rounded-[2px] overflow-hidden z-[1]"
                style={{ background: PAPER, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
                initial={{ y: -46, opacity: 0 }}
                animate={
                    writing
                        ? { y: 0, opacity: 1, scale: 1 }
                        : { y: 22, opacity: 0, scale: 0.92 }
                }
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="px-3 pt-3 space-y-[7px]">
                    {[1, 0.86, 0.72, 0.5].map((w, i) => (
                        <motion.div
                            key={i}
                            className="h-[3px] rounded-full origin-left"
                            style={{ width: `${w * 100}%`, background: INK, opacity: 0.45 }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: writing ? 1 : 1 }}
                            transition={{ delay: 0.18 + i * 0.09, duration: 0.28 }}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="absolute left-0 right-0 top-0 h-[56px] z-[2]"
                style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
                initial={{ rotateX: 168 }}
                animate={{ rotateX: sealed ? 0 : 168 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: sealed ? 0 : 0 }}
            >
                <svg viewBox="0 0 168 56" className="w-full h-full">
                    <path d="M8 0 L84 52 L160 0 Z" fill="#ead7b0" />
                    <path d="M8 0 L84 52 L160 0" fill="none" stroke="#c4ae82" strokeWidth="0.6" />
                </svg>
            </motion.div>

            <motion.div
                className="absolute left-1/2 top-[42px] -ml-[13px] w-[26px] h-[26px] rounded-full z-[3]"
                style={{
                    background: `radial-gradient(circle at 35% 32%, #f0d089, ${SEAL} 55%, ${SEAL_DEEP})`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
                initial={{ scale: 0, y: -18 }}
                animate={sealed ? { scale: [0, 1.25, 1], y: 0 } : { scale: 0, y: -18 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="absolute inset-[5px] rounded-full border border-[#f4e0a8]/50" />
            </motion.div>
        </div>
    );
}

function StampBurst() {
    return (
        <motion.div
            className="absolute left-1/2 top-[52px] -ml-8 -mt-8 w-16 h-16 rounded-full border border-[#d4a656]/50"
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
        />
    );
}

function LaunchTrail() {
    return (
        <>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="absolute bottom-8 right-10 block w-1.5 h-1.5 rounded-full"
                    style={{ background: SEAL }}
                    initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
                    animate={{
                        opacity: 0,
                        x: -80 - i * 36,
                        y: -120 - i * 48,
                        scale: 0.2,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: i * 0.08,
                        ease: "easeOut",
                    }}
                />
            ))}
        </>
    );
}

export default MailSendAnimation;
