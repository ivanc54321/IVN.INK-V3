const fs = require('fs');
let code = fs.readFileSync('src/components/HorizontalScroll.tsx', 'utf-8');

// Slide 1 - remove pt-16, center it better
code = code.replace(
  'className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 items-center w-full max-w-7xl pt-16 md:pt-0"',
  'className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 items-center w-full max-w-7xl pt-0 md:pt-0"'
);

// Scale up the image on slide 1 on mobile to fill up more space if needed?
// Let's make sure the flex col on slide 1 text is centered
code = code.replace(
  'className="order-1 md:order-2 flex flex-col justify-center relative"',
  'className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left justify-center relative"'
);

code = code.replace(
  'text-white/40 leading-relaxed max-w-md ml-0 md:ml-12 text-sm sm:text-base md:text-lg italic font-serif',
  'text-white/40 leading-relaxed max-w-md ml-0 md:ml-12 text-sm sm:text-base md:text-lg italic font-serif mx-auto md:mx-0'
);

// Slide 3 text center on mobile
code = code.replace(
  'className="text-white/40 leading-relaxed max-w-xl text-sm sm:text-base md:text-lg italic font-serif text-right border-r-2 border-[#f27d26] pr-4 md:pr-6"',
  'className="text-white/40 leading-relaxed max-w-xl text-sm sm:text-base md:text-lg italic font-serif text-center md:text-right md:border-r-2 border-[#f27d26] md:pr-6 px-4 md:px-0"'
);

code = code.replace(
  'className="flex justify-end"',
  'className="flex justify-center md:justify-end"'
);

fs.writeFileSync('src/components/HorizontalScroll.tsx', code);
