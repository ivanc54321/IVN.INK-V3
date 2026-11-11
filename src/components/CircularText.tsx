import { motion } from "motion/react";

interface CircularTextProps {
  text: string;
  radius?: number;
}

export function CircularText({ text, radius = 50 }: CircularTextProps) {
  const characters = text.split("");
  const totalCharacters = characters.length;
  // Let circumference be 2*pi*r, but SVG handles it by mapping string along path.

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ ease: "linear", duration: 15, repeat: Infinity }}
      className="relative flex items-center justify-center font-sans uppercase font-bold tracking-widest text-[#f27d26]"
      style={{ width: radius * 2.5, height: radius * 2.5 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <path
          id="circlePath"
          d="
            M 50, 50
            m -38, 0
            a 38,38 0 1,1 76,0
            a 38,38 0 1,1 -76,0
          "
          fill="none"
          stroke="none"
        />
        <text className="text-[10px] fill-current">
          <textPath href="#circlePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}
