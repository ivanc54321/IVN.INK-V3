const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// Center vertically overall
code = code.replace(
  'className="relative h-[100dvh] w-full flex items-start overflow-hidden',
  'className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden'
);

// Remove padding top and center horizontally on mobile
code = code.replace(
  'className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 flex flex-col items-end pt-24 md:pt-28 lg:pt-32"',
  'className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 flex flex-col items-center md:items-end"'
);

// Center the "00 - BEGINNING" on mobile
code = code.replace(
  'className="mb-4 md:mb-6 flex justify-end w-full"',
  'className="mb-4 md:mb-6 flex justify-center md:justify-end w-full"'
);

// Center the title on mobile
code = code.replace(
  'text-right absolute right-0 top-0 flex flex-col items-end',
  'text-center md:text-right absolute left-0 md:left-auto md:right-0 top-0 flex flex-col items-center md:items-end'
);

// Center the animated words on mobile
code = code.replace(
  'className="text-[#f27d26] overflow-hidden relative h-[1.15em] w-full flex justify-end"',
  'className="text-[#f27d26] overflow-hidden relative h-[1.15em] w-full flex justify-center md:justify-end"'
);
code = code.replace(
  'className="absolute right-0 h-full flex items-center justify-end whitespace-nowrap"',
  'className="absolute md:right-0 h-full flex items-center justify-center md:justify-end whitespace-nowrap"'
);

// Center the paragraph on mobile
code = code.replace(
  'mix-blend-screen text-right flex flex-col items-end absolute right-0 top-0 h-full justify-center w-full',
  'mix-blend-screen text-center md:text-right flex flex-col items-center md:items-end absolute md:right-0 top-0 h-full justify-center w-full'
);
code = code.replace(
  'className="overflow-hidden py-[1px] pl-4"',
  'className="overflow-hidden py-[1px] md:pl-4"'
);

// Swipe Up indicator move up slightly
code = code.replace(
  'className="absolute bottom-36 sm:bottom-40 z-20 w-full flex md:hidden justify-center items-center gap-3 drop-shadow-md"',
  'className="absolute bottom-32 sm:bottom-40 z-20 w-full flex md:hidden justify-center items-center gap-3 drop-shadow-md"'
);

fs.writeFileSync('src/components/Hero.tsx', code);
