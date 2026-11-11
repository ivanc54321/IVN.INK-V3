const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// Title size
code = code.replace(
  'className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[3.5rem]',
  'className="text-6xl sm:text-5xl md:text-[3.5rem] lg:text-[3.5rem]'
);

// Paragraph size
code = code.replace(
  'className="text-white/60 leading-relaxed text-xs sm:text-sm md:text-base',
  'className="text-white/60 leading-relaxed text-base sm:text-lg md:text-base'
);

// Increase height of the relative container so text has more room and doesn't overlap
code = code.replace(
  'className="min-h-[100px] md:min-h-[130px] w-full relative"',
  'className="min-h-[160px] md:min-h-[130px] w-full relative mt-4 md:mt-0"'
);

// Move swipe up text slightly higher so it's not cut off
code = code.replace(
  'className="absolute bottom-32 sm:bottom-40',
  'className="absolute bottom-28 sm:bottom-40'
);

fs.writeFileSync('src/components/Hero.tsx', code);
