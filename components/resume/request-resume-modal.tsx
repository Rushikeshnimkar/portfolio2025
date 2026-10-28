"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiSend,
  FiCopy,
  FiCheck,
  FiBriefcase,
  FiFileText,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";

interface RequestResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function RequestResumeModal({
  isOpen,
  onClose,
  email = "rushikeshnimkar396@gmail.com",
}: RequestResumeModalProps) {
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setEmailError("");
      setErrorMessage("");
      setSentSuccess(false);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const triggerMailto = () => {
    const subject = encodeURIComponent(
      `Resume Request${companyName ? ` - ${companyName}` : ""}`
    );
    const body = encodeURIComponent(
      `Hi Rushikesh,\n\nI visited your portfolio and would like to request your updated resume.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Send Resume To: ${requesterEmail.trim() || "[Your Email Here]"}\n` +
      `${requesterName ? `• Requester Name: ${requesterName.trim()}\n` : ""}` +
      `${companyName ? `• Company / Organization: ${companyName.trim()}\n` : ""}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `• Description / Notes:\n${description.trim() || "No additional description provided."}\n\n` +
      `Looking forward to hearing from you!\n`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requesterEmail.trim()) {
      setEmailError("Please enter your email so Rushikesh knows where to send his resume.");
      return;
    }

    if (!validateEmail(requesterEmail)) {
      setEmailError("Please enter a valid email address (e.g. name@company.com).");
      return;
    }

    setEmailError("");
    setErrorMessage("");
    setIsSending(true);

    const emailSubject = `New Resume Request from ${requesterEmail.trim()}${
      companyName.trim() ? ` (${companyName.trim()})` : ""
    }`;

    const emailContent = `Hello Rushikesh,\n\nA visitor has requested your updated resume from your portfolio.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Requester Email: ${requesterEmail.trim()}\n` +
      `${requesterName.trim() ? `• Requester Name: ${requesterName.trim()}\n` : ""}` +
      `${companyName.trim() ? `• Company / Organization: ${companyName.trim()}\n` : ""}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `• Description / Message from Requester:\n` +
      `${description.trim() ? description.trim() : "No additional description provided."}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Action: Reply to this email or send your updated resume directly to: ${requesterEmail.trim()}`;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: emailContent,
          prompt: "Resume Request",
          senderName: requesterName.trim() || requesterEmail.trim(),
          senderEmail: requesterEmail.trim(),
          subject: emailSubject,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSentSuccess(true);
        // Trigger portfolio flying envelope animation if available
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("clippy-mail-sent"));
        }
      } else {
        setErrorMessage(
          data.error || "Unable to send via contact API. You can still send directly via mail client."
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setErrorMessage(`${msg}. You can send directly using your mail app.`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-neutral-900/95 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden z-10 text-white max-h-[90vh] overflow-y-auto"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            {sentSuccess ? (
              /* Success View */
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <FiCheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Request Sent to Rushikesh!
                </h3>
                <p className="text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Rushikesh has received your email with your details and description, and will send his updated resume to{" "}
                  <span className="text-blue-400 font-medium font-mono">{requesterEmail}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm transition-all shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Request Form View */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-blue-500/30 flex items-center justify-center shadow-inner flex-shrink-0">
                    <FiFileText className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent">
                      Request New Resume
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Enter your email and any description so Rushikesh can send his resume to you.
                    </p>
                  </div>
                </div>

                {/* Requester's Email (Required) */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Your Email Address <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={requesterEmail}
                      onChange={(e) => {
                        setRequesterEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="e.g. recruiter@company.com or name@gmail.com"
                      className={`w-full pl-9 pr-3 py-2.5 bg-neutral-950/70 border rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors ${
                        emailError
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-neutral-800 focus:border-blue-500/80"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                {/* Name & Company (Optional side-by-side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Your Name <span className="text-neutral-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
                      <input
                        type="text"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full pl-8 pr-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Company / Team <span className="text-neutral-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full pl-8 pr-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Description / Message */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Description or Message <span className="text-neutral-500">(Optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Please send your updated resume for our team. We'd love to see your latest work and experience."
                    className="w-full px-3 py-2.5 bg-neutral-950/60 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500/60 transition-colors resize-none"
                  />
                </div>

                {/* Optional Error Alert */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2">
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <div className="flex-1">
                      <p>{errorMessage}</p>
                      <button
                        type="button"
                        onClick={triggerMailto}
                        className="mt-1.5 text-blue-400 hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Open Mail App to send directly</span>
                        <FiExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2 border-t border-neutral-800/60">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 group"
                    >
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending to Rushikesh...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          <span>Send Resume Request</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-4 h-4 text-neutral-400" />
                          <span>Copy Direct Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mailto fallback button */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <span>Prefer default mail app?</span>
                    <button
                      type="button"
                      onClick={triggerMailto}
                      className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Open in Mail App</span>
                      <FiExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Direct Email Display */}
                <p className="text-[11px] text-neutral-500 text-center mt-2">
                  Rushikesh will receive your request directly at <span className="text-neutral-400 font-mono">{email}</span>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
