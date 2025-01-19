"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

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
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer transition-all duration-200",
          isCurrentSection 
            ? "text-blue-500 font-bold" 
            : "text-neutral-200 hover:text-white"
        )}
      >
        {item}
      </motion.p>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          <div className="absolute top-[calc(100%+0.5rem)] left-1/2 transform -translate-x-1/2 pt-2">
            <motion.div
              transition={transition}
              layoutId="active"
              className="bg-neutral-900 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-xl"
            >
              <motion.div
                layout
                className="w-max h-full p-4"
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
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm flex justify-evenly space-x-4 px-8 py-3 z-50"
    >
      {children}
    </nav>
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
    <Link
    href={""} {...rest}
    className={cn(
      "text-neutral-400 hover:text-white transition-colors duration-200",
      className
    )}    >
      {children}
    </Link>
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
  <Link
    href={href}
    className={cn(
      "text-sm text-neutral-300 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-neutral-800/50",
      className
    )}
  >
    {children}
  </Link>
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
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-2 rounded-lg text-sm font-medium transition-colors",
        isActive ? "text-blue-500 bg-blue-500/10" : "text-neutral-200 hover:bg-neutral-800/50"
      )}
    >
      {title}
    </button>
    {isActive && children}
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
    <Link href={href} className="flex space-x-3 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
      />
      <div>
        <h4 className="text-lg font-semibold mb-1 text-white group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-neutral-400 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

