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
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id], main[id]");
      const scrollPosition = window.scrollY + 100;

      let currentActiveSection = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id") || "";

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
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

  useEffect(() => {
    const handleToggleNavbar = (event: CustomEvent) => {
      setIsVisible(event.detail.visible);
    };

    window.addEventListener(
      "toggleNavbar",
      handleToggleNavbar as EventListener
    );

    return () => {
      window.removeEventListener(
        "toggleNavbar",
        handleToggleNavbar as EventListener
      );
    };
  }, []);

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
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed top-4 inset-x-0 max-w-2xl mx-auto z-50 hidden md:block"
            )}
          >
            <Menu setActive={setActive}>
              <HoveredLink
                href="/#home"
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
                href="/#projects"
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
                    href="/#about"
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
                    href="/#experience"
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
                    href="/#skills"
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
                href="/#contact"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-4 inset-x-0 z-50"
          >
            <div className="flex items-center justify-between px-4">
              <motion.button
                className="p-3 rounded-xl bg-neutral-900/90 backdrop-blur-sm text-neutral-200 border border-neutral-800"
                onClick={toggleMobileMenu}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </motion.button>
              <div className="text-sm font-medium bg-neutral-900/90 backdrop-blur-sm text-blue-500 py-2 px-4 rounded-xl border border-neutral-800">
                {currentSection &&
                  currentSection.charAt(0).toUpperCase() +
                    currentSection.slice(1)}
              </div>
            </div>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 inset-x-4 rounded-2xl bg-neutral-900/95 backdrop-blur-md p-3 shadow-xl border border-neutral-800"
                >
                  <div className="flex flex-col space-y-2">
                    <MobileLink
                      href="/#home"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        isActive("#home")
                          ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                          : "text-neutral-200 hover:bg-neutral-800/50"
                      )}
                    >
                      Home
                    </MobileLink>

                    <MobileLink
                      href="/#projects"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        isActive("#projects")
                          ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                          : "text-neutral-200 hover:bg-neutral-800/50"
                      )}
                    >
                      Projects
                    </MobileLink>

                    <MobileMenuItem
                      title="About"
                      isActive={isAboutDropdownOpen}
                      onClick={() =>
                        setIsAboutDropdownOpen(!isAboutDropdownOpen)
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 ml-3 flex flex-col space-y-2">
                          <MobileLink
                            href="/#about"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsAboutDropdownOpen(false);
                            }}
                            className={cn(
                              currentSection === "about"
                                ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                                : "text-neutral-300 hover:bg-neutral-800/50"
                            )}
                          >
                            About Me
                          </MobileLink>
                          <MobileLink
                            href="/#experience"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsAboutDropdownOpen(false);
                            }}
                            className={cn(
                              currentSection === "experience"
                                ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                                : "text-neutral-300 hover:bg-neutral-800/50"
                            )}
                          >
                            Experience
                          </MobileLink>
                          <MobileLink
                            href="/#skills"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsAboutDropdownOpen(false);
                            }}
                            className={cn(
                              currentSection === "skills"
                                ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                                : "text-neutral-300 hover:bg-neutral-800/50"
                            )}
                          >
                            Skills
                          </MobileLink>
                        </div>
                      </motion.div>
                    </MobileMenuItem>

                    <MobileLink
                      href="/#contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        isActive("#contact")
                          ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                          : "text-neutral-200 hover:bg-neutral-800/50"
                      )}
                    >
                      Contact
                    </MobileLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile-specific components
const MobileMenuItem = ({
  title,
  children,
  isActive,
  onClick,
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
        "w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "text-blue-500 bg-blue-500/10 shadow-inner"
          : "text-neutral-200 hover:bg-neutral-800/50"
      )}
    >
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </div>
    </button>
    <AnimatePresence>{isActive && children}</AnimatePresence>
  </motion.div>
);

const MobileLink = ({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      "block text-sm transition-all duration-200 p-3 rounded-xl",
      className
    )}
  >
    {children}
  </a>
);
