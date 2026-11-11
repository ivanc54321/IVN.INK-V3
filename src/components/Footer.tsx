import React from "react";
import { Logo } from './Logo';
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 py-32 px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-white flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-10%" }}
        >
          <Logo className="text-white h-16 sm:h-24 md:h-40 mb-12" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-10%" }}
          className="text-white/40 leading-relaxed italic font-serif text-lg max-w-xl mx-auto mb-16"
        >
          Precision in motion. Engineered custom tattoo work, designed and applied on a strictly private, client-by-client basis.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-10%" }}
          className="flex gap-4 sm:gap-8 justify-center items-center text-xs font-mono tracking-[0.2em] text-[#f27d26] uppercase"
        >
          <span>DARKWORK</span>
          <span className="text-white/20">—</span>
          <span>FINE-LINE</span>
          <span className="text-white/20">—</span>
          <span>REALISM</span>
        </motion.div>
      </div>
    </footer>
  );
}
