"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "./LiquidGlass";

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

// Custom easing curves inspired by Apple's design

const appleEaseOut = [0.16, 1, 0.3, 1];

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  isCurrentSection,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  isCurrentSection?: boolean;
  childSections?: string[];
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.05,
          transition: appleBounceSpring,
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
        animate={{
          color: isCurrentSection ? "#3b82f6" : "#e5e5e5",
          fontWeight: isCurrentSection ? 700 : 400,
        }}
        transition={appleSpring}
        className="cursor-pointer relative"
      >
        {/* Subtle glow effect for active items */}
        {isCurrentSection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={appleWobbleSpring}
            className="absolute inset-0 bg-blue-500 rounded-lg blur-sm -z-10"
          />
        )}

        {/* Text with subtle bounce on hover */}
        <motion.span
          className="relative z-10"
          whileHover={{
            y: -1,
            transition: appleBounceSpring,
          }}
        >
          {item}
        </motion.span>
      </motion.p>

      {active === item && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.85,
            y: 10,
            rotateX: -15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: -5,
            transition: { duration: 0.2, ease: appleEaseOut },
          }}
          transition={appleWobbleSpring}
          style={{ transformPerspective: 1000 }}
        >
          <div className="absolute top-[calc(100%+0.5rem)] left-1/2 transform -translate-x-1/2 pt-2">
            {/* Backdrop with enhanced blur - no animation delay */}
            <motion.div
              layoutId="active"
              className="bg-neutral-900/95 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl relative"
            >
              {/* Subtle inner glow - no delay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={appleSpring}
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"
              />

              {/* Content with minimal delay */}
              <motion.div
                layout
                className="w-max h-full p-4 relative z-10"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={appleSpring}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <LiquidGlass
      width={800}
      height={56}
      borderRadius={9999}
      intensity={0.6}
      className="border border-white/20 bg-white/10"
    >
      <motion.nav
        onMouseLeave={() => setActive(null)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={appleWobbleSpring}
        whileHover={{
          scale: 1.02,
          y: -2,
          transition: appleBounceSpring,
        }}
        className="relative z-50 flex justify-evenly space-x-4 px-8 py-3 rounded-full
                 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,2.2)]"
      >
        {/* Enhanced background glow - no delay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={appleSpring}
          className="absolute inset-0 rounded-full"
        />

        {/* Content */}
        <div className="relative z-10 flex justify-evenly space-x-4 w-full">
          {children}
        </div>
      </motion.nav>
    </LiquidGlass>
  );
};

export const HoveredLink = ({
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: React.ReactNode | string | undefined;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -1,
        transition: appleBounceSpring,
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
    >
      <Link
        href={""}
        {...rest}
        className={cn(
          "transition-all duration-300 relative inline-block",
          className
        )}
      >
        {/* Hover underline effect - only show for non-active items */}
        <motion.span className="relative">
          {children}
          {!className?.includes("text-blue-500") && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileHover={{
                width: "100%",
                opacity: 1,
                transition: appleBounceSpring,
              }}
            />
          )}
        </motion.span>
      </Link>
    </motion.div>
  );
};

export const MobileLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
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
    <Link
      href={href}
      className={cn(
        "text-sm transition-all duration-300 p-2 rounded-lg relative block",
        className
      )}
    >
      {/* Subtle background animation on hover - only for non-active items */}
      {!className?.includes("text-blue-500") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{
            opacity: 1,
            scale: 1,
            transition: appleSpring,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  </motion.div>
);

export const MobileMenuItem = ({
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
        transition: appleBounceSpring,
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      className={cn(
        "w-full text-left p-2 rounded-lg text-sm font-medium transition-all duration-300 relative",
        isActive
          ? "text-blue-500 bg-blue-500/10"
          : "text-neutral-200 hover:bg-neutral-800/50"
      )}
    >
      {/* Enhanced background for active state */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={appleWobbleSpring}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
        />
      )}
      <span className="relative z-10">{title}</span>
    </motion.button>

    {/* Enhanced dropdown animation */}
    <motion.div
      initial={false}
      animate={{
        height: isActive ? "auto" : 0,
        opacity: isActive ? 1 : 0,
      }}
      transition={appleWobbleSpring}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  </motion.div>
);

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: appleBounceSpring,
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
    >
      <Link href={href} className="flex space-x-3 group relative">
        {/* Enhanced image with multiple animation layers */}
        <motion.div
          className="relative"
          whileHover={{
            rotateY: 5,
            rotateX: 2,
            transition: appleSpring,
          }}
          style={{ transformPerspective: 1000 }}
        >
          <Image
            src={src}
            width={140}
            height={70}
            alt={title}
            className="flex-shrink-0 rounded-lg shadow-2xl"
          />

          {/* Subtle overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{
              opacity: 1,
              transition: appleSpring,
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"
          />
        </motion.div>

        <div className="relative">
          <motion.h4
            className="text-lg font-semibold mb-1 text-white transition-colors duration-300"
            whileHover={{
              color: "#60a5fa",
              x: 2,
              transition: appleBounceSpring,
            }}
          >
            {title}
          </motion.h4>
          <motion.p
            className="text-neutral-400 text-sm max-w-[10rem]"
            whileHover={{
              color: "#d1d5db",
              transition: appleSpring,
            }}
          >
            {description}
          </motion.p>
        </div>
      </Link>
    </motion.div>
  );
};
