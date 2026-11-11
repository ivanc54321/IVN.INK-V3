const fs = require('fs');

const content = fs.readFileSync('clean_share.html', 'utf8');

// Find all URLs inside clean_share.html
const urlRegex = /https?:\/\/[^\s"'`<>()\\\[\]]+/g;
const urls = content.match(urlRegex) || [];

const uniqueUrls = [...new Set(urls)];

console.log('--- ALL UNIQUE URLS IN CLEAN SHARE ---');
const possibleTargets = [];
uniqueUrls.forEach(url => {
  // Let's filter out known Google structural urls, fonts, schemas, etc.
  if (
    !url.includes('fonts.googleapis.com') &&
    !url.includes('fonts.gstatic.com') &&
    !url.includes('schema.org') &&
    !url.includes('google.com/share') &&
    !url.includes('accounts.google.com') &&
    !url.includes('google.com/viewer') &&
    !url.includes('push.clients6.google.com') &&
    !url.includes('consent.google.com') &&
    !url.includes('ogads-pa.clients6.google.com') &&
    !url.includes('googletagmanager.com') &&
    !url.includes('gstatic.com/og') &&
    !url.includes('ogs.google.com') &&
    !url.includes('geminiweb-pa.clients6.google.com') &&
    !url.includes('apple.com/app') &&
    !url.includes('chromebook.com')
  ) {
    possibleTargets.push(url);
  }
});

console.log(possibleTargets);

// Let's print out text paragraphs or parts of clean_share.html that mention "video", "background", "drive", "youtube", "https://"
console.log('\n--- TEXT CONTEXT AROUND VIDEO/DRIVE ---');
const regex = /(?:video|drive|background|replace|change)[^\n]{0,150}/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null && count < 30) {
  if (match[0].includes('http') || match[0].includes('drive') || match[0].includes('file')) {
    console.log(`Match ${count++}:`, match[0].trim());
  }
}
