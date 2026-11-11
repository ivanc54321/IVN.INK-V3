const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

// Let's do a case-insensitive regex search for any direct occurrence of .mp4 or youtube or drive.google.com with some characters around it.
const regex = /.{0,100}https?:\/\/[^\s"'`<>]+.{0,100}/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null && count < 50) {
  const segment = match[0].toLowerCase();
  if (segment.includes('drive') || segment.includes('file') || segment.includes('video') || segment.includes('mp4') || segment.includes('youtube')) {
    console.log(`Match ${count++}:`, match[0].trim());
  }
}
