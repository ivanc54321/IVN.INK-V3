const fs = require('fs');
const content = fs.readFileSync('real_share.html', 'utf8');

const start = 700000;
const end = 715000;

console.log('Printing content from 700000 to 715000:');
const slice = content.substring(start, end);
fs.writeFileSync('slice_700k.txt', slice);
console.log('Saved slice_700k.txt, length:', slice.length);

// Let's analyze strings or JSON pieces in this slice
// Check if there are any drive/docs/youtube URLs in this slice
const urls = slice.match(/https?:\/\/[^\s"'`,;<>\\\[\]]+/g) || [];
console.log('URLs in 700k-715k slice:', [...new Set(urls)]);
