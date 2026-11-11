const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

const urls = content.match(/https?:\/\/[^\s"'`<>()\\\[\]]+/g) || [];
const uniqueUrls = [...new Set(urls)];

console.log('Total unique URLs:', uniqueUrls.length);
uniqueUrls.forEach(url => {
  if (url.includes('drive') || url.includes('file') || url.includes('youtube') || url.includes('share') || url.includes('gemini.google.com/share') || url.includes('vz24FaLtJwxr')) {
    console.log('Matched ID/Drive/YouTube/Share URL:', url);
  }
});
