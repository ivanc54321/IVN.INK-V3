import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, Check, Mail, Copy } from "lucide-react";

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlacement?: string;
  initialConcept?: string;
  initialDiscipline?: string;
}

const DISCIPLINES = ["Darkwork", "Fine-Line", "Realism", "Large Scale"] as const;
const PLACEMENT_SUGGESTIONS = [
  "Inner Forearm",
  "Full Spine / Back",
  "Outer Deltoid",
  "Clavicle & Chest",
  "Full Arm Sleeve",
];

export function ContactModal({
  isOpen,
  onClose,
  initialPlacement = "",
  initialConcept = "",
  initialDiscipline = "Darkwork",
}: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState<string>(initialDiscipline);
  const [placement, setPlacement] = useState(initialPlacement);
  const [concept, setConcept] = useState(initialConcept);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync pre-filled values when opened from a specific gallery piece
  useEffect(() => {
    if (isOpen) {
      if (initialPlacement) setPlacement(initialPlacement);
      if (initialConcept) setConcept(initialConcept);
      if (initialDiscipline) setDiscipline(initialDiscipline);
      setErrorMessage(null);
    }
  }, [isOpen, initialPlacement, initialConcept, initialDiscipline]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !concept.trim()) {
      setErrorMessage("Please complete your name, email address, and project concept.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setPlacement("");
    setConcept("");
    setErrorMessage(null);
    onClose();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("ivanclague90@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const mailtoHref = `mailto:ivanclague90@gmail.com?subject=${encodeURIComponent(
    `IVN.ink Session Inquiry — ${name || "New Client"} (${discipline})`
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nDiscipline: ${discipline}\nPlacement: ${
      placement || "To be discussed"
    }\n\nConcept & Notes:\n${concept}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[110] bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
          onClick={onClose}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Ambient radial glow behind the dialog */}
          <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#f27d26]/10 blur-[130px] rounded-full -z-10" />

          <motion.div
            key="contact-modal-dialog"
            initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/15 p-6 sm:p-10 md:p-12 text-white shadow-2xl my-auto overflow-hidden"
          >
            {/* Architectural Corner Reticles matching the site's brutalist framing */}
            <span className="pointer-events-none absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f27d26]" />
            <span className="pointer-events-none absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f27d26]" />
            <span className="pointer-events-none absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f27d26]" />
            <span className="pointer-events-none absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f27d26]" />

            {/* Top Header Row */}
            <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="font-mono text-xs tracking-[0.25em] uppercase text-[#f27d26] block mb-2"
                >
                  04 &mdash; PRIVATE CONSULTATION
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-sans font-black uppercase tracking-tighter leading-none text-white"
                >
                  CONTACT <span className="text-[#f27d26]">THE STUDIO</span>
                </motion.h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Contact Dialog"
                className="min-h-[40px] min-w-[40px] px-3 py-2 border border-white/15 hover:border-[#f27d26] hover:bg-[#f27d26] text-white/70 hover:text-[#050505] font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer shrink-0"
              >
                <span className="hidden sm:inline">Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <p className="text-white/55 font-serif italic text-sm sm:text-base leading-relaxed pb-2 border-b border-white/10">
                    Share your anatomical placement, preferred style, and concept notes below. Every project is reviewed personally on a strict one-on-one basis.
                  </p>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-[#050505] border border-white/15 focus:border-[#f27d26] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-[#050505] border border-white/15 focus:border-[#f27d26] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Discipline Selector */}
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">
                      Primary Discipline
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DISCIPLINES.map((item) => {
                        const active = discipline === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setDiscipline(item)}
                            className={`py-2.5 px-3 font-mono text-xs uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                              active
                                ? "bg-[#f27d26] border-[#f27d26] text-[#050505] font-bold"
                                : "bg-[#050505] border-white/15 text-white/60 hover:text-white hover:border-white/30"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Placement Input + Quick Suggestions */}
                  <div>
                    <label
                      htmlFor="contact-placement"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2"
                    >
                      Anatomical Placement & Approximate Scale
                    </label>
                    <input
                      id="contact-placement"
                      type="text"
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      placeholder="e.g., Inner Forearm, Full Spine, Outer Deltoid"
                      className="w-full bg-[#050505] border border-white/15 focus:border-[#f27d26] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {PLACEMENT_SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPlacement(item)}
                          className="text-[11px] font-mono text-white/45 hover:text-[#f27d26] transition-colors cursor-pointer"
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concept Textarea */}
                  <div>
                    <label
                      htmlFor="contact-concept"
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2"
                    >
                      Concept Description & Reference Notes *
                    </label>
                    <textarea
                      id="contact-concept"
                      rows={4}
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="Describe the subject matter, contrast preference, and any target timeframe..."
                      className="w-full bg-[#050505] border border-white/15 focus:border-[#f27d26] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-mono text-[#f27d26] bg-[#f27d26]/10 border border-[#f27d26]/30 px-3 py-2">
                      {errorMessage}
                    </p>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                      <Mail className="w-3.5 h-3.5 text-[#f27d26] shrink-0" />
                      <span>IVANCLAGUE90@GMAIL.COM</span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="ml-1 px-2 py-0.5 border border-white/15 hover:border-[#f27d26] text-[10px] uppercase tracking-wider text-white/70 hover:text-[#f27d26] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-[#f27d26]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-[#f27d26] hover:bg-[#ff8f3d] text-[#050505] font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Send Session Inquiry</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="py-6 space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f27d26] text-[#050505] flex items-center justify-center shrink-0">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f27d26] block">
                        Dossier Prepared
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-sans font-black uppercase tracking-tight text-white">
                        Inquiry Ready for Dispatch
                      </h3>
                    </div>
                  </div>

                  <p className="font-serif italic text-white/70 text-base leading-relaxed">
                    Thank you, {name}. Your consultation brief for a{" "}
                    <span className="text-white not-italic font-mono text-xs uppercase">
                      {discipline}
                    </span>{" "}
                    piece ({placement || "Custom Placement"}) has been formatted. Click below to open it directly in your email client or close this window.
                  </p>

                  <div className="p-4 bg-[#050505] border border-white/10 font-mono text-xs text-white/60 space-y-1.5">
                    <div>
                      <span className="text-white/35">CLIENT:</span> {name} · {email}
                    </div>
                    <div>
                      <span className="text-white/35">DISCIPLINE & ZONE:</span> {discipline} ·{" "}
                      {placement || "To be discussed"}
                    </div>
                    <div className="pt-1 text-white/80 line-clamp-3">{concept}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-6 py-3 border border-white/15 hover:border-white/40 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                    <a
                      href={mailtoHref}
                      className="px-7 py-3 bg-[#f27d26] hover:bg-[#ff8f3d] text-[#050505] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Open in Email Client</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
