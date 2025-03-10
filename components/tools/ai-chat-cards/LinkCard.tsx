import React from "react";
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
      // Add protocol if missing
      const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;
      return new URL(urlWithProtocol).hostname;
    } catch (error) {
      // If URL parsing fails, just return the original URL
      console.error("Error parsing URL:", url, error);
      return url;
    }
  };

  // Function to determine icon based on URL or specified icon
  const getIconForLink = (link: Link) => {
    // If an icon is specified, use it
    if (link.icon) {
      return link.icon;
    }

    // Otherwise determine icon based on URL
    const url = link.url.toLowerCase();

    // Direct string matching for common patterns
    if (url.includes("github.com")) return "github";
    if (url.includes("linkedin.com")) return "linkedin";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("youtube.com")) return "youtube";
    if (url.includes("medium.com")) return "medium";
    if (url.includes("dev.to")) return "dev";
    if (url.includes("resume")) return "resume";
    if (url.includes("mailto:")) return "email";
    if (url.includes("ethglobal.com") || url.includes("dorahacks.io"))
      return "hackathon";
    if (url.includes("npmjs.com")) return "npm";

    // Try to extract domain for domain-specific checks
    try {
      const domain = extractDomain(url);
      if (domain.includes("rushikeshnimkar.xyz")) return "portfolio";
    } catch (error) {
      // If domain extraction fails, continue with other checks
      console.error("Error extracting domain:", error);
    }

    // Default icon
    return "link";
  };

  // Render the appropriate icon component
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "github":
        return <FaGithub className="text-neutral-300 w-5 h-5" />;
      case "linkedin":
        return <FaLinkedin className="text-neutral-300 w-5 h-5" />;
      case "twitter":
        return <FaTwitter className="text-neutral-300 w-5 h-5" />;
      case "youtube":
        return <FaYoutube className="text-neutral-300 w-5 h-5" />;
      case "medium":
        return <FaMedium className="text-neutral-300 w-5 h-5" />;
      case "dev":
        return <SiDevdotto className="text-neutral-300 w-5 h-5" />;
      case "resume":
        return <FaFileAlt className="text-neutral-300 w-5 h-5" />;
      case "portfolio":
        return <FaGlobe className="text-neutral-300 w-5 h-5" />;
      case "hackathon":
        return <FaCode className="text-neutral-300 w-5 h-5" />;
      case "npm":
        return <span className="text-neutral-300 font-semibold">NPM</span>;
      case "email":
        return <FaEnvelope className="text-neutral-300 w-5 h-5" />;
      default:
        return <FaLink className="text-neutral-300 w-5 h-5" />;
    }
  };

  // Function to ensure URL has a protocol
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

  // Group links by category for better organization
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
        url.includes("rushikeshnimkar.xyz")
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

    // Filter out empty categories
    return Object.entries(groups).filter(([links]) => links.length > 0);
  };

  const groupedLinks = groupLinksByCategory();

  return (
    <div className="mt-3 space-y-4">
      <div className="bg-neutral-800/70 rounded-lg p-4 border border-neutral-700/50">
        <div className="flex items-center gap-2 mb-3">
          <FaLink className="text-blue-400" />
          <h3 className="font-medium text-white">Links & Resources</h3>
        </div>

        <div className="space-y-5">
          {groupedLinks.map(([category, categoryLinks]) => (
            <div key={category} className="space-y-3">
              {groupedLinks.length > 1 && (
                <h4 className="text-sm font-medium text-neutral-400 border-b border-neutral-700/50 pb-1">
                  {category}
                </h4>
              )}

              {categoryLinks.map((link, index) => (
                <div key={index} className="group">
                  <a
                    href={ensureProtocol(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-neutral-700/30 hover:bg-neutral-700/50 rounded-lg p-3 transition-all duration-200 transform group-hover:translate-x-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {renderIcon(getIconForLink(link))}
                          <span className="font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                            {link.title}
                          </span>
                        </div>
                        <FaExternalLinkAlt className="text-neutral-400 group-hover:text-blue-300 transition-colors" />
                      </div>

                      {link.description && (
                        <p className="mt-2 text-sm text-neutral-300">
                          {link.description}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
