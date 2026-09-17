"use client";
import { FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-ocean-aqua/15 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a
              href="https://github.com/Rushikeshnimkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-mist hover:text-ocean-aqua hover:text-glow transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-mist hover:text-ocean-aqua hover:text-glow transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com/RushikeshNimkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-mist hover:text-ocean-aqua hover:text-glow transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://discord.com/users/748192618659315753"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-mist hover:text-ocean-aqua hover:text-glow transition-colors"
            >
              <FaDiscord size={24} />
            </a>
          </div>

          <div className="text-ocean-mist/70 text-sm">
            <p>© {currentYear} Rushikesh Nimkar</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
