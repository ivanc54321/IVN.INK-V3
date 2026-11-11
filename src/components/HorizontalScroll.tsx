import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent } from "motion/react";
import { ArrowRight, ArrowLeft, ArrowUp } from "lucide-react";
import { Image3D } from "./Image3D";
import { CircularText } from "./CircularText";
import { ReverseScrollGallery } from "./ReverseScrollGallery";
import { ContactModal } from "./ContactModal";
import { cn } from "../lib/utils";

// Helper component for customized reveal animation inside horizontal context
function RevealText({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// Parallax Image component
function ParallaxImage({ 
  src, 
  scrollYProgress, 
  startStr, 
  endStr, 
  rotateStart, 
  rotateEnd,
  className 
}: { 
  src: string, 
  scrollYProgress: MotionValue<number>, 
  startStr: string, 
  endStr: string,
  rotateStart: number,
  rotateEnd: number,
  className?: string 
}) {
  const x = useTransform(scrollYProgress, [0, 1], [startStr, endStr]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rotateStart, rotateEnd]);

  return (
    <motion.div style={{ x, rotate }} className={`absolute ${className}`}>
        <img src={src} alt="" className="w-full h-full object-cover shadow-2xl" />
    </motion.div>
  );
}

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState({
    placement: "",
    concept: "",
    discipline: "Darkwork",
  });

  // We are creating 4 horizontal screens, so 400vw width in total.
  // We need 400vh to scroll them naturally.
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    // When the top of container hits top of viewport to bottom hitting bottom.
    offset: ["start start", "end end"] 
  });

  // Smooth the scroll so desktop mouse wheel notches glide effortlessly across horizontal slides
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.25,
    restDelta: 0.0005,
  });

  // Track scroll changes to highlight current active screen index
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!containerRef.current) return;
    const offsetTop = containerRef.current.offsetTop;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    if (latest < offsetTop - window.innerHeight / 2) {
      setActiveScreen(-1);
    } else {
      const scrollProgress = latest - offsetTop;
      const scrollRatio = Math.max(0, Math.min(1, scrollProgress / totalHeight));
      const index = Math.max(0, Math.min(3, Math.round(scrollRatio * 3)));
      setActiveScreen(index);
    }
  });

  // 4 screens = 3 shifts (0 to -75% of a container that's 400vw wide)
  // Bind to smoothProgress so desktop wheel scrolling is fluid rather than stepped
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);

  const scrollToScreen = (screenIndex: number) => {
    if (screenIndex === -1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const offsetTop = rect.top + scrollTop;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    
    // Each screen index represents a fraction of the total scrollable area
    const targetScroll = offsetTop + (totalHeight * (screenIndex / 3));
    
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Connect outer event navigation helper to scroll slides smoothly
  useEffect(() => {
    const handleScrollEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === "number") {
        scrollToScreen(customEvent.detail.index);
      }
    };
    window.addEventListener("scrollToHorizontalScreen", handleScrollEvent);
    return () => window.removeEventListener("scrollToHorizontalScreen", handleScrollEvent);
  }, []);

  // Desktop horizontal wheel & notched mouse wheel enhancement
  const handleDesktopWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (isGalleryOpen || isContactOpen) return;
    // If the user scrolls horizontally (trackpad 2-finger horizontal swipe or Shift+Wheel), translate to vertical page scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      e.preventDefault();
      const multiplier = e.deltaMode === 1 ? 36 : 1.25;
      window.scrollBy({ top: e.deltaX * multiplier, behavior: "auto" });
    }
  };

  // Desktop Mouse Drag-to-Scroll support across horizontal slides
  const mouseDragRef = useRef<{ isDown: boolean; startX: number; startScrollY: number }>({
    isDown: false,
    startX: 0,
    startScrollY: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (isGalleryOpen || isContactOpen) return;
    // Ignore clicks on buttons or links
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    mouseDragRef.current = {
      isDown: true,
      startX: e.clientX,
      startScrollY: window.scrollY || document.documentElement.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!mouseDragRef.current.isDown || !containerRef.current || isGalleryOpen || isContactOpen) return;
    const deltaX = e.clientX - mouseDragRef.current.startX;
    if (Math.abs(deltaX) < 5) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const offsetTop = rect.top + scrollTop;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;

    const scrollDelta = -deltaX * 1.5;
    const targetScroll = Math.max(
      offsetTop,
      Math.min(offsetTop + totalHeight, mouseDragRef.current.startScrollY + scrollDelta)
    );
    window.scrollTo({ top: targetScroll });
  };

  const handleMouseUp = () => {
    mouseDragRef.current.isDown = false;
  };

  // Touch Swiping translation to vertical scrolling (for natural mobile horizontal swipes)
  const touchStartRef = useRef<{ x: number; y: number; scrollY: number }>({ x: 0, y: 0, scrollY: 0 });
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollY: window.scrollY || document.documentElement.scrollTop,
    };
    isHorizontalSwipeRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || isHorizontalSwipeRef.current === false) return;
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Detect dominant touch swipe vector on the first significant movement
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
        isHorizontalSwipeRef.current = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
        isHorizontalSwipeRef.current = false;
        return;
      } else {
        return;
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      // Prevent browser bounce or default horizontal swiping page navigation
      if (e.cancelable) {
        e.preventDefault();
      }

      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop;
      const totalHeight = containerRef.current.scrollHeight - window.innerHeight;

      // Sensitivity determines swipe feel. 1.25 is perfect on iOS/Android WebViews
      const sensitivity = 1.25;
      const scrollDelta = -deltaX * sensitivity;

      const targetScroll = Math.max(
        offsetTop,
        Math.min(offsetTop + totalHeight, touchStartRef.current.scrollY + scrollDelta)
      );

      window.scrollTo({ top: targetScroll });
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipeRef.current === true && containerRef.current) {
      // Auto-snap to the closest slide for premium carousel feel
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop;
      const totalHeight = containerRef.current.scrollHeight - window.innerHeight;

      const currentRelativeScroll = scrollTop - offsetTop;
      const ratio = currentRelativeScroll / totalHeight;
      const closestScreenIndex = Math.max(0, Math.min(3, Math.round(ratio * 3)));
      
      scrollToScreen(closestScreenIndex);
    }
    isHorizontalSwipeRef.current = null;
  };

  const nameInputId = "booking-name-input";
  const emailInputId = "booking-email-input";
  const placementInputId = "booking-placement-input";
  const conceptInputId = "booking-concept-input";

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-[#050505] touch-pan-y"
      onWheel={handleDesktopWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">
        {/* Decorative Grid Overlay for entire scroll area */}
        <div className="absolute inset-0 pointer-events-none h-full w-full opacity-[0.03] z-[5]">
        </div>

        {/* Premium Edge Blending Gradients for Pages 2, 3, and 4 */}
        {/* Left Edge Gradient Blend */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 lg:w-48 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent pointer-events-none z-20" />
        
        {/* Right Edge Gradient Blend */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 lg:w-48 bg-gradient-to-l from-[#050505] via-[#050505]/40 to-transparent pointer-events-none z-20" />
        
        {/* Bottom Edge Gradient Blend */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 md:h-36 lg:h-48 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent pointer-events-none z-20" />

        <motion.div 
          style={{ x }} 
          className="flex h-full w-[400vw] relative z-10"
        >
          {/* SLIDE 1: THE ARTIST */}
          <div id="artist-slide" className="w-[100vw] h-full flex items-center justify-center p-4 sm:p-8 lg:p-24 shrink-0 relative px-6 md:px-12 border-r border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 items-center w-full max-w-7xl pt-0 md:pt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -60, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true, margin: "0px" }}
                  className="order-2 md:order-1 h-[25vh] sm:h-[40vh] md:h-[55vh] lg:h-[60vh] perspective relative" style={{ perspective: 1200 }}
                >
                   <Image3D src="/artist_profile_new.png" />
                   <motion.div
                     initial={{ opacity: 0 }}
                     whileInView={{ opacity: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 1, duration: 1 }}
                     className="absolute -bottom-8 -left-8 md:-bottom-16 md:-left-16 z-20 flex items-center justify-center pointer-events-none"
                   >
                     <CircularText text="IVN.INK • TATTOO ARTISTRY • PRECISION IN MOTION • " radius={70} />
                   </motion.div>
                </motion.div>
                <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left justify-center relative">
                   {/* Light glow behind slide 1 text */}
                   <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#f27d26]/5 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>
                   
                   <RevealText>
                     <span className="text-[#f27d26] font-mono text-xs md:text-sm tracking-widest block mb-2 md:mb-4 uppercase animate-[pulse_3s_ease-in-out_infinite]">01 &mdash; THE HAND</span>
                     <h2 className="text-[3rem] leading-none sm:text-5xl md:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-black font-sans uppercase tracking-tighter text-white  mb-3 md:mb-8">
                       IVAN <br className="hidden md:block"/> <span className="text-[#f27d26] pl-0 md:pl-20">CLAGUE</span>
                     </h2>
                   </RevealText>
                   <RevealText>
                     <p className="text-white/40 leading-relaxed max-w-md ml-0 md:ml-12 text-sm sm:text-base md:text-lg italic font-serif mx-auto md:mx-0">
                       I don't do flash sheets or factory line work. IVN.ink is my private practice dedicated to pushing boundaries in darkwork, fine-line, and high-contrast realism. Every single piece is an engineered collaboration between your skin and my precision.
                     </p>
                   </RevealText>
                </div>
             </div>
             
          </div>

          {/* SLIDE 2: PORTFOLIO */}
          <div id="portfolio-slide" className="w-[100vw] h-full flex items-center justify-center p-4 sm:p-8 shrink-0 relative bg-[#0a0a0a] border-r border-white/5">
             <div className="w-full max-w-7xl relative h-full flex text-center flex-col items-center justify-center z-10 px-4">
                {/* Light glow behind slide 2 text */}
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#f27d26]/5 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>

                <RevealText>
                  <span className="text-[#f27d26] font-mono text-xs md:text-sm tracking-widest block mb-2 md:mb-4 uppercase z-20 animate-[pulse_3s_ease-in-out_infinite]">02 &mdash; VISUALS</span>
                </RevealText>
                
                <RevealText delay={0.1}>
                  <h2 className="text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] font-black font-sans uppercase tracking-tighter text-white leading-none mb-6 md:mb-12 w-full z-20">
                    MY RECENT <span className="text-[#f27d26]">WORK</span>
                  </h2>
                </RevealText>
                
                {/* Parallax Rotating Elements in Background */}
                <ParallaxImage 
                  src="/nubia tat.jpg"
                  scrollYProgress={smoothProgress}
                  startStr="-8vw" endStr="12vw"
                  rotateStart={-10} rotateEnd={20}
                  className="w-28 sm:w-48 md:w-72 aspect-[3/4] top-[15%] left-[5%] shadow-2xl opacity-20 md:opacity-40 mix-blend-screen grayscale border border-white/10 pointer-events-none"
                />
                
                <ParallaxImage 
                  src="/arm.jpeg"
                  scrollYProgress={smoothProgress}
                  startStr="8vw" endStr="-12vw"
                  rotateStart={15} rotateEnd={-25}
                  className="w-32 sm:w-56 md:w-80 aspect-square bottom-[15%] right-[5%] shadow-2xl opacity-20 md:opacity-40 mix-blend-screen grayscale border border-white/10 pointer-events-none"
                />

                <RevealText delay={0.2}>
                   <p className="text-white/60 leading-relaxed italic font-serif text-sm sm:text-base md:text-lg max-w-[300px] sm:max-w-sm md:max-w-md mx-auto z-20 bg-black/85 md:bg-black/60 p-3 md:p-6 backdrop-blur-md border border-white/10 relative">
                     Browse past projects, healed work, and current concepts. Look at the linework, check the saturation, and see what happens when strict discipline meets raw concept.
                     <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#f27d26]"></span>
                     <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#f27d26]"></span>
                   </p>
                </RevealText>

                <RevealText>
                  <div className="mt-8 z-20 relative">
                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="px-6 py-3 border border-[#f27d26] text-[#f27d26] hover:bg-[#f27d26] hover:text-[#050505] font-mono text-xs tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer"
                    >
                      VIEW GALLERY &rarr;
                    </button>
                  </div>
                </RevealText>
             </div>
             
          </div>

          {/* SLIDE 3: STUDIO */}
          <div id="studio-slide" className="w-[100vw] h-full flex flex-col items-center justify-center p-4 sm:p-8 shrink-0 relative bg-[#050505] text-white border-r border-white/5">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/artist_profile_new.png')] bg-cover bg-center mix-blend-overlay grayscale" />
              <div className="z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
                 <RevealText>
                   <span className="text-[#f27d26] font-mono text-xs md:text-sm tracking-widest block mb-2 md:mb-4 uppercase animate-pulse">03 &mdash; SPACE</span>
                   <div className="text-[3rem] leading-[1] sm:text-5xl md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] font-sans font-black uppercase tracking-tighter md:leading-none text-white mb-4 md:mb-8 flex flex-col md:block w-full">
                     <span>PRIVATE</span> <span className="text-[#f27d26]">ENVIRONMENT</span>
                   </div>
                 </RevealText>
                 <div className="flex justify-center md:justify-end">
                    <RevealText>
                       <p className="text-white/40 leading-relaxed max-w-xl text-sm sm:text-base md:text-lg italic font-serif text-center md:text-right md:border-r-2 border-[#f27d26] md:pr-6 px-4 md:px-0">
                         A clinical, modern studio designed for absolute focus. I operate strictly on a one-on-one, appointment-only basis. When you are in the chair, you get zero distractions, complete privacy, and my undivided attention.
                       </p>
                    </RevealText>
                 </div>
              </div>
              
          </div>

          {/* SLIDE 4: BOOKING */}
          <div id="booking-slide" className="w-[100vw] h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 shrink-0 relative bg-[#0a0a0a] text-white overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-[#f27d26]/5 to-transparent"></div>
             <div className="w-[95%] sm:w-full max-w-4xl min-h-[60vh] sm:min-h-0 max-h-[85vh] justify-center overflow-y-auto no-scrollbar z-10 flex flex-col items-center border border-white/5 p-6 md:p-10 relative">
                 <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30 animate-pulse"></span>
                 <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30 animate-pulse"></span>
                 <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30 animate-pulse"></span>
                 <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30 animate-pulse"></span>

                 <RevealText>
                   <span className="text-[#f27d26] font-mono text-xs md:text-sm tracking-widest block mb-1 uppercase">04 &mdash; ENGAGE</span>
                   <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-sans uppercase tracking-tighter mb-2 leading-none">
                     SECURE <span className="text-[#f27d26]">A SESSION</span>
                   </h2>
                 </RevealText>
                 
                 <RevealText>
                   <p className="text-white/50 text-sm sm:text-base md:text-lg italic font-serif max-w-2xl mx-auto mb-6 text-center leading-relaxed">
                     My books open selectively. I filter projects based on concept compatibility, alignment with my style, and commitment to the piece. If you want serious, permanent art, get in touch below.
                   </p>
                 </RevealText>

                 {/* Premium Contact Us CTA Block */}
                 <div className="mt-8 flex justify-center w-full">
                   <button
                     type="button"
                     onClick={() => {
                       setContactPrefill({ placement: "", concept: "", discipline: "Darkwork" });
                       setIsContactOpen(true);
                     }}
                     className="group relative px-8 py-4 sm:px-10 sm:py-5 border border-[#f27d26] rounded-full flex items-center justify-center gap-4 overflow-hidden transition-all duration-300 hover:bg-[#f27d26] hover:shadow-[0_0_25px_rgba(242,125,38,0.35)] pointer-events-auto cursor-pointer"
                   >
                     {/* Interactive hover background scale */}
                     <span className="absolute inset-0 bg-[#f27d26] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0" />
                     
                     <div className="relative z-10 flex items-center gap-4">
                       <span className="text-sm sm:text-base font-extrabold font-sans uppercase tracking-[0.2em] text-[#f27d26] group-hover:text-[#050505] transition-colors duration-300">
                         CONTACT US
                       </span>
                       <span className="hidden sm:inline text-[10px] font-mono text-white/40 tracking-[0.15em] uppercase group-hover:text-[#050505]/70 transition-colors duration-300 border-l border-white/25 pl-4 group-hover:border-[#050505]/20">
                         IVANCLAGUE90@GMAIL.COM
                       </span>
                     </div>
                   </button>
                 </div>
             </div>
          </div>
        </motion.div>

        {/* Floating Horizontal Navigation - Fully Responsive on Mobile & Desktop */}
        <div className="absolute bottom-8 left-0 w-full flex justify-between items-end px-4 md:px-12 z-50 pointer-events-none">
          <div className="flex flex-col items-start gap-1 md:gap-4 pointer-events-auto">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 hidden md:block">
              Chapter Navigation
            </span>
            <div className="flex gap-2 sm:gap-4 items-center mb-1 md:mb-0">
              {[0, 1, 2, 3].map((idx) => {
                const label = `0${idx + 1}`;
                const isActive = activeScreen === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => scrollToScreen(idx)} 
                    style={{ textShadow: isActive ? '0 0 10px rgba(242, 125, 38, 0.4)' : 'none' }}
                    className={cn(
                      "text-sm md:text-lg font-black tracking-tighter transition-all duration-300 relative py-1",
                      isActive ? "text-[#f27d26] scale-110 font-black relative" : "text-white/40 hover:text-white"
                    )}
                  >
                    {label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeHorizontalDot" 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f27d26]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute left-1/2 -translate-x-1/2 flex md:hidden flex-col items-center gap-1 drop-shadow-md pointer-events-none mb-1"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white font-semibold">Swipe Up</span>
            <ArrowUp className="w-4 h-4 text-[#f27d26] animate-bounce" />
          </motion.div>
          
          <div className="flex flex-col items-end gap-2 pointer-events-auto shrink-0">
            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={() => {
                  const current = activeScreen;
                  if (current > 0) scrollToScreen(current - 1);
                }} 
                className={cn(
                  "h-9 w-9 md:h-12 md:w-12 border flex items-center justify-center transition-all duration-300",
                  activeScreen === 0 
                    ? "border-white/5 text-white/10 cursor-not-allowed" 
                    : "border-white/10 hover:bg-white/5 text-white cursor-pointer"
                )}
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
              </button>
              <button 
                onClick={() => {
                  const current = activeScreen;
                  if (current < 3) scrollToScreen(current + 1);
                }} 
                className={cn(
                  "h-9 w-9 md:h-12 md:w-12 border flex items-center justify-center transition-all duration-300",
                  activeScreen === 3 
                    ? "border-white/5 text-white/10 cursor-not-allowed bg-transparent" 
                    : "border-[#f27d26] bg-[#f27d26] text-[#050505] hover:bg-[#ff8a33] cursor-pointer"
                )}
              >
                <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReverseScrollGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onInquireBooking={(piece) => {
          scrollToScreen(3);
          setContactPrefill({
            placement: piece.placement,
            concept: `Inspired by Archive Plate ${piece.indexLabel} (${piece.title}). `,
            discipline: piece.category === "Healed" ? "Darkwork" : piece.category,
          });
          setIsContactOpen(true);
        }}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialPlacement={contactPrefill.placement}
        initialConcept={contactPrefill.concept}
        initialDiscipline={contactPrefill.discipline}
      />
    </section>
  );
}
