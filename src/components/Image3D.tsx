import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";
import { cn } from "../lib/utils";

interface Image3DProps {
  src: string;
  alt?: string;
  className?: string;
}

export function Image3D({ src, alt = "", className }: Image3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
  };

  // Touch triggers for mobile devices
  const handleTouchStart = () => {
    scale.set(1.03);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const touch = e.touches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    
    // Clamp within -0.5 and 0.5 ratio
    const xPct = Math.max(-0.5, Math.min(0.5, mouseX / width - 0.5));
    const yPct = Math.max(-0.5, Math.min(0.5, mouseY / height - 0.5));
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleTouchEnd = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative w-full h-full cursor-pointer overflow-hidden rounded-xl perspective-1000 border border-white/10 select-none", className)}
    >
      {/* Container to enforce actual 3D popping up element */}
      <motion.div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-100"
        style={{
          backgroundImage: `url(${src})`,
          // Add a slight translation outward to make it look like a floating layer inside the card
          translateZ: "30px", 
        }}
      />
      {/* Decorative reflection overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-[#f27d26]/10 to-transparent mix-blend-overlay"
        style={{ translateZ: "40px" }}
      />
      <div className="absolute top-8 left-8 w-full h-full border border-white/5 pointer-events-none"></div>
    </motion.div>
  );
}
