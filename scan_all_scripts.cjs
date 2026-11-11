const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptPattern.exec(content)) !== null) {
  const js = match[1];
  const urlRegex = /https?:\/\/[^\s"'`,;<>]+/gi;
  const urls = js.match(urlRegex) || [];
  const uniqueUrls = [...new Set(urls)];
  const filtered = uniqueUrls.filter(u => u.includes('drive.google') || u.includes('docs.google') || u.includes('youtube.com/watch') || u.includes('youtu.be') || u.includes('googleusercontent') || u.includes('v=') || u.includes('file/d/'));
  
  if (filtered.length > 0) {
    console.log(`Script ${i} (length: ${js.length}) contains interesting URLs:`, filtered);
  }
  i++;
}

// Let's also look for any string that starts with "https://drive.google.com/file/d/" in the entire clean_share.html (not just script tags)
console.log('\nScanning entire file for drive links:');
const matches = content.match(/https?:\/\/[^\s"'`,;<>]*drive[^\s"'`,;<>]*/gi) || [];
console.log('Matches:', [...new Set(matches)]);
