import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Maximize2,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";

const tattooDarkworkSpine = "/src/assets/images/tattoo_darkwork_spine_1794395489001.jpg";
const tattooFinelineForearm = "/src/assets/images/tattoo_fineline_forearm_1794395491074.jpg";
const tattooBlackworkShoulder = "/src/assets/images/tattoo_blackwork_shoulder_1794395492072.jpg";
const tattooRealismChest = "/src/assets/images/tattoo_realism_chest_1794395493863.jpg";
const tattooHealedSleeve = "/src/assets/images/tattoo_healed_sleeve_1794395494037.jpg";

export type GalleryCategory = "All" | "Darkwork" | "Fine-Line" | "Realism" | "Healed";

export interface GalleryPiece {
  id: string;
  indexLabel: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  placement: string;
  sessions: string;
  status: string;
  needleSpec: string;
  description: string;
  image: string;
  objectPosition?: string;
}

export const GALLERY_PIECES: GalleryPiece[] = [
  {
    id: "piece-01",
    indexLabel: "01",
    title: "Serpent & Obsidian Spine",
    category: "Darkwork",
    placement: "Full Spine & Dorsal",
    sessions: "3 Sessions · 16 Hours",
    status: "Healed 6 Months",
    needleSpec: "3RL Tight · 9CM Soft Edge",
    description:
      "Engineered to follow the natural articulation of the vertebrae. Heavy blackwork coiling contrasted with botanical stipple shading that breathes with shoulder movement.",
    image: tattooDarkworkSpine,
    objectPosition: "center center",
  },
  {
    id: "piece-02",
    indexLabel: "02",
    title: "Nubian Sovereign Study",
    category: "Realism",
    placement: "Outer Thigh & Hip",
    sessions: "2 Sessions · 12 Hours",
    status: "Fresh Ink",
    needleSpec: "1RL Micro · 11RM Curved Magnum",
    description:
      "High-contrast chiaroscuro portrait study balancing deep carbon black shadows against bare skin highlights for timeless sculptural depth.",
    image: "/nubia tat.jpg",
    objectPosition: "center center",
  },
  {
    id: "piece-03",
    indexLabel: "03",
    title: "Classical Bust & Sacred Geometry",
    category: "Fine-Line",
    placement: "Inner Forearm",
    sessions: "1 Session · 7 Hours",
    status: "Healed 1 Year",
    needleSpec: "1RL Single Needle · 3RL Bugpin",
    description:
      "Micro-stippled Hellenistic marble portraiture anchored by razor-sharp geometric construction lines. Zero blowout and crisp healed retention.",
    image: tattooFinelineForearm,
    objectPosition: "center center",
  },
  {
    id: "piece-04",
    indexLabel: "04",
    title: "Chiaroscuro Forearm Sleeve",
    category: "Healed",
    placement: "Lower Arm Wrap",
    sessions: "2 Sessions · 14 Hours",
    status: "Healed 10 Months",
    needleSpec: "5RL · 15RM Weaved Magnum",
    description:
      "Full wraparound dark realism composition photographed under raw studio lighting ten months post-session to showcase settled matte black saturation.",
    image: "/arm.jpeg",
    objectPosition: "center center",
  },
  {
    id: "piece-05",
    indexLabel: "05",
    title: "Cyber-Sigil Deltoid Armor",
    category: "Darkwork",
    placement: "Outer Shoulder & Bicep",
    sessions: "2 Sessions · 11 Hours",
    status: "Fresh Ink",
    needleSpec: "7RL Bold · 13M1 Solid Fill",
    description:
      "Aggressive architectural blackwork plates contoured around the deltoid insertion. Designed freehand directly on the skin for anatomical precision.",
    image: tattooBlackworkShoulder,
    objectPosition: "center top",
  },
  {
    id: "piece-06",
    indexLabel: "06",
    title: "Gothic Vault & Corvid",
    category: "Fine-Line",
    placement: "Clavicle & Upper Chest",
    sessions: "2 Sessions · 10 Hours",
    status: "Healed 4 Months",
    needleSpec: "3RL Bugpin · Whip Stipple",
    description:
      "Cathedral tracery meets skeletal avian anatomy across the collarbone. Delicate directional whip-shading preserves an airy, etching-like texture.",
    image: tattooRealismChest,
    objectPosition: "center 35%",
  },
  {
    id: "piece-07",
    indexLabel: "07",
    title: "Metatron & Memento Mori Sleeve",
    category: "Healed",
    placement: "Full Arm Sleeve",
    sessions: "5 Sessions · 32 Hours",
    status: "Healed 14 Months",
    needleSpec: "3RL · 7RL · 15CM",
    description:
      "Multi-stage full sleeve integrating sacred mandala dotwork at the shoulder cap with sunken skull realism and runic script along the forearm.",
    image: tattooHealedSleeve,
    objectPosition: "center center",
  },
  {
    id: "piece-08",
    indexLabel: "08",
    title: "Private Studio Session I",
    category: "Realism",
    placement: "Forearm & Wrist",
    sessions: "1 Session · 8 Hours",
    status: "In Progress",
    needleSpec: "3RL · 9RM Greywash",
    description:
      "Documentary capture inside the IVN.ink sanctuary. Every piece is executed in complete isolation with custom-mixed opaque greywash tones.",
    image: "/artist_profile_new.png",
    objectPosition: "center center",
  },
  {
    id: "piece-09",
    indexLabel: "09",
    title: "Vertebral Botanical Axis",
    category: "Fine-Line",
    placement: "Upper Back & Neck",
    sessions: "2 Sessions · 9 Hours",
    status: "Healed 8 Months",
    needleSpec: "1RL · 3RL Tight Liner",
    description:
      "Close-up study of upper-cervical needle control where fine fern fronds taper into the hairline without heavy outline borders.",
    image: tattooDarkworkSpine,
    objectPosition: "center 20%",
  },
  {
    id: "piece-10",
    indexLabel: "10",
    title: "Sovereign Gaze Macro Detail",
    category: "Realism",
    placement: "Upper Arm",
    sessions: "2 Sessions · 13 Hours",
    status: "Healed 5 Months",
    needleSpec: "3RL · 7CM Smooth Blend",
    description:
      "Macro crop highlighting smooth tonal transitions and micro-texture work across metallic ornaments and skin highlights.",
    image: "/nubia tat.jpg",
    objectPosition: "center 25%",
  },
  {
    id: "piece-11",
    indexLabel: "11",
    title: "Biomech & Geometric Flow",
    category: "Darkwork",
    placement: "Mid Bicep & Tricep",
    sessions: "2 Sessions · 12 Hours",
    status: "Fresh Ink",
    needleSpec: "5RL · 11M1 Blackout",
    description:
      "High-contrast negative-space channels carved through solid blackwork fields, creating optical depth that shifts as the arm rotates.",
    image: tattooBlackworkShoulder,
    objectPosition: "center 70%",
  },
  {
    id: "piece-12",
    indexLabel: "12",
    title: "Sacred Geometry Wrist Cuff",
    category: "Healed",
    placement: "Distal Forearm & Hand",
    sessions: "2 Sessions · 11 Hours",
    status: "Healed 1 Year",
    needleSpec: "3RL · 5RS Dotwork",
    description:
      "Intricate dotwork mandala transitioning into heavy darkwork shading across the wrist joint, engineered for high-mobility longevity.",
    image: tattooHealedSleeve,
    objectPosition: "center 80%",
  },
];

