/* eslint-disable */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Send,
  Sparkles,
  Mail,
  FileText,
  LayoutTemplate,
  User,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { emailTemplates } from "@/components/tools/emailTemplates";
import { TextGenerationEffect } from "@/components/ui/TextGenerationEffect";

export default function Contact() {
  const [mode, setMode] = useState<"manual" | "ai">("ai");
  const [prompt, setPrompt] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTextAnimating, setIsTextAnimating] = useState(false);

  const handleGenerateEmail = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setEmailContent("");
    setIsTextAnimating(false);

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate email");

      const { generatedContent } = await response.json();
      setEmailContent(generatedContent);
      setIsTextAnimating(true);
    } catch (error) {
      console.error("Error generating email:", error);
      setStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (
      (!emailContent && mode === "ai") ||
      (!emailContent && !senderEmail && mode === "manual") ||
      isSending
    )
      return;

    setIsSending(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: emailContent,
          prompt: mode === "ai" ? prompt : "Manual Email",
          senderName: mode === "manual" ? senderName : undefined,
          senderEmail: mode === "manual" ? senderEmail : undefined,
          subject: subject,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setStatus("success");
      setPrompt("");
      setEmailContent("");
      setSenderName("");
      setSenderEmail("");
      setSubject("");
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send email"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectTemplate = (index: number) => {
    setSelectedTemplate(index);
    setPrompt(emailTemplates[index].prompt);
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen w-full  text-white relative">
   

      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-4xl md:text-6xl font-bold text-center"
          >
            Let&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
              Connect
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-center text-gray-400 max-w-2xl mx-auto"
          >
            Choose between AI-powered email generation or write your message
            manually
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex p-1 space-x-1 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            {["ai", "manual"].map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMode(m as "ai" | "manual");
                  setShowTemplates(false);
                }}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  mode === m
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {m === "ai" ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AI Assistant
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Manual Mode
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {mode === "ai" ? (
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 relative">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <span className="text-blue-400">💭</span> Customize Prompt
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5" />
                      Templates
                    </button>
                    <button
                      onClick={handleGenerateEmail}
                      disabled={isGenerating || !prompt.trim()}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isGenerating || !prompt.trim()
                          ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce" />
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-[350px] bg-gray-800/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Customize your email prompt..."
                  />

                  {selectedTemplate !== null && (
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-gray-400 bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span>
                        Using: {emailTemplates[selectedTemplate].title}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTemplate(null);
                          setPrompt("");
                        }}
                        className="text-gray-500 hover:text-gray-300"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Templates Overlay */}
                <AnimatePresence>
                  {showTemplates && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="absolute inset-0 z-10 bg-gray-900/95 backdrop-blur-sm rounded-2xl p-4 overflow-auto"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                          <span className="text-blue-400">📝</span> Email
                          Templates
                        </h2>
                        <button
                          onClick={() => setShowTemplates(false)}
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          Back to Prompt
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {emailTemplates.map((template, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSelectTemplate(index)}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.97 }}
                            className={`group p-3 rounded-xl ${
                              selectedTemplate === index
                                ? "bg-blue-500/20 border border-blue-500/50"
                                : "bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/50"
                            } transition-all duration-300 h-full`}
                          >
                            <div className="flex flex-col items-center text-center gap-2">
                              <motion.span
                                className="text-2xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  duration: 2,
                                  repeatDelay: 1,
                                }}
                              >
                                {template.icon}
                              </motion.span>
                              <div>
                                <h3 className="font-medium text-gray-200 group-hover:text-blue-400 transition-colors text-sm">
                                  {template.title}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-400" />
                  Your Details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Rushikesh Nimkar"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className=" text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Email Subject"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <span className="text-blue-400">📧</span>
                  {mode === "ai" ? "Generated Email" : "Your Message"}
                </h2>
                {(emailContent || (mode === "manual" && senderEmail)) && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSending
                        ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {isSending ? (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1 h-1 rounded-full bg-white/80 animate-bounce" />
                      </div>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="relative h-[350px] rounded-xl overflow-hidden border border-gray-700/50">
                {mode === "ai" ? (
                  <div className="absolute inset-0 w-full h-full bg-gray-800/10 px-3 py-2 text-white overflow-auto">
                    {emailContent ? (
                      isTextAnimating ? (
                        <TextGenerationEffect
                          text={emailContent}
                          className="text-sm"
                          speed="fast"
                          onComplete={() => setIsTextAnimating(false)}
                        />
                      ) : (
                        <div className="text-sm">
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-base font-bold text-blue-400 mt-3 mb-2"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-base font-bold text-blue-400 mt-3 mb-2"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-sm font-bold text-blue-400 mt-2 mb-1"
                                  {...props}
                                />
                              ),
                              h4: ({ node, ...props }) => (
                                <h4
                                  className="text-sm font-bold text-blue-400 mt-2 mb-1"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p className="text-sm mb-2" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="font-bold text-white"
                                  {...props}
                                />
                              ),
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-blue-400 hover:underline"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc pl-5 mb-2 text-sm"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal pl-5 mb-2 text-sm"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="mb-1" {...props} />
                              ),
                            }}
                          >
                            {emailContent}
                          </ReactMarkdown>
                        </div>
                      )
                    ) : (
                      <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="absolute inset-0 w-full h-full bg-gray-800/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        placeholder="Write your message..."
                      />
                    )}
                  </div>
                ) : (
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-gray-800/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    placeholder="Write your message..."
                  />
                )}
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-green-400 text-center text-xs">
                  ✅ Email sent successfully!
                </div>
              )}

              {status === "error" && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
