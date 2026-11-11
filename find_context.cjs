const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

const targets = ['TZGWNH-iaHk', 'vhbkCEnNXcY', 'lYah5-xEeck'];

targets.forEach(t => {
  let pos = content.indexOf(t);
  console.log(`\n\n=== CONTEXT FOR ${t} ===`);
  if (pos !== -1) {
    while (pos !== -1) {
      console.log('--- MATCH ---');
      console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 250)));
      pos = content.indexOf(t, pos + 1);
    }
  } else {
    console.log('Not found');
  }
});