const CATEGORIES: GalleryCategory[] = ["All", "Darkwork", "Fine-Line", "Realism", "Healed"];

function ResilientArtwork({
  src,
  alt,
  objectPosition = "center center",
  className = "",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`w-full h-full bg-[#0d0d0d] flex flex-col items-center justify-center p-6 text-center border border-white/10 ${className}`}
      >
        <div className="w-12 h-12 border border-[#f27d26]/40 rotate-45 flex items-center justify-center mb-4">
          <div className="w-4 h-4 bg-[#f27d26]/80" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/70">
          {alt}
        </span>
        <span className="font-serif italic text-xs text-white/40 mt-1">
          IVN.ink Archival Plate
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      style={{ objectPosition }}
      className={`w-full h-full object-cover select-none ${className}`}
      draggable={false}
    />
  );
}

interface GalleryCardProps {
  key?: React.Key;
  piece: GalleryPiece;
  onSelect: (piece: GalleryPiece) => void;
}

function GalleryCard({ piece, onSelect }: GalleryCardProps) {
  return (
    <figure
      onClick={() => onSelect(piece)}
      className="group relative w-full aspect-[3/4] bg-[#0a0a0a] border border-white/10 overflow-hidden cursor-pointer shrink-0 transition-colors duration-200 hover:border-[#f27d26]/70"
    >
      <ResilientArtwork
        src={piece.image}
        alt={piece.title}
        objectPosition={piece.objectPosition}
        className="grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
      />

      {/* Measured contrast scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-200" />

      {/* Top index & expand affordance */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between pointer-events-none">
        <span className="font-mono tabular-nums text-[11px] tracking-[0.2em] text-white/70 group-hover:text-[#f27d26] transition-colors">
          {piece.indexLabel} / 12
        </span>
        <span className="w-7 h-7 sm:w-8 sm:h-8 bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white/70 group-hover:text-[#050505] group-hover:bg-[#f27d26] group-hover:border-[#f27d26] transition-all duration-200">
          <Maximize2 className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Bottom caption with unboxed metadata (Zero-Pill discipline) */}
      <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 flex flex-col justify-end pointer-events-none">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-white/60 tracking-wider mb-1 truncate">
          <span className="text-[#f27d26]">{piece.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{piece.placement}</span>
        </div>
        <h3 className="text-sm sm:text-lg md:text-xl font-sans font-black uppercase tracking-tight text-white leading-tight group-hover:text-[#f27d26] transition-colors">
          {piece.title}
        </h3>
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-serif italic text-white/50 mt-1">
          <span>{piece.sessions}</span>
          <span aria-hidden="true">·</span>
          <span>{piece.status}</span>
        </div>
      </figcaption>
    </figure>
  );
}

interface ReverseScrollGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onInquireBooking?: (piece: GalleryPiece) => void;
}

