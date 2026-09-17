"use client";

import { ChalkWrite } from "@/components/ui/ChalkWrite";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  asMedia = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  asMedia?: boolean;
}) {
  return (
    <ChalkWrite
      className={className}
      delay={delay}
      once={once}
      asMedia={asMedia}
    >
      {children}
    </ChalkWrite>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <Reveal>
          <span className="chip mb-4">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-ocean text-glow font-display">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <div
          className={
            "mt-4 h-px w-24 bg-gradient-to-r from-ocean-aqua via-ocean-cyan to-transparent " +
            (align === "center" ? "mx-auto" : "")
          }
        />
      </Reveal>
      {subtitle && (
        <Reveal delay={0.22}>
          <p className="mt-5 text-ocean-mist text-base md:text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
