const fs = require('fs');
let code = fs.readFileSync('src/components/HorizontalScroll.tsx', 'utf-8');

code = code.replace(
  '{[-1, 0, 1, 2, 3].map((idx) => {',
  '{[0, 1, 2, 3].map((idx) => {'
);
code = code.replace(
  'if (current > -1) scrollToScreen(current - 1);',
  'if (current > 0) scrollToScreen(current - 1);'
);
code = code.replace(
  'activeScreen === -1 \n                    ? "border-white/5 text-white/10 cursor-not-allowed"',
  'activeScreen === 0 \n                    ? "border-white/5 text-white/10 cursor-not-allowed"'
);

fs.writeFileSync('src/components/HorizontalScroll.tsx', code);
