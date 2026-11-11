const fs = require('fs');
const content = fs.readFileSync('real_share.html', 'utf8');

const term = 'batchexecute';
let pos = content.indexOf(term);
console.log('Is batchexecute present?', pos !== -1);
if (pos !== -1) {
  while (pos !== -1) {
    console.log('Context:', content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 150)));
    pos = content.indexOf(term, pos + 1);
  }
}

const uiTerm = 'BardChatUi';
pos = content.indexOf(uiTerm);
console.log('Is BardChatUi present?', pos !== -1);
if (pos !== -1) {
  let count = 0;
  while (pos !== -1 && count < 10) {
    console.log('Context:', content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 150)));
    pos = content.indexOf(uiTerm, pos + 1);
    count++;
  }
}
