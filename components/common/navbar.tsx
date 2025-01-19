"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, X } from "lucide-react";

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id], main[id]");
      const scrollPosition = window.scrollY + 100;

      let currentActiveSection = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id") || "";

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentActiveSection = sectionId;
        }
      });

      if (currentActiveSection && currentActiveSection !== currentSection) {
        setCurrentSection(currentActiveSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  // Determine if About or any of its subsections are active
  const isAboutActive = () => {
    return ["about", "experience", "skills"].includes(currentSection);
  };

  // Determine if a main menu item is active
  const isActive = (href: string) => {
    const sectionId = href.replace("#", "");
    if (sectionId === "about") {
      return isAboutActive();
    }
    return currentSection === sectionId;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (active) setActive(null);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className={cn("fixed top-4 inset-x-0 max-w-2xl mx-auto z-50 hidden md:block")}>
        <Menu setActive={setActive}>
          <HoveredLink 
            href="#home" 
            className={cn(
              "transition-colors duration-200",
              isActive("#home") 
                ? "text-blue-500 font-bold" 
                : "text-neutral-200"
            )}
          >
            Home
          </HoveredLink>

          <HoveredLink 
            href="#projects" 
            className={cn(
              "transition-colors duration-200",
              isActive("#projects") 
                ? "text-blue-500 font-bold" 
                : "text-neutral-200"
            )}
          >
            Projects
          </HoveredLink>

          <MenuItem 
            setActive={setActive} 
            active={active} 
            item="About"
            isCurrentSection={isAboutActive()}
            childSections={["about", "experience", "skills"]}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-4 text-sm min-w-[200px]"
            >
              <HoveredLink 
                href="#about"
                className={cn(
                  "transition-colors duration-200",
                  currentSection === "about"
                    ? "text-blue-500 font-bold" 
                    : "text-neutral-200"
                )}
              >
                About Me
              </HoveredLink>
              <HoveredLink 
                href="#experience"
                className={cn(
                  "transition-colors duration-200",
                  currentSection === "experience"
                    ? "text-blue-500 font-bold" 
                    : "text-neutral-200"
                )}
              >
                Experience
              </HoveredLink>
              <HoveredLink 
                href="#skills"
                className={cn(
                  "transition-colors duration-200",
                  currentSection === "skills"
                    ? "text-blue-500 font-bold" 
                    : "text-neutral-200"
                )}
              >
                Skills
              </HoveredLink>
            </motion.div>
          </MenuItem>

          <HoveredLink 
            href="#contact" 
            className={cn(
              "transition-colors duration-200",
              isActive("#contact") 
                ? "text-blue-500 font-bold" 
                : "text-neutral-200"
            )}
          >
            Contact
          </HoveredLink>
        </Menu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 inset-x-0 z-50">
        <div className="flex items-center justify-between px-4">
          <motion.button
            className="p-2 rounded-full bg-neutral-900/90 backdrop-blur-sm text-neutral-200"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </motion.button>
          <div className="text-sm font-bold text-blue-500">
            {currentSection && currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 inset-x-4 rounded-2xl bg-neutral-900/90 backdrop-blur-md p-4 shadow-xl"
            >
              <div className="flex flex-col space-y-4">
                <MobileLink 
                  href="#home" 
                  className={cn(
                    "transition-colors duration-200",
                    isActive("#home")
                      ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                      : "text-neutral-200"
                  )}
                >
                  Home
                </MobileLink>

                <MobileLink 
                  href="#projects"
                  className={cn(
                    "transition-colors duration-200",
                    isActive("#projects") 
                      ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                      : "text-neutral-200"
                  )}
                >
                  Projects
                </MobileLink>

                <MobileMenuItem 
                  title="About"
                  isActive={isAboutActive()}
                  onClick={() => setActive(active === "About" ? null : "About")}
                >
                  {isAboutActive() && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 ml-4 flex flex-col space-y-2"
                    >
                      <MobileLink 
                        href="#about"
                        className={cn(
                          "transition-colors duration-200",
                          currentSection === "about"
                            ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                            : "text-neutral-200"
                        )}
                      >
                        About Me
                      </MobileLink>
                      <MobileLink 
                        href="#experience"
                        className={cn(
                          "transition-colors duration-200",
                          currentSection === "experience"
                            ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                            : "text-neutral-200"
                        )}
                      >
                        Experience
                      </MobileLink>
                      <MobileLink 
                        href="#skills"
                        className={cn(
                          "transition-colors duration-200",
                          currentSection === "skills"
                            ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                            : "text-neutral-200"
                        )}
                      >
                        Skills
                      </MobileLink>
                    </motion.div>
                  )}
                </MobileMenuItem>

                <MobileMenuItem 
                  title="Contact"
                  isActive={isActive("#contact")}
                  onClick={() => setActive(active === "Contact" ? null : "Contact")}
                >
                  {isActive("#contact") && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 ml-4 flex flex-col space-y-2"
                    >
                      <MobileLink 
                        href="#contact"
                        className={cn(
                          "transition-colors duration-200",
                          isActive("#contact") 
                            ? "text-blue-500 font-bold bg-blue-500/10 border-l-4 border-blue-500 pl-4" 
                            : "text-neutral-200"
                        )}
                      >
                        Contact Me
                      </MobileLink>
                      <MobileLink href="mailto:your@email.com">Email</MobileLink>
                      <MobileLink href="https://linkedin.com/in/yourusername">LinkedIn</MobileLink>
                      <MobileLink href="https://github.com/yourusername">GitHub</MobileLink>
                    </motion.div>
                  )}
                </MobileMenuItem>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// New Mobile Components
const MobileMenuItem = ({ 
  title, 
  children, 
  isActive, 
  onClick 
}: { 
  title: string;
  children?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <motion.div className="relative">
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-2 rounded-lg text-sm font-medium transition-colors",
        isActive ? "text-blue-500 bg-blue-500/10" : "text-neutral-200 hover:bg-neutral-800/50"
      )}
    >
      {title}
    </button>
    {children}
  </motion.div>
);

const MobileLink = ({ 
  href, 
  children,
  className 
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={href}
    className={cn(
      "text-sm text-neutral-300 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-neutral-800/50",
      className
    )}
  >
    {children}
  </a>
);

