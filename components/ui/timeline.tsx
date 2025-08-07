"use client";
import { useScroll, useTransform, motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans relative overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-4 text-white"
        >
          Journey Through Time
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-neutral-400 text-sm md:text-base max-w-xl"
        >
          A chronicle of my professional evolution and key milestones.
        </motion.p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-700 to-transparent"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-b from-blue-500/30 via-blue-500 to-blue-500/30"
          />
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({
  item,
  index,
}: {
  item: TimelineEntry;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    margin: "-30% 0px -70% 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex justify-start pt-10 md:pt-20 md:gap-10"
    >
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="relative h-10 w-10">
          <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-700">
            <motion.div
              className="h-3 w-3 rounded-full bg-blue-500"
              animate={{
                scale: isInView ? 1.5 : 1,
                backgroundColor: isInView ? "#3b82f6" : "#60a5fa",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <h3 className="hidden md:block text-lg md:pl-6 md:text-2xl font-semibold text-white">
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-6 w-full">
        <h3 className="md:hidden block text-xl mb-4 text-left font-semibold text-white">
          {item.title}
        </h3>
        <motion.div
          className="backdrop-blur-sm bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6 shadow-sm"
          animate={{
            boxShadow: isInView
              ? "0 0 20px rgba(200, 255, 255, 0.3), 0 0 30px rgba(25, 5, 55, 0.2)"
              : "none",
            borderColor: isInView
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-neutral-300 text-base leading-relaxed">
            {item.content}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
