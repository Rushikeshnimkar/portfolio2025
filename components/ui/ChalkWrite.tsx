"use client";

import {
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type ChalkWriteProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  eraseFirst?: boolean;
  once?: boolean;
  asMedia?: boolean;
};

/** Soft exposure fade — kept the old name so call sites don't churn. */
export function ChalkWrite({
  children,
  className,
  delay = 0,
  once = true,
  asMedia = false,
}: ChalkWriteProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px", amount: 0.12 });
  const controls = useAnimation();
  const duration = asMedia ? 0.8 : 0.55;

  useEffect(() => {
    if (reduce || !inView) return;
    void controls.start({
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease },
    });
  }, [inView, reduce, delay, controls, duration]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

export function ChalkWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.28em] last:mr-0"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.4,
              delay: delay + i * 0.07,
              ease,
            },
          }}
          viewport={{ once: true, margin: "-40px" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
