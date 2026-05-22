import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  discord?: string;
}

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  };

  return (
    <div className="mt-3 w-full">
      <div 
        className="rounded-2xl p-4 sm:p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border border-blue-500/20"
        style={{
          background: "rgba(10, 12, 18, 0.6)",
          boxShadow: "0 8px 32px 0 rgba(59, 130, 246, 0.05), inset 0 0 40px rgba(255, 255, 255, 0.01)",
        }}
      >
        {/* Subtle deep blue glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FaEnvelope className="text-blue-400 w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">Contact Information</h3>
            <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase">Direct Channels</span>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 sm:gap-4 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
              <FaEnvelope className="text-white/50 group-hover:text-blue-400 w-4 h-4 transition-colors" />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="text-white/70 hover:text-blue-400 transition-colors font-medium text-xs sm:text-sm truncate font-mono"
            >
              {contact.email}
            </a>
          </motion.div>

          {contact.linkedin && (
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 sm:gap-4 group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#0077b5]/10 group-hover:border-[#0077b5]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <FaLinkedin className="text-white/50 group-hover:text-[#0077b5] w-4 h-4 transition-colors" />
              </div>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-blue-400 transition-colors font-medium text-xs sm:text-sm font-mono"
              >
                LinkedIn
              </a>
            </motion.div>
          )}

          {contact.github && (
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 sm:gap-4 group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <FaGithub className="text-white/50 group-hover:text-white w-4 h-4 transition-colors" />
              </div>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-blue-400 transition-colors font-medium text-xs sm:text-sm font-mono"
              >
                GitHub
              </a>
            </motion.div>
          )}

          {contact.discord && (
            <motion.div 
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 sm:gap-4 group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#5865F2]/10 group-hover:border-[#5865F2]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <FaDiscord className="text-white/50 group-hover:text-[#5865F2] w-4 h-4 transition-colors" />
              </div>
              <a
                href={contact.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-blue-400 transition-colors font-medium text-xs sm:text-sm font-mono"
              >
                Discord
              </a>
            </motion.div>
          )}

          {contact.phone && (
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-3 sm:gap-4 group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-white/50 w-4 h-4 flex items-center justify-center text-xs sm:text-sm">📱</span>
              </div>
              <span className="text-white/70 font-medium text-xs sm:text-sm font-mono">{contact.phone}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactCard;
