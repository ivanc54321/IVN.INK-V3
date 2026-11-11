const fs = require('fs');
const content = fs.readFileSync('real_share.html', 'utf8');

const terms = ['video', 'background', 'drive', 'youtube', '5f3c61a42bc5', '369ffb66-f415-4bea-9573-b33898b975a0'];

terms.forEach(term => {
  console.log(`\n=== SCANS FOR "${term}" ===`);
  let idx = content.indexOf(term);
  let count = 0;
  while (idx !== -1 && count < 10) {
    console.log(`Match ${count++} at position ${idx}:`);
    console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 200)));
    idx = content.indexOf(term, idx + 1);
  }
});