export function ReverseScrollGallery({
  isOpen,
  onClose,
  onInquireBooking,
}: ReverseScrollGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [selectedPiece, setSelectedPiece] = useState<GalleryPiece | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const normalColRef = useRef<HTMLDivElement>(null);
  const [maxTravel, setMaxTravel] = useState(1400);

  // Authoritative scroll position in pixels [0, maxTravel]
  const scrollPosRef = useRef<number>(0);
  const autoScrollDirectionRef = useRef<1 | -1>(1);
  const lastManualInteractionRef = useRef<number>(0);
  const programmaticScrollRef = useRef<boolean>(false);

  // Direct MotionValue [0..1] for immediate, lag-free desktop wheel & auto-scroll updates
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.25,
    restDelta: 0.0001,
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setScrollPercent(Math.round(Math.max(0, Math.min(1, latest)) * 100));
  });

  // Normal columns move UP from 0px to -maxTravel as you scroll down
  const normalY = useTransform(smoothProgress, [0, 1], [0, -maxTravel]);
  // Reverse columns start at -maxTravel and move DOWN to 0px as you scroll down
  const reverseY = useTransform(smoothProgress, [0, 1], [-maxTravel, 0]);

  // Mouse drag-to-scroll state for desktop pointer swiping
  const dragStateRef = useRef<{
    isDown: boolean;
    startY: number;
    startScrollTop: number;
    dragged: boolean;
  }>({
    isDown: false,
    startY: 0,
    startScrollTop: 0,
    dragged: false,
  });

  // Track responsive breakpoint (3 columns on desktop >=768px, 2 columns on mobile <768px)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter pieces by selected category
  const filteredPieces = useMemo(() => {
    if (activeCategory === "All") return GALLERY_PIECES;
    const matches = GALLERY_PIECES.filter((p) => p.category === activeCategory);
    if (matches.length < 6) {
      return [...matches, ...matches, ...matches].slice(0, 9);
    }
    return matches;
  }, [activeCategory]);

  // Distribute pieces into 3 columns on desktop, or 2 columns on mobile
  const columns = useMemo(() => {
    const colCount = isDesktop ? 3 : 2;
    const cols: GalleryPiece[][] = Array.from({ length: colCount }, () => []);
    filteredPieces.forEach((piece, index) => {
      cols[index % colCount].push(piece);
    });
    return cols;
  }, [filteredPieces, isDesktop]);

  // Helper to set scroll position cleanly and sync both MotionValue and native scrollbar
  const applyScrollPosition = useCallback(
    (nextPx: number, syncDOM = true) => {
      const clampedPx = Math.max(0, Math.min(maxTravel, nextPx));
      scrollPosRef.current = clampedPx;
      const ratio = maxTravel > 0 ? clampedPx / maxTravel : 0;
      rawProgress.set(ratio);

      if (syncDOM && scrollContainerRef.current) {
        programmaticScrollRef.current = true;
        scrollContainerRef.current.scrollTop = clampedPx;
      }
    },
    [maxTravel, rawProgress]
  );

  // Measure column height vs viewport height to compute exact counter-scroll travel distance
  const updateMeasurements = useCallback(() => {
    if (!normalColRef.current || !scrollContainerRef.current) return;
    const colHeight = normalColRef.current.scrollHeight;
    const viewportHeight = scrollContainerRef.current.clientHeight;
    const computedTravel = Math.max(300, colHeight - viewportHeight);
    setMaxTravel(computedTravel);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Reset to start and enable auto-scroll whenever gallery is opened
    scrollPosRef.current = 0;
    autoScrollDirectionRef.current = 1;
    lastManualInteractionRef.current = 0;
    rawProgress.set(0);
    setIsAutoScrollEnabled(true);

    const t1 = setTimeout(updateMeasurements, 50);
    const t2 = setTimeout(updateMeasurements, 300);
    window.addEventListener("resize", updateMeasurements);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [isOpen, columns, isDesktop, updateMeasurements, rawProgress]);

  // Continuous Auto-Scroll loop when gallery is open
  useEffect(() => {
    if (!isOpen || !isAutoScrollEnabled || selectedPiece) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();
    // Smooth editorial cruise speed in pixels per second
    const speedPxPerSec = 68;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimestamp) / 1000);
      lastTimestamp = now;

      // Pause auto-scroll briefly (1.6s) while user is actively scrolling with mouse/touch
      const timeSinceManual = now - lastManualInteractionRef.current;
      if (!dragStateRef.current.isDown && timeSinceManual > 1600 && maxTravel > 0) {
        let nextPx =
          scrollPosRef.current + autoScrollDirectionRef.current * speedPxPerSec * dt;

        if (nextPx >= maxTravel) {
          nextPx = maxTravel;
          autoScrollDirectionRef.current = -1;
        } else if (nextPx <= 0) {
          nextPx = 0;
          autoScrollDirectionRef.current = 1;
        }

        applyScrollPosition(nextPx, true);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, isAutoScrollEnabled, selectedPiece, maxTravel, applyScrollPosition]);

  // Lock background page scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Keyboard navigation (Escape to close, Up/Down/PageUp/PageDown to scroll, Left/Right in lightbox)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPiece) {
          setSelectedPiece(null);
        } else {
          onClose();
        }
      } else if (selectedPiece && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const currentIndex = GALLERY_PIECES.findIndex((p) => p.id === selectedPiece.id);
        if (currentIndex === -1) return;
        const nextIndex =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % GALLERY_PIECES.length
            : (currentIndex - 1 + GALLERY_PIECES.length) % GALLERY_PIECES.length;
        setSelectedPiece(GALLERY_PIECES[nextIndex]);
      } else if (!selectedPiece && (e.key === "ArrowDown" || e.key === "PageDown")) {
        e.preventDefault();
        lastManualInteractionRef.current = performance.now();
        applyScrollPosition(scrollPosRef.current + (e.key === "PageDown" ? 320 : 120), true);
      } else if (!selectedPiece && (e.key === "ArrowUp" || e.key === "PageUp")) {
        e.preventDefault();
        lastManualInteractionRef.current = performance.now();
        applyScrollPosition(scrollPosRef.current - (e.key === "PageUp" ? 320 : 120), true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedPiece, onClose, applyScrollPosition]);

  // Reset scroll to top when switching category tabs
  const handleCategoryChange = (category: GalleryCategory) => {
    setActiveCategory(category);
    autoScrollDirectionRef.current = 1;
    applyScrollPosition(0, true);
  };

  // Direct Desktop Mouse Wheel & Trackpad Handler for ultra-responsive desktop scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (selectedPiece) return;

    // Prevent default so we control the exact speed and smoothness on all mice/trackpads
    e.preventDefault();
    lastManualInteractionRef.current = performance.now();

    // Support both vertical wheel (deltaY) and horizontal wheel/tilt (deltaX)
    const primaryDelta =
      Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    // Normalize line-mode (deltaMode === 1) and page-mode (deltaMode === 2) mice
    let pixelDelta = primaryDelta;
    if (e.deltaMode === 1) {
      pixelDelta *= 38;
    } else if (e.deltaMode === 2) {
      pixelDelta *= 360;
    } else {
      pixelDelta *= 1.35;
    }

    if (pixelDelta > 0) {
      autoScrollDirectionRef.current = 1;
    } else if (pixelDelta < 0) {
      autoScrollDirectionRef.current = -1;
    }

    applyScrollPosition(scrollPosRef.current + pixelDelta, true);
  };

  // Native scroll handler (for mobile finger-swipe momentum & desktop scrollbar thumb drag)
  const handleNativeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (programmaticScrollRef.current) {
      programmaticScrollRef.current = false;
      return;
    }
    const currentTop = e.currentTarget.scrollTop;
    lastManualInteractionRef.current = performance.now();
    if (currentTop > scrollPosRef.current) {
      autoScrollDirectionRef.current = 1;
    } else if (currentTop < scrollPosRef.current) {
      autoScrollDirectionRef.current = -1;
    }
    applyScrollPosition(currentTop, false);
  };

  // Desktop mouse click-and-drag support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      isDown: true,
      startY: e.clientY,
      startScrollTop: scrollPosRef.current,
      dragged: false,
    };
    lastManualInteractionRef.current = performance.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const deltaY = e.clientY - dragStateRef.current.startY;
    if (Math.abs(deltaY) > 6) {
      dragStateRef.current.dragged = true;
    }
    lastManualInteractionRef.current = performance.now();
    const targetScroll = dragStateRef.current.startScrollTop - deltaY * 1.6;
    applyScrollPosition(targetScroll, true);
  };

  const handleMouseUp = () => {
    if (dragStateRef.current.isDown) {
      dragStateRef.current.isDown = false;
      lastManualInteractionRef.current = performance.now();
    }
  };

  const handleCardSelect = (piece: GalleryPiece) => {
    if (dragStateRef.current.dragged) {
      dragStateRef.current.dragged = false;
      return;
    }
    setSelectedPiece(piece);
  };

  const navigateLightbox = (direction: 1 | -1) => {
    if (!selectedPiece) return;
    const currentIndex = GALLERY_PIECES.findIndex((p) => p.id === selectedPiece.id);
    const nextIndex =
      (currentIndex + direction + GALLERY_PIECES.length) % GALLERY_PIECES.length;
    setSelectedPiece(GALLERY_PIECES[nextIndex]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="reverse-scroll-gallery-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col overflow-hidden select-none"
          onTouchStart={(e) => {
            e.stopPropagation();
            lastManualInteractionRef.current = performance.now();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
            lastManualInteractionRef.current = performance.now();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            lastManualInteractionRef.current = performance.now();
          }}
          onWheel={handleWheel}
        >
          {/* Fixed Top Header Bar (3-Zone Contract) */}
          <header className="relative z-30 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 shrink-0">
            {/* Zone 1: Brand Lockup */}
            <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
              <span className="text-sm sm:text-base font-sans font-black tracking-tighter uppercase text-white">
                IVN<span className="text-[#f27d26]">.INK</span> ARCHIVE
              </span>
            </div>

            {/* Zone 2: Interactive Category Filter Controls */}
            <nav
              aria-label="Gallery discipline filter"
              className="hidden lg:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#f27d26] text-[#050505] font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {category === "All" ? "All Works" : category}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Primary Close Action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Gallery"
                className="min-h-[40px] px-4 py-2 border border-white/15 hover:border-[#f27d26] hover:bg-[#f27d26] text-white hover:text-[#050505] font-mono text-xs tracking-widest uppercase flex items-center gap-2 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Compact Filter Strip on Mobile/Tablet */}
          <div className="flex lg:hidden items-center gap-1.5 px-4 py-2 bg-[#080808] border-b border-white/10 overflow-x-auto no-scrollbar shrink-0 z-30">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#f27d26] text-[#050505] font-bold"
                      : "text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  {category === "All" ? "All Works" : category}
                </button>
              );
            })}
          </div>

          {/* Main Scrollable Viewport Driving the Reverse-Scroll Columns */}
          <div
            ref={scrollContainerRef}
            onScroll={handleNativeScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative flex-1 w-full overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y cursor-grab active:cursor-grabbing"
          >
            {/* Tall Scroll Track that provides native touch-swipe momentum & scrollbar */}
            <div
              style={{ height: `calc(100dvh + ${maxTravel}px)` }}
              className="relative w-full"
            >
              {/* Sticky Stage holding the counter-scrolling columns */}
              <div className="sticky top-0 h-[calc(100dvh-64px)] w-full overflow-hidden px-3 sm:px-6 md:px-12">
                {/* Top & Bottom Edge Contrast Vignettes */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-20" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent z-20" />

                {isDesktop ? (
                  /* DESKTOP: 3 Columns — Outer columns scroll in REVERSE (downward), Center column scrolls NORMALLY (upward) */
                  <div className="grid grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto h-full items-start">
                    {/* Column 1: Reverse Scroll (flex-col-reverse, translates from -maxTravel to 0) */}
                    <motion.div
                      style={{ y: reverseY }}
                      className="flex flex-col-reverse gap-6 lg:gap-8 py-8 will-change-transform"
                    >
                      {columns[0]?.map((piece, idx) => (
                        <GalleryCard
                          key={`desk-col0-${piece.id}-${idx}`}
                          piece={piece}
                          onSelect={handleCardSelect}
                        />
                      ))}
                    </motion.div>

                    {/* Column 2 (Center): Normal Scroll (flex-col, translates from 0 to -maxTravel) */}
                    <motion.div
                      ref={normalColRef}
                      style={{ y: normalY }}
                      className="flex flex-col gap-6 lg:gap-8 py-8 will-change-transform"
                    >
                      {columns[1]?.map((piece, idx) => (
                        <GalleryCard
                          key={`desk-col1-${piece.id}-${idx}`}
                          piece={piece}
                          onSelect={handleCardSelect}
                        />
                      ))}
                    </motion.div>

                    {/* Column 3: Reverse Scroll (flex-col-reverse, translates from -maxTravel to 0) */}
                    <motion.div
                      style={{ y: reverseY }}
                      className="flex flex-col-reverse gap-6 lg:gap-8 py-8 will-change-transform"
                    >
                      {columns[2]?.map((piece, idx) => (
                        <GalleryCard
                          key={`desk-col2-${piece.id}-${idx}`}
                          piece={piece}
                          onSelect={handleCardSelect}
                        />
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  /* MOBILE: 2 Columns — Left column scrolls NORMALLY (upward), Right column scrolls in REVERSE (downward) */
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto h-full items-start">
                    {/* Mobile Column 1 (Left): Normal Scroll */}
                    <motion.div
                      ref={normalColRef}
                      style={{ y: normalY }}
                      className="flex flex-col gap-3 sm:gap-4 py-6 will-change-transform"
                    >
                      {columns[0]?.map((piece, idx) => (
                        <GalleryCard
                          key={`mob-col0-${piece.id}-${idx}`}
                          piece={piece}
                          onSelect={handleCardSelect}
                        />
                      ))}
                    </motion.div>

                    {/* Mobile Column 2 (Right): Reverse Scroll */}
                    <motion.div
                      style={{ y: reverseY }}
                      className="flex flex-col-reverse gap-3 sm:gap-4 py-6 will-change-transform"
                    >
                      {columns[1]?.map((piece, idx) => (
                        <GalleryCard
                          key={`mob-col1-${piece.id}-${idx}`}
                          piece={piece}
                          onSelect={handleCardSelect}
                        />
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Counter-Scroll Status, Auto-Scroll Toggle & Instruction Bar */}
          <footer className="relative z-30 flex items-center justify-between px-4 sm:px-8 md:px-12 py-2.5 bg-[#050505]/95 border-t border-white/10 text-[11px] font-mono text-white/60 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAutoScrollEnabled((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-white/15 hover:border-[#f27d26] text-white/80 hover:text-[#f27d26] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isAutoScrollEnabled ? (
                  <>
                    <Pause className="w-3 h-3 text-[#f27d26]" />
                    <span>Auto-Scroll: On</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#f27d26]" />
                    <span>Auto-Scroll: Paused</span>
                  </>
                )}
              </button>
              <span className="hidden sm:inline-flex items-center gap-1.5 uppercase tracking-wider text-white/50">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#f27d26]" />
                Mouse Wheel, Drag, or Swipe · Click Any Piece to Inspect
              </span>
            </div>

            <div className="flex items-center gap-3 tabular-nums shrink-0">
              <div className="hidden sm:block w-24 h-[2px] bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#f27d26] transition-all duration-150"
                  style={{ width: `${scrollPercent}%` }}
                />
              </div>
              <span className="text-[#f27d26] font-bold">{scrollPercent}%</span>
            </div>
          </footer>

          {/* Fullscreen Piece Detail Lightbox Modal */}
          <AnimatePresence>
            {selectedPiece && (
              <motion.div
                key="piece-detail-lightbox"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-[120] bg-[#050505]/98 backdrop-blur-xl flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
                onClick={() => setSelectedPiece(null)}
              >
                {/* Lightbox Top-Right Controls */}
                <div
                  className="fixed top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => navigateLightbox(-1)}
                    aria-label="Previous piece"
                    className="w-10 h-10 bg-black/80 border border-white/15 hover:border-[#f27d26] text-white hover:text-[#f27d26] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateLightbox(1)}
                    aria-label="Next piece"
                    className="w-10 h-10 bg-black/80 border border-white/15 hover:border-[#f27d26] text-white hover:text-[#f27d26] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPiece(null)}
                    aria-label="Close piece details"
                    className="h-10 px-4 bg-[#f27d26] text-[#050505] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#ff8f3d] transition-colors cursor-pointer"
                  >
                    <span>Back to Gallery</span>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Left Column: High-Resolution Artwork Stage */}
                <div
                  className="w-full lg:w-3/5 min-h-[52vh] lg:h-full bg-[#080808] flex items-center justify-center p-4 sm:p-10 lg:p-16 relative border-b lg:border-b-0 lg:border-r border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full max-w-lg aspect-[3/4] border border-white/15 shadow-2xl overflow-hidden bg-[#0a0a0a]">
                    <ResilientArtwork
                      src={selectedPiece.image}
                      alt={selectedPiece.title}
                      objectPosition={selectedPiece.objectPosition}
                    />
                  </div>
                </div>

                {/* Right Column: Monograph Editorial Details */}
                <div
                  className="w-full lg:w-2/5 lg:h-full flex flex-col justify-center p-6 sm:p-10 lg:p-14 bg-[#050505]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 font-mono tabular-nums text-xs tracking-[0.2em] uppercase text-[#f27d26] mb-3">
                      <span>Archive Plate {selectedPiece.indexLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedPiece.category}</span>
                    </div>

                    <h2
                      className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-tighter text-white leading-none mb-4"
                      style={{ textWrap: "balance" }}
                    >
                      {selectedPiece.title}
                    </h2>

                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-white/60 pb-6 mb-6 border-b border-white/10">
                      <span>{selectedPiece.placement}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedPiece.sessions}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white/90">{selectedPiece.status}</span>
                    </div>

                    <p className="font-serif italic text-base sm:text-lg text-white/75 leading-relaxed mb-8">
                      {selectedPiece.description}
                    </p>

                    {/* Technical Specifications Grid */}
                    <div className="grid grid-cols-2 gap-6 py-5 border-t border-b border-white/10 mb-8">
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          Needle Grouping
                        </span>
                        <span className="font-mono text-xs text-white/90">
                          {selectedPiece.needleSpec}
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          Anatomical Zone
                        </span>
                        <span className="font-mono text-xs text-white/90">
                          {selectedPiece.placement}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const pieceToInquire = selectedPiece;
                          setSelectedPiece(null);
                          onClose();
                          if (onInquireBooking) {
                            onInquireBooking(pieceToInquire);
                          }
                        }}
                        className="px-6 py-3.5 bg-[#f27d26] hover:bg-[#ff8f3d] text-[#050505] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Inquire About Similar Piece</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
