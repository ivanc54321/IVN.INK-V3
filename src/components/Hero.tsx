import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const WORDS = ["ARTISTRY", "CREATIVITY", "FINE-LINE", "REALISM"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tick, setTick] = useState(0);

  const PARAGRAPHS = [
    [
      "A sanctuary for progressive",
      "tattoo art. Discover a portfolio",
      "of custom work."
    ],
    [
      "Connect with Ivan",
      "for your next piece."
    ]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const silenceVideo = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
    }
  };

  useEffect(() => {
    silenceVideo();
  }, []);

  const showTitle = (tick % 8) < 4;
  const currentWordIndex = tick % 4;
  const currentParagraphIndex = (tick % 16) < 8 ? 0 : 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      ref={ref} 
      className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#050505] text-white"
    >
      {/* Background Video (Strictly Muted, Audio Track Stripped) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.video
          ref={videoRef}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={silenceVideo}
          onPlay={silenceVideo}
          onVolumeChange={silenceVideo}
          className="absolute top-1/2 left-1/2 w-full h-full sm:min-w-full sm:min-h-full -translate-x-1/2 -translate-y-1/2 object-cover scale-110 sm:scale-100 opacity-[0.25] sm:opacity-[0.4] pointer-events-none"
        >
          <source src="/0618(1).mp4" type="video/mp4" />
        </motion.video>
        {/* Dark overlay to ensure text contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none h-full w-full opacity-[0.03] z-[1]">
      </div>

      <motion.div
        style={{ y, opacity }}
        className="absolute bottom-20 right-6 md:bottom-8 md:right-12 lg:bottom-10 lg:right-16 z-30 w-full max-w-xl flex flex-col items-end text-right"
      >
        {/* Subtle light glow behind the text in the bottom-right corner to increase legibility */}
        <div className="absolute -right-12 -bottom-12 w-[500px] h-[500px] bg-[#f27d26]/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>
        <div className="absolute -right-8 -bottom-8 w-[320px] h-[320px] bg-white/5 blur-[80px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-2 md:mb-3 flex justify-end w-full"
        >
          <span className="font-mono text-[#f27d26] uppercase tracking-[0.2em] text-xs md:text-sm font-bold animate-[pulse_3s_ease-in-out_infinite]" style={{ marginRight: '-0.2em' }}>
            00 &mdash; BEGINNING
          </span>
        </motion.div>
        
        <div className="min-h-[120px] md:min-h-[115px] w-full relative">
          <AnimatePresence mode="wait">
            {showTitle ? (
              <motion.h1
                key="title"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-5xl sm:text-5xl md:text-[3.5rem] lg:text-[3.5rem] font-sans font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.9] block w-full text-white text-right absolute right-0 bottom-0 flex flex-col items-end justify-end h-full"
              >
                <div style={{ marginRight: '-0.05em' }}>TATTOO</div>
                <div className="text-[#f27d26] overflow-hidden relative h-[1.15em] w-full flex justify-end" style={{ marginRight: '-0.05em' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={currentWordIndex}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute right-0 h-full flex items-center justify-end whitespace-nowrap"
                    >
                      {WORDS[currentWordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.h1>
            ) : (
              <motion.div
                 key={`paragraph-${currentParagraphIndex}`}
                 initial="hidden"
                 animate="visible"
                 exit="hidden"
                 variants={{
                  visible: { transition: { staggerChildren: 0.15 } },
                  hidden: { transition: { staggerChildren: 0.15 } }
                 }}
                 className="text-white/60 leading-relaxed text-base sm:text-lg md:text-base font-sans font-medium mix-blend-screen text-right flex flex-col items-end absolute right-0 bottom-0 h-full justify-end w-full"
              >
                {PARAGRAPHS[currentParagraphIndex].map((line, i) => (
                  <div key={line + i} className="overflow-hidden py-[1px] pl-4">
                     <motion.div
                       variants={{
                          hidden: { x: "100%", opacity: 0 },
                          visible: { x: 0, opacity: 1 }
                       }}
                       transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       className="whitespace-nowrap"
                     >
                       {line}
                     </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Decorative Text Path & Arrow */}

      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 z-20 w-full flex md:hidden justify-center items-center gap-3 drop-shadow-md"
      >
        <span className="text-sm font-mono tracking-[0.2em] uppercase text-white font-semibold">Swipe Up</span>
        <ArrowUp className="w-6 h-6 text-[#f27d26] animate-bounce" />
      </motion.div>

      {/* Perfect bottom edge blend dark gradient. Ensures Page 1 fades smoothly into Page 2. */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none z-20" />
    </motion.section>
  );
}
