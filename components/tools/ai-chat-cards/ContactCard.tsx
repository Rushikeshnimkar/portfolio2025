import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
  phone?: string;
}

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => (
  <div className="mt-3 bg-neutral-800/70 rounded-lg p-4 border border-neutral-700/50">
    <div className="flex items-center gap-2 mb-3">
      <FaEnvelope className="text-yellow-400" />
      <h3 className="font-medium text-white">Contact Information</h3>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <FaEnvelope className="text-neutral-400" />
        <a
          href={`mailto:${contact.email}`}
          className="text-blue-400 hover:underline"
        >
          {contact.email}
        </a>
      </div>
      {contact.linkedin && (
        <div className="flex items-center gap-3">
          <FaLinkedin className="text-neutral-400" />
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            LinkedIn Profile
          </a>
        </div>
      )}
      {contact.github && (
        <div className="flex items-center gap-3">
          <FaGithub className="text-neutral-400" />
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub Profile
          </a>
        </div>
      )}
      {contact.phone && (
        <div className="flex items-center gap-3">
          <span className="text-neutral-400">📱</span>
          <span className="text-neutral-300">{contact.phone}</span>
        </div>
      )}
    </div>
  </div>
);

export default ContactCard;
