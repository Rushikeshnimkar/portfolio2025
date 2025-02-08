"use client";
import { motion } from "framer-motion";
import { useState } from "react";

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
    <div className="min-h-screen w-full bg-[#0A0A0B] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0B]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Connect</span>
          </h1>
          <p className="mt-6 text-xl text-center text-gray-400 max-w-2xl mx-auto">
            Choose between AI-powered email generation or write your message manually
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Mode Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 space-x-1 bg-gray-800/50 rounded-xl">
            {['ai', 'manual'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as 'ai' | 'manual')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === m 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {m === 'ai' ? '✨ AI Assistant' : '✍️ Manual Mode'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Templates & Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {mode === 'ai' ? (
              <>
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
                        className="group p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                              {template.title}
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
              </>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                  <span className="text-blue-400">👤</span> Your Details
                </h2>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Your email address"
                  />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Email subject"
                  />
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
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>Generate ✨</>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Column - Email Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
              <span className="text-blue-400">📧</span> 
              {mode === 'ai' ? 'Generated Email' : 'Your Message'}
            </h2>
            
            <div className="relative h-[600px] rounded-xl overflow-hidden border border-gray-700/50">
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="absolute inset-0 w-full h-full bg-gray-800/40 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                placeholder={mode === 'ai' ? "Your generated email will appear here..." : "Write your message..."}
              />
            </div>

            {/* Send Button & Status */}
            <div className="space-y-4">
              {(emailContent || (mode === 'manual' && senderEmail)) && (
                <button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium transition-all hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>Send Message 📤</>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}