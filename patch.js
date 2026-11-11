const fs = require('fs');
let code = fs.readFileSync('src/components/HorizontalScroll.tsx', 'utf-8');

code = code.replace(
  'const { scrollYProgress } = useScroll({',
  'const { scrollYProgress, scrollY } = useScroll({\n'
);

code = code.replace(
  /useMotionValueEvent\(scrollYProgress, "change", \(latest\) => \{[\s\S]*?setActiveScreen\(index\);\n  \}\);/,
  `useMotionValueEvent(scrollY, "change", (latest) => {
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
  });`
);

code = code.replace(
  'const scrollToScreen = (screenIndex: number) => {',
  `const scrollToScreen = (screenIndex: number) => {
    if (screenIndex === -1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }`
);

code = code.replace(
  '<div className="absolute bottom-24 md:bottom-8 w-full flex justify-between items-center md:items-end px-4 md:px-12 z-50 pointer-events-none">',
  '<div className="fixed bottom-24 md:bottom-8 left-0 w-full flex justify-between items-center md:items-end px-4 md:px-12 z-50 pointer-events-none">'
);

code = code.replace(
  '{[0, 1, 2, 3].map((idx) => {',
  '{[-1, 0, 1, 2, 3].map((idx) => {'
);

code = code.replace(
  'if (current > 0) scrollToScreen(current - 1);',
  'if (current > -1) scrollToScreen(current - 1);'
);

code = code.replace(
  'activeScreen === 0 \n                    ? "border-white/5 text-white/10 cursor-not-allowed"',
  'activeScreen === -1 \n                    ? "border-white/5 text-white/10 cursor-not-allowed"'
);

fs.writeFileSync('src/components/HorizontalScroll.tsx', code);
