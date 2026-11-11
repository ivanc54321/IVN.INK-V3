const fs = require('fs');
let code = fs.readFileSync('src/components/HorizontalScroll.tsx', 'utf-8');

// Change the navigation back to absolute so it scrolls off properly when you exit horizontal scroll
code = code.replace(
  'className="fixed bottom-24 md:bottom-8 left-0 w-full flex justify-between items-center md:items-end px-4 md:px-12 z-50 pointer-events-none"',
  'className="absolute bottom-16 md:bottom-8 left-0 w-full flex justify-between items-center md:items-end px-4 md:px-12 z-50 pointer-events-none"'
);

// Scale up text on Slide 1
code = code.replace(
  'className="text-2xl sm:text-4xl md:text-[4rem] lg:text-[5rem] xl:text-[6rem]',
  'className="text-[3rem] leading-none sm:text-5xl md:text-[4rem] lg:text-[5rem] xl:text-[6rem]'
);
code = code.replace(
  'text-white/40 leading-relaxed max-w-md ml-0 md:ml-12 text-xs sm:text-sm italic font-serif',
  'text-white/40 leading-relaxed max-w-md ml-0 md:ml-12 text-sm sm:text-base md:text-lg italic font-serif'
);

// Scale up text on Slide 2
code = code.replace(
  'className="text-3xl sm:text-5xl md:text-[5rem]',
  'className="text-5xl sm:text-6xl md:text-[5rem]'
);
code = code.replace(
  'className="text-white/60 leading-relaxed italic font-serif text-[10px] sm:text-xs md:text-sm max-w-[280px]',
  'className="text-white/60 leading-relaxed italic font-serif text-sm sm:text-base md:text-lg max-w-[300px]'
);

// Scale up text on Slide 3
code = code.replace(
  'className="text-[2rem] leading-[1] sm:text-5xl',
  'className="text-[3rem] leading-[1] sm:text-5xl'
);
code = code.replace(
  'className="text-white/40 leading-relaxed max-w-xl text-xs sm:text-sm md:text-base italic font-serif text-right border-r-2 border-[#f27d26] pr-4 md:pr-6"',
  'className="text-white/40 leading-relaxed max-w-xl text-sm sm:text-base md:text-lg italic font-serif text-right border-r-2 border-[#f27d26] pr-4 md:pr-6"'
);

// Scale up text on Slide 4
code = code.replace(
  'className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl',
  'className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
);
code = code.replace(
  'className="text-white/50 text-xs sm:text-sm italic font-serif',
  'className="text-white/50 text-sm sm:text-base md:text-lg italic font-serif'
);

fs.writeFileSync('src/components/HorizontalScroll.tsx', code);
