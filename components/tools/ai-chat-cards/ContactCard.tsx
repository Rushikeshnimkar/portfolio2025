import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  discord?: string
}

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => (
  <div className="mt-3 bg-neutral-800/70 rounded-xl p-5 border border-neutral-700/50 shadow-lg backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-4 border-b border-neutral-700/50 pb-3">
      <div className="p-2 bg-yellow-400/10 rounded-lg">
        <FaEnvelope className="text-yellow-400 w-5 h-5" />
      </div>
      <h3 className="font-semibold text-white text-lg">Contact Information</h3>
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1">
        <div className="p-2 bg-neutral-700/50 rounded-lg group-hover:bg-neutral-700 transition-colors">
          <FaEnvelope className="text-neutral-400 w-4 h-4 group-hover:text-white transition-colors" />
        </div>
        <a
          href={`mailto:${contact.email}`}
          className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
        >
          {contact.email}
        </a>
      </div>

      {contact.linkedin && (
        <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1">
          <div className="p-2 bg-neutral-700/50 rounded-lg group-hover:bg-[#0077b5]/20 transition-colors">
            <FaLinkedin className="text-neutral-400 w-4 h-4 group-hover:text-[#0077b5] transition-colors" />
          </div>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
          >
            LinkedIn Profile
          </a>
        </div>
      )}

      {contact.github && (
        <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1">
          <div className="p-2 bg-neutral-700/50 rounded-lg group-hover:bg-white/10 transition-colors">
            <FaGithub className="text-neutral-400 w-4 h-4 group-hover:text-white transition-colors" />
          </div>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
          >
            GitHub Profile
          </a>
        </div>
      )}

      {contact.discord && (
        <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1">
          <div className="p-2 bg-neutral-700/50 rounded-lg group-hover:bg-[#5865F2]/20 transition-colors">
            <FaDiscord className="text-neutral-400 w-4 h-4 group-hover:text-[#5865F2] transition-colors" />
          </div>
          <a
            href={contact.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
          >
            Discord Server
          </a>
        </div>
      )}

      {contact.phone && (
        <div className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1">
          <div className="p-2 bg-neutral-700/50 rounded-lg group-hover:bg-green-500/20 transition-colors">
            <span className="text-neutral-400 w-4 h-4 flex items-center justify-center group-hover:text-green-400 transition-colors">📱</span>
          </div>
          <span className="text-neutral-300 font-medium">{contact.phone}</span>
        </div>
      )}
    </div>
  </div>
);

export default ContactCard;
