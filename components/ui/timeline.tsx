"use client";
import { useScroll, useTransform, motion } from "framer-motion";
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
      className="w-full  font-sans relative overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0  pointer-events-none" />

      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-400"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="relative h-10 w-10">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800">
                  <div className="h-4 w-4 rounded-full bg-blue-500/50 dark:bg-blue-500/50 border border-blue-500 p-2" />
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500/50 to-purple-500/50">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500/50 to-purple-500/50">
                {item.title}
              </h3>
              <div className="text-neutral-300 prose prose-invert">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
