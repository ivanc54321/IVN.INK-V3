import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

const HEADINGS = [
  "Seamless Interactions",
  "Parallax Experiences",
  "Fluid Layouts",
  "Engaging Interfaces",
];

export function AutoChangingHeadings({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADINGS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("relative h-[1.2em] overflow-hidden", className)}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 whitespace-nowrap flex items-center justify-center w-full h-full"
        >
          {HEADINGS[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
