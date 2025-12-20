"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaStop } from "react-icons/fa";

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isDisabled?: boolean;
}

// Extend Window interface for webkitSpeechRecognition
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        webkitSpeechRecognition: any;
    }
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
    onTranscript,
    isDisabled = false,
}) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [transcript, setTranscript] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if Web Speech API is supported
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setIsSupported(false);
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                let finalTranscript = "";
                let interimTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const currentTranscript = finalTranscript || interimTranscript;
                setTranscript(currentTranscript);

                if (finalTranscript) {
                    onTranscript(finalTranscript);
                }
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onTranscript]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setTranscript("");
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript("");
        }
    };

    if (!isSupported) {
        return null; // Don't show button if not supported
    }

    return (
        <div className="relative">
            {/* Voice Button */}
            <motion.button
                type="button"
                onClick={toggleListening}
                disabled={isDisabled}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center
                   ${isListening
                        ? "bg-gradient-to-r from-[var(--pink)] to-[var(--fuchsia)] text-white shadow-lg"
                        : "bg-[var(--navy-light)] text-[var(--gray-400)] hover:text-white border border-[var(--cyan)]/20 hover:border-[var(--cyan)]/40"
                    }
                   ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                   `}
                style={isListening ? { boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" } : {}}
            >
                {/* Pulsing ring animation when listening */}
                <AnimatePresence>
                    {isListening && (
                        <>
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 rounded-xl bg-[var(--pink)]"
                            />
                            <motion.div
                                initial={{ scale: 1, opacity: 0.3 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                className="absolute inset-0 rounded-xl bg-[var(--fuchsia)]"
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Icon */}
                <span className="relative z-10">
                    {isListening ? (
                        <FaStop className="w-4 h-4" />
                    ) : (
                        <FaMicrophone className="w-4 h-4" />
                    )}
                </span>
            </motion.button>

            {/* Listening indicator with transcript */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-2 right-0 w-64 p-3 rounded-xl 
                       bg-[var(--navy-medium)] border border-[var(--pink)]/30 
                       shadow-xl z-50"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {/* Voice wave animation */}
                            <div className="flex items-center gap-0.5 h-4">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-gradient-to-t from-[var(--pink)] to-[var(--cyan)] rounded-full"
                                        animate={{
                                            height: ["8px", "16px", "8px"],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-[var(--pink-light)] font-medium">Listening...</span>
                        </div>

                        {transcript && (
                            <p className="text-sm text-[var(--gray-200)] italic">
                                &ldquo;{transcript}&rdquo;
                            </p>
                        )}

                        {!transcript && (
                            <p className="text-xs text-[var(--gray-500)]">
                                Speak your question...
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceInput;
