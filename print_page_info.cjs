const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

// Gemini shared messages might have custom elements or be encoded in a script tag.
// Let's print out all divs or elements with classes like "conversation", "message", "query", "response" etc.
// But first let's see if there is any other script tag that contains text that might be our conversation.
// Let's search for "vz24FaLtJwxr" or the share token "5f3c61a42bc5".
// Let's do a case-insensitive search for anything resembling "drive.google.com" or another file sharing site.
// Let's print the title of the page!
const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
if (titleMatch) {
  console.log('Page Title:', titleMatch[1].trim());
}

const ogTitleMatch = content.match(/property="og:title"\s+content="([^"]+)"/i) || content.match(/content="([^"]+)"\s+property="og:title"/i);
if (ogTitleMatch) {
  console.log('OG Title:', ogTitleMatch[1]);
}

const ogDescMatch = content.match(/property="og:description"\s+content="([^"]+)"/i) || content.match(/content="([^"]+)"\s+property="og:description"/i);
if (ogDescMatch) {
  console.log('OG Description:', ogDescMatch[1]);
}

// Let's do a search for any occurrence of 'drive.google' or 'youtube' or 'docs' or 'video' again, but list 100 characters around them
console.log('\nScanning for "drive" occurrences:');
let pos = content.indexOf('drive');
while (pos !== -1) {
  console.log('Context:', content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 100)));
  pos = content.indexOf('drive', pos + 1);
}

console.log('\nScanning for "docs" occurrences:');
pos = content.indexOf('docs');
while (pos !== -1) {
  console.log('Context:', content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 100)));
  pos = content.indexOf('docs', pos + 1);
}
