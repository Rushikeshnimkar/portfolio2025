"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPaperPlane, FaCheck, FaSpinner, FaMagic, FaEdit } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

interface EmailComposeCardProps {
    onClose?: () => void;
    initialSubject?: string;
    initialMessage?: string;
    context?: string; // Context from chat to help generate email
}

export const EmailComposeCard: React.FC<EmailComposeCardProps> = ({
    onClose,
    initialSubject = "",
    initialMessage = "",
    context = ""
}) => {
    const [formData, setFormData] = useState({
        senderName: "",
        senderEmail: "",
        subject: initialSubject,
        message: initialMessage,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showGeneratePrompt, setShowGeneratePrompt] = useState(!initialMessage);
    const [generatePrompt, setGeneratePrompt] = useState("");

    useEffect(() => {
        if (initialSubject) setFormData(prev => ({ ...prev, subject: initialSubject }));
        if (initialMessage) setFormData(prev => ({ ...prev, message: initialMessage }));
    }, [initialSubject, initialMessage]);

    const handleGenerateEmail = async () => {
        if (!generatePrompt.trim()) return;

        setIsGenerating(true);
        setError("");

        try {
            // Use the chat API to generate an email draft
            const response = await fetch("/api/generate-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: generatePrompt,
                    context: context,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate email");
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                subject: data.subject || `Regarding: ${generatePrompt.substring(0, 30)}...`,
                message: data.content || "",
            }));
            setShowGeneratePrompt(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate email");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderName: formData.senderName,
                    senderEmail: formData.senderEmail,
                    subject: formData.subject,
                    content: formData.message,
                    prompt: `Email from ${formData.senderName}`,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to send email");
            }

            setIsSuccess(true);
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send email");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-xl p-6 border border-[var(--cyan)]/15 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--teal)] to-[var(--cyan)] rounded-full flex items-center justify-center shadow-lg"
                    style={{ boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)" }}
                >
                    <FaCheck className="text-white w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
                <p className="text-[var(--gray-400)]">Rushikesh will get back to you soon.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="glass-card rounded-xl p-5 border border-[var(--cyan)]/15">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b border-[var(--cyan)]/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] rounded-xl shadow-lg">
                            <FaEnvelope className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg">Send an Email</h3>
                            <p className="text-xs text-[var(--gray-400)]">AI can help you draft the perfect message</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/20">
                        <HiSparkles className="w-4 h-4 text-[var(--cyan)]" />
                    </div>
                </div>

                {/* AI Generate Section */}
                <AnimatePresence>
                    {showGeneratePrompt && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 overflow-hidden"
                        >
                            <div className="p-4 bg-gradient-to-br from-[var(--cyan)]/10 to-[var(--purple)]/10 rounded-xl border border-[var(--cyan)]/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiSparkles className="text-[var(--cyan)] w-4 h-4" />
                                    <span className="text-sm font-medium text-white">AI Email Generator</span>
                                </div>
                                <p className="text-xs text-[var(--gray-400)] mb-3">
                                    Describe what you want to say and I&apos;ll draft it for you
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={generatePrompt}
                                        onChange={(e) => setGeneratePrompt(e.target.value)}
                                        placeholder="e.g., I want to discuss a job opportunity..."
                                        className="flex-1 chat-input rounded-lg px-3 py-2 text-white text-sm"
                                        onKeyDown={(e) => e.key === "Enter" && handleGenerateEmail()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateEmail}
                                        disabled={isGenerating || !generatePrompt.trim()}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[var(--cyan)]/20 transition-all"
                                    >
                                        {isGenerating ? (
                                            <FaSpinner className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <FaMagic className="w-4 h-4" />
                                        )}
                                        <span>Generate</span>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowGeneratePrompt(false)}
                                    className="mt-2 text-xs text-[var(--gray-400)] hover:text-white transition-colors"
                                >
                                    Or write manually →
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--gray-400)] mb-1.5">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.senderName}
                                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                className="w-full chat-input rounded-lg px-3 py-2.5 text-white text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--gray-400)] mb-1.5">Your Email</label>
                            <input
                                type="email"
                                required
                                value={formData.senderEmail}
                                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                className="w-full chat-input rounded-lg px-3 py-2.5 text-white text-sm"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm text-[var(--gray-400)]">Subject</label>
                            {formData.message && !showGeneratePrompt && (
                                <button
                                    type="button"
                                    onClick={() => setShowGeneratePrompt(true)}
                                    className="text-xs text-[var(--cyan)] hover:text-[var(--cyan-light)] flex items-center gap-1 transition-colors"
                                >
                                    <FaMagic className="w-3 h-3" />
                                    Regenerate with AI
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full chat-input rounded-lg px-3 py-2.5 text-white text-sm"
                            placeholder="What's this about?"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm text-[var(--gray-400)]">Message</label>
                            <span className="text-xs text-[var(--gray-500)] flex items-center gap-1">
                                <FaEdit className="w-3 h-3" />
                                You can edit this
                            </span>
                        </div>
                        <textarea
                            required
                            rows={6}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full chat-input rounded-lg px-3 py-2.5 text-white text-sm resize-none"
                            placeholder="Write your message here..."
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] text-white font-medium hover:shadow-lg hover:shadow-[var(--cyan)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="w-4 h-4 animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <FaPaperPlane className="w-4 h-4" />
                                <span>Send Email</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default EmailComposeCard;
