const fs = require('fs');
let code = fs.readFileSync('src/components/HorizontalScroll.tsx', 'utf-8');
code = code.replace('h-screen', 'h-[100dvh]');
fs.writeFileSync('src/components/HorizontalScroll.tsx', code);

let hero = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
hero = hero.replace('h-screen', 'h-[100dvh]');
fs.writeFileSync('src/components/Hero.tsx', hero);
