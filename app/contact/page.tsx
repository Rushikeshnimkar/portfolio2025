"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Sparkles, Mail, User, FileText } from 'lucide-react';

export default function Contact() {
  const [mode, setMode] = useState<'manual' | 'ai'>('ai');
  const [prompt, setPrompt] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const emailTemplates = [
    {
      title: "Collaboration Proposal",
      icon: "🤝",
      description: "Reach out to discuss potential collaboration opportunities",
      prompt: "Write a professional email proposing a collaboration opportunity. I'm interested in working together on innovative web development projects and would like to discuss potential partnership opportunities.",
    },
    {
      title: "Hire Me",
      icon: "💼",
      description: "Send a recruitment inquiry as a tech recruiter",
      prompt: `Write a professional email as a tech recruiter reaching out to hire Rushikesh Nimkar. Include these details:

My name is [Your Name]
Position: Technical Recruiter
Company: [Company Name]
Email: [Your Email]
Location: [City, Country] (Remote/Hybrid/On-site)

Role Details:
- Position: Full Stack Developer
- Level: [Junior/Mid/Senior]
- Tech Stack: React, TypeScript, Node.js, Blockchain
- Salary Range: [Amount] per year
- Benefits: Health insurance, stock options, flexible hours, etc.

I've reviewed your portfolio projects (CryptoRage and GitSplit) and your experience with modern web technologies and blockchain development aligns perfectly with what we're looking for. Let's schedule a call to discuss this opportunity in detail.`,
    },
    {
      title: "Project Discussion",
      icon: "💡",
      description: "Discuss a potential project collaboration",
      prompt: "Write a professional email to discuss a potential project. I have an exciting web application idea and would like to explore the possibility of working together on its development.",
    },
  ];

  const handleGenerateEmail = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate email');
      
      const { generatedContent } = await response.json();
      setEmailContent(generatedContent);
    } catch (error) {
      console.error('Error generating email:', error);
      setStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if ((!emailContent && mode === 'ai') || (!emailContent && !senderEmail && mode === 'manual') || isSending) return;
    
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: emailContent,
          prompt: mode === 'ai' ? prompt : 'Manual Email',
          senderEmail: mode === 'manual' ? senderEmail : undefined,
          subject: subject,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');
      
      setStatus('success');
      setPrompt("");
      setEmailContent("");
      setSenderEmail("");
      setSubject("");
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-4xl md:text-6xl font-bold text-center"
          >
            Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Connect</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-center text-gray-400 max-w-2xl mx-auto"
          >
            Choose between AI-powered email generation or write your message manually
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {/* Mode Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1 space-x-1 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            {['ai', 'manual'].map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode(m as 'ai' | 'manual')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  mode === m 
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {m === 'ai' ? (
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {mode === 'ai' ? (
              <div className="space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                    <span className="text-blue-400">📝</span> Email Templates
                  </h2>
                  <div className="grid gap-3">
                    {emailTemplates.map((template, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setPrompt(template.prompt)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="group p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 w-full"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                              {template.title}
                              <motion.span
                                className="text-blue-400/50"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                →
                              </motion.span>
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                  <span className="text-blue-400">👤</span> Your Details
                </h2>
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Your email address"
                    />
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Email subject"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'ai' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                  <span className="text-blue-400">💭</span> Customize Prompt
                </h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-[200px] bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="Customize your email prompt..."
                />
                <button
                  onClick={handleGenerateEmail}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" />
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                <span className="text-blue-400">📧</span> 
                {mode === 'ai' ? 'Generated Email' : 'Your Message'}
              </h2>
              
              <div className="relative h-[600px] rounded-xl overflow-hidden border border-gray-700/50">
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-gray-800/10 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder={mode === 'ai' ? "Your generated email will appear here..." : "Write your message..."}
                />
              </div>

              {/* Send Button & Status */}
              <div className="space-y-4">
                {(emailContent || (mode === 'manual' && senderEmail)) && (
                  <button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                  >
                    {isSending ? (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" />
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                )}

                {status === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-center text-sm">
                    ✅ Email sent successfully!
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-center text-sm">
                    ❌ Something went wrong. Please try again.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}