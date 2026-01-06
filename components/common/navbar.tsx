"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, X } from "lucide-react";

// Apple-like spring configurations
const appleSpring = {
  type: "spring",
  mass: 0.4,
  damping: 15,
  stiffness: 300,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const appleWobbleSpring = {
  type: "spring",
  mass: 0.6,
  damping: 12,
  stiffness: 400,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const appleBounceSpring = {
  type: "spring",
  mass: 0.3,
  damping: 20,
  stiffness: 500,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Custom easing curves

const appleEaseOut = [0.16, 1, 0.3, 1];

export function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Throttle ref to limit scroll handler frequency
  const lastScrollTime = useRef<number>(0);
  const THROTTLE_MS = 100;

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < THROTTLE_MS) {
        return; // Skip if called too soon
      }
      lastScrollTime.current = now;

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

    // Special handling for home section
    if (sectionId === "home") {
      return (
        currentSection === "home" ||
        currentSection === "main-content" ||
        currentSection === "" ||
        !currentSection ||
        currentSection === "about-content"
      );
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
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
              transition: { duration: 0.2, ease: appleEaseOut },
            }}
            transition={appleWobbleSpring}
            className={cn(
              "fixed top-4 inset-x-0 max-w-2xl mx-auto z-50 hidden md:block"
            )}
          >
            <Menu setActive={setActive}>
              <HoveredLink
                href="/#home"
                className={cn(
                  "transition-all duration-300 relative",
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
                  "transition-all duration-300 relative",
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
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.05, ...appleWobbleSpring }}
                  className="flex flex-col space-y-4 text-sm min-w-[200px]"
                >
                  {[
                    { href: "/#about", label: "About Me", section: "about" },
                    {
                      href: "/#experience",
                      label: "Experience",
                      section: "experience",
                    },
                    { href: "/#skills", label: "Skills", section: "skills" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.section}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + index * 0.05,
                        ...appleBounceSpring,
                      }}
                    >
                      <HoveredLink
                        href={item.href}
                        className={cn(
                          "transition-all duration-300 block",
                          currentSection === item.section
                            ? "text-blue-500 font-bold"
                            : "text-neutral-200"
                        )}
                      >
                        {item.label}
                      </HoveredLink>
                    </motion.div>
                  ))}
                </motion.div>
              </MenuItem>

              <HoveredLink
                href="/#contact"
                className={cn(
                  "transition-all duration-300 relative",
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
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
              transition: { duration: 0.2, ease: appleEaseOut },
            }}
            transition={appleWobbleSpring}
            className="md:hidden fixed top-4 left-6 right-6 z-50"
          >
            <div className="flex items-center justify-between px-2">
              <motion.button
                className="p-3 rounded-xl bg-neutral-900/90 backdrop-blur-xl text-neutral-200 border border-neutral-700/50 relative overflow-hidden"
                onClick={toggleMobileMenu}
                whileHover={{
                  scale: 1.05,
                  transition: appleBounceSpring,
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 },
                }}
              >
                {/* Enhanced background glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{
                    opacity: 1,
                    scale: 1,
                    transition: appleSpring,
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"
                />

                {/* Icon with rotation animation */}
                <motion.div
                  animate={{
                    rotate: isMobileMenuOpen ? 180 : 0,
                    scale: isMobileMenuOpen ? 1.1 : 1,
                  }}
                  transition={appleWobbleSpring}
                  className="relative z-10"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                </motion.div>
              </motion.button>

              {/* Enhanced current section indicator */}
              <motion.div
                className="text-sm font-medium bg-neutral-900/90 backdrop-blur-xl text-blue-500 py-2 px-4 rounded-xl border border-neutral-700/50 relative overflow-hidden"
                whileHover={{
                  scale: 1.02,
                  transition: appleBounceSpring,
                }}
              >
                {/* Background glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={appleSpring}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                />

                {/* Text with subtle animation */}
                <motion.span
                  key={currentSection} // Re-animate when section changes
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={appleBounceSpring}
                  className="relative z-10"
                >
                  {(() => {
                    // If no current section is detected or it's the main-content, show Home
                    if (
                      !currentSection ||
                      currentSection === "main-content" ||
                      currentSection === "about-content"
                    ) {
                      return "Home";
                    }

                    // Special handling for home section
                    if (currentSection === "home") {
                      return "Home";
                    }

                    // For sections with ID containing a dash, extract the first part
                    if (currentSection.includes("-")) {
                      const mainSection = currentSection.split("-")[0];
                      // Capitalize the first letter
                      return (
                        mainSection.charAt(0).toUpperCase() +
                        mainSection.slice(1)
                      );
                    }

                    // Default case: just capitalize the section name
                    return (
                      currentSection.charAt(0).toUpperCase() +
                      currentSection.slice(1)
                    );
                  })()}
                </motion.span>
              </motion.div>
            </div>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                    rotateX: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                    scale: 0.95,
                    rotateX: -5,
                    transition: { duration: 0.2, ease: appleEaseOut },
                  }}
                  transition={appleWobbleSpring}
                  style={{ transformPerspective: 1000 }}
                  className=" top-6 left-0 right-0 mx-2 rounded-2xl bg-neutral-900/40 backdrop-blur-md p-3 shadow-2xl border border-neutral-700/50 relative overflow-hidden"
                >
                  {/* Enhanced background effects - no delays */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={appleSpring}
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={appleSpring}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl"
                  />

                  <div className="flex flex-col space-y-2 relative z-10">
                    {[
                      {
                        href: "/#home",
                        label: "Home",
                        active: isActive("#home"),
                      },
                      {
                        href: "/#projects",
                        label: "Projects",
                        active: isActive("#projects"),
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.05,
                          ...appleBounceSpring,
                        }}
                      >
                        <MobileLink
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            item.active
                              ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                              : "text-neutral-200 hover:bg-neutral-800/50"
                          )}
                        >
                          {item.label}
                        </MobileLink>
                      </motion.div>
                    ))}

                    {/* Enhanced About dropdown - moved to third position */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.2,
                        ...appleBounceSpring,
                      }}
                    >
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
                          transition={appleWobbleSpring}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 ml-3 flex flex-col space-y-2">
                            {[
                              {
                                href: "/#about",
                                label: "About Me",
                                section: "about",
                              },
                              {
                                href: "/#experience",
                                label: "Experience",
                                section: "experience",
                              },
                              {
                                href: "/#skills",
                                label: "Skills",
                                section: "skills",
                              },
                            ].map((item, index) => (
                              <motion.div
                                key={item.section}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.1 + index * 0.05,
                                  ...appleBounceSpring,
                                }}
                              >
                                <MobileLink
                                  href={item.href}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsAboutDropdownOpen(false);
                                  }}
                                  className={cn(
                                    currentSection === item.section
                                      ? "text-blue-500 font-medium bg-blue-500/10 shadow-inner"
                                      : "text-neutral-300 hover:bg-neutral-800/50"
                                  )}
                                >
                                  {item.label}
                                </MobileLink>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </MobileMenuItem>
                    </motion.div>

                    {/* Contact - moved to fourth position */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.25,
                        ...appleBounceSpring,
                      }}
                    >
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
                    </motion.div>
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

// Enhanced Mobile-specific components
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
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        x: 2,
        transition: appleBounceSpring,
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      className={cn(
        "w-full text-left p-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
        isActive
          ? "text-blue-500 bg-blue-500/10 shadow-inner"
          : "text-neutral-200 hover:bg-neutral-800/50"
      )}
    >
      {/* Enhanced background for active state */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={appleWobbleSpring}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <span>{title}</span>
        <motion.span
          animate={{
            rotate: isActive ? 180 : 0,
            scale: isActive ? 1.1 : 1,
          }}
          transition={appleWobbleSpring}
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
    </motion.button>
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
  <motion.div
    whileHover={{
      scale: 1.02,
      x: 4,
      transition: appleBounceSpring,
    }}
    whileTap={{
      scale: 0.98,
      transition: { duration: 0.1 },
    }}
  >
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "block text-sm transition-all duration-300 p-3 rounded-xl relative overflow-hidden",
        className
      )}
    >
      {/* Subtle background animation on hover - only for non-active items */}
      {!className?.includes("text-blue-500") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{
            opacity: 1,
            scale: 1,
            transition: appleSpring,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </a>
  </motion.div>
);
