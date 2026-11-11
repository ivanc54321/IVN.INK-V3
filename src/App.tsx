/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Hero } from './components/Hero';
import { HorizontalScroll } from './components/HorizontalScroll';
import { Footer } from './components/Footer';

import { Logo } from './components/Logo';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to scroll smoothly to sections or close menu
  const navigateTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, horizontalIndex?: number) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // If it's a horizontal scroll slide, trigger custom event
    if (horizontalIndex !== undefined) {
      window.dispatchEvent(new CustomEvent("scrollToHorizontalScreen", { detail: { index: horizontalIndex } }));
      return;
    }

    // Standard section scrolling if target exists, else scroll top
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen antialiased selection:bg-[#f27d26] selection:text-[#050505]">
      {/* Navigation Bar */}
      <nav id="nav-bar" className="absolute top-0 w-full py-8 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-8 md:px-12 w-full flex justify-between items-center">
          <motion.a 
            href="#" 
            onClick={(e) => navigateTo(e, "#")}
            className="pointer-events-auto transition-opacity hover:opacity-80"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Logo className="text-white h-6 md:h-8" />
          </motion.a>
          
          {/* Desktop Links */}
          <div className="hidden md:flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 pointer-events-auto">
            <a href="#" onClick={(e) => navigateTo(e, "#")} className="text-white border-b border-[#f27d26] pb-1">HOME</a>
            <a href="#artist" onClick={(e) => navigateTo(e, "#artist", 0)} className="hover:text-white transition-colors">THE ARTIST</a>
            <a href="#portfolio" onClick={(e) => navigateTo(e, "#portfolio", 1)} className="hover:text-white transition-colors">PORTFOLIO</a>
            <a href="#studio" onClick={(e) => navigateTo(e, "#studio", 2)} className="hover:text-white transition-colors">STUDIO</a>
            <a href="#booking" onClick={(e) => navigateTo(e, "#booking", 3)} className="hover:text-white transition-colors">BOOKING</a>
          </div>

          {/* Hamburger Trigger for Mobile and Responsive Overlay Modal */}
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 flex flex-col justify-center gap-1.5 cursor-pointer group pointer-events-auto z-50"
            id="menu-trigger"
          >
            <motion.div 
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 4 : 0 }}
              className="h-[2px] w-8 bg-white origin-center"
            />
            <motion.div 
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -4 : 0, width: isMenuOpen ? "2rem" : "1.25rem" }}
              className="h-[2px] bg-white origin-center self-end"
            />
          </div>
        </div>
      </nav>

      {/* Modern Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-40 flex flex-col justify-between p-8 md:p-16"
          >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 pointer-events-none h-full w-full opacity-[0.02]">
            </div>

            <div className="flex justify-between items-center w-full z-10 pt-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-[#f27d26] font-bold">DIRECTORY INDEX</span>
            </div>

            <div className="flex flex-col gap-4 md:gap-8 my-auto z-10">
              {[
                { label: "00 / HOME", href: "#" },
                { label: "01 / THE ARTIST", href: "#artist", horizontalIndex: 0 },
                { label: "02 / PORTFOLIO", href: "#portfolio", horizontalIndex: 1 },
                { label: "03 / STUDIO", href: "#studio", horizontalIndex: 2 },
                { label: "04 / BOOKING", href: "#booking", horizontalIndex: 3 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => navigateTo(e, item.href, item.horizontalIndex)}
                    className="group flex items-center justify-between text-2xl sm:text-4xl md:text-6xl font-sans font-black uppercase tracking-tight hover:text-[#f27d26] transition-colors border-b border-white/5 pb-2 md:pb-4"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8 text-white/20 group-hover:text-[#f27d26] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 border-t border-white/10 pt-8 z-10">
              <div className="flex gap-6 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">Editorial</a>
              </div>
              <div className="text-[10px] font-mono text-white/20">
                &copy; 1990-2026 IVN.ink. ALL INTENT PRESERVED.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Hero />
      <HorizontalScroll />
      <Footer />
    </div>
  );
}
