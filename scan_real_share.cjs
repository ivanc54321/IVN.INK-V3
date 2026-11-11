const fs = require('fs');
const content = fs.readFileSync('real_share.html', 'utf8');

// Unescape any unicode characters
function unescapeJS(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  }).replace(/\\/g, '');
}

const clean = unescapeJS(content);
fs.writeFileSync('clean_real_share.html', clean);

console.log('Searching for typical URL sharing links...');
const urls = clean.match(/https?:\/\/[^\s"'`<>\\()\[\]{}]+/g) || [];
const uniqueUrls = [...new Set(urls)];

console.log('Total unique URLs found:', uniqueUrls.length);

const driveUrls = uniqueUrls.filter(u => u.includes('drive.google.com') || u.includes('docs.google.com'));
console.log('Drive URLs:', driveUrls);

const ytUrls = uniqueUrls.filter(u => u.includes('youtube.com') || u.includes('youtu.be'));
console.log('YouTube URLs:', ytUrls);

const otherUrls = uniqueUrls.filter(u => !u.includes('google.com') && !u.includes('gstatic') && !u.includes('googleapis') && !u.includes('youtube') && !u.includes('schema.org'));
console.log('Other URLs:', otherUrls);

// Let's do a substring search for any user dialogue or strings.
// Let's print out lines containing "drive.google.com" or any "file/d" in the clean content.
const lines = clean.split('\n');
console.log('Lines count:', lines.length);
lines.forEach((line, idx) => {
  if (line.includes('drive.google.com') || line.includes('google.com/file/') || line.includes('drive/file/')) {
    console.log(`Line ${idx}:`, line.trim().slice(0, 500));
  }
});
