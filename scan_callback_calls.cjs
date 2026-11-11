const fs = require('fs');
const content = fs.readFileSync('real_share.html', 'utf8');

const term = 'AF_initDataCallback';
let pos = content.indexOf(term);
console.log('Searching for calls to AF_initDataCallback:');
let count = 0;
while (pos !== -1) {
  console.log(`\nMatch ${count++} at position ${pos}:`);
  console.log(content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 250)));
  pos = content.indexOf(term, pos + 1);
}
