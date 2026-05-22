import React from "react";
import { motion } from "framer-motion";
import {
  FaLink,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaMedium,
  FaFileAlt,
  FaGlobe,
  FaCode,
  FaEnvelope,
} from "react-icons/fa";
import { SiDevdotto } from "react-icons/si";

export interface Link {
  title: string;
  url: string;
  description?: string;
  icon?: string; // Optional icon identifier
}

interface LinkCardProps {
  links: Link[];
}

export const LinkCard: React.FC<LinkCardProps> = ({ links }) => {
  // Function to safely extract domain from URL
  const extractDomain = (url: string): string => {
    try {
      const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
      return new URL(urlWithProtocol).hostname;
    } catch (error) {
      console.error("Error parsing URL:", url, error);
      return url;
    }
  };

  // Function to determine icon based on URL or specified icon
  const getIconForLink = (link: Link) => {
    if (link.icon) return link.icon;

    const url = link.url.toLowerCase();
    if (url.includes("github.com")) return "github";
    if (url.includes("linkedin.com")) return "linkedin";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("youtube.com")) return "youtube";
    if (url.includes("medium.com")) return "medium";
    if (url.includes("dev.to")) return "dev";
    if (url.includes("resume")) return "resume";
    if (url.includes("mailto:")) return "email";
    if (url.includes("ethglobal.com") || url.includes("dorahacks.io")) return "hackathon";
    if (url.includes("npmjs.com")) return "npm";

    try {
      const domain = extractDomain(url);
      if (domain.includes("www.rushikeshnimkar.com")) return "portfolio";
    } catch (error) {
      console.error("Error extracting domain:", error);
    }

    return "link";
  };

  // Render the appropriate icon component
  const renderIcon = (iconType: string) => {
    const iconClass = "text-white/50 group-hover:text-blue-400 w-4 h-4 transition-colors";
    switch (iconType) {
      case "github":
        return <FaGithub className={iconClass} />;
      case "linkedin":
        return <FaLinkedin className={iconClass} />;
      case "twitter":
        return <FaTwitter className={iconClass} />;
      case "youtube":
        return <FaYoutube className={iconClass} />;
      case "medium":
        return <FaMedium className={iconClass} />;
      case "dev":
        return <SiDevdotto className={iconClass} />;
      case "resume":
        return <FaFileAlt className={iconClass} />;
      case "portfolio":
        return <FaGlobe className={iconClass} />;
      case "hackathon":
        return <FaCode className={iconClass} />;
      case "npm":
        return <span className="text-[10px] text-white/50 group-hover:text-blue-400 font-bold transition-colors font-mono">NPM</span>;
      case "email":
        return <FaEnvelope className={iconClass} />;
      default:
        return <FaLink className={iconClass} />;
    }
  };

  const ensureProtocol = (url: string): string => {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("mailto:")
    ) {
      return url;
    }
    return `https://${url}`;
  };

  const groupLinksByCategory = () => {
    const groups: Record<string, Link[]> = {
      Profile: [],
      Projects: [],
      Social: [],
      Other: [],
    };

    links.forEach((link) => {
      const url = link.url.toLowerCase();
      if (
        url.includes("github.com") ||
        url.includes("linkedin.com") ||
        url.includes("resume") ||
        url.includes("www.rushikeshnimkar.com")
      ) {
        groups["Profile"].push(link);
      } else if (
        url.includes("ethglobal.com") ||
        url.includes("dorahacks.io") ||
        url.includes("npmjs.com")
      ) {
        groups["Projects"].push(link);
      } else if (
        url.includes("twitter.com") ||
        url.includes("medium.com") ||
        url.includes("dev.to") ||
        url.includes("youtube.com")
      ) {
        groups["Social"].push(link);
      } else {
        groups["Other"].push(link);
      }
    });

    return Object.entries(groups).filter(([_, categoryLinks]) => categoryLinks.length > 0);
  };

  const groupedLinks = groupLinksByCategory();

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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
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
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FaLink className="text-blue-400 w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">Links & Resources</h3>
            <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase">Reference Hub</span>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {groupedLinks.map(([category, categoryLinks]) => (
            <div key={category} className="space-y-2">
              {groupedLinks.length > 1 && (
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-400 border-b border-white/5 pb-1 font-mono uppercase tracking-wider">
                  {category}
                </h4>
              )}

              <div className="space-y-2">
                {categoryLinks.map((link, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <a
                      href={ensureProtocol(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div 
                        className="rounded-xl p-3 border border-white/5 transition-all duration-300 relative overflow-hidden group-hover:border-blue-500/30 group-hover:translate-x-1"
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                        }}
                      >
                        <div className="flex justify-between items-center gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                              {renderIcon(getIconForLink(link))}
                            </div>
                            <span className="font-semibold text-blue-400 group-hover:text-blue-300 transition-colors text-xs sm:text-sm truncate">
                              {link.title}
                            </span>
                          </div>
                          <FaExternalLinkAlt className="text-white/30 group-hover:text-blue-300 transition-colors w-3.5 h-3.5 flex-shrink-0" />
                        </div>

                        {link.description && (
                          <p className="mt-2 text-xs text-white/60 leading-relaxed font-light pl-11">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LinkCard;
