"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { sendEmail } from "@/lib/actions/sendEmail";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendEmail(formData);
      setSubmitStatus('success');
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/0" />

      <div className="relative z-10 h-full">
        <main className="container mx-auto px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500">
              Get in Touch
            </h1>
            <p className="text-neutral-400 mt-3 sm:mt-4 text-base sm:text-lg">
              Have a question or want to work together?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto px-4"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-base rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-base rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-neutral-300 mb-1.5 sm:mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-neutral-900/50 border border-neutral-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex justify-center pt-2 sm:pt-4"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full 
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white text-sm sm:text-base font-medium 
                    hover:opacity-90 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    min-w-[140px] sm:min-w-[160px] flex items-center justify-center
                    overflow-hidden
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Sending</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{
                              y: ["0%", "-50%", "0%"],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{
                              y: ["0%", "-50%", "0%"],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.2,
                            }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{
                              y: ["0%", "-50%", "0%"],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.4,
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      {submitStatus === 'success' && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </span>
                  )}
                </button>
              </motion.div>

              {/* Status Messages */}
              <div className="h-6 mt-2 sm:mt-4">
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center text-green-500 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>Message sent successfully!</span>
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center text-red-500 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>Failed to send message. Please try again.</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}