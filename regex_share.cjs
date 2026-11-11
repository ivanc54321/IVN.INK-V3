const fs = require('fs');

const content = fs.readFileSync('clean_share.html', 'utf8');

console.log('Searching for any URLs containing /d/ or /file/d/ :');
const dMatches = content.match(/https?:\/\/[^\s"'`<>]+(?:file\/d|\/d\/)[^\s"'`<]+/g);
if (dMatches) {
  console.log('Found /d/ URLs:', [...new Set(dMatches)]);
} else {
  console.log('No /d/ URLs found.');
}

console.log('Searching for standard Google Drive links:');
const driveMatches = content.match(/https?:\/\/(?:drive|docs)\.google\.com\/[^\s"'`<]+/g);
if (driveMatches) {
  console.log('Google Drive links:', [...new Set(driveMatches)]);
}

console.log('Searching for standard Google UserContent links:');
const usercontentMatches = content.match(/https?:\/\/[a-zA-Z0-9\-.]+\.googleusercontent\.com\/[^\s"'`<]+/g);
if (usercontentMatches) {
  console.log('Google UserContent links (first 5):', [...new Set(usercontentMatches)].slice(0, 5));
}

// Let's do a general regex for any text that has "1" followed by a 32-33 char string with upper/lower/numbers/dashes/underscores in a sentence about a spreadsheet, video, background, or drive.
const textMatches = content.match(/[A-Za-z0-9_\-]{28,45}/g) || [];
console.log('Total token candidates:', textMatches.length);

// Let's print the actual conversation text if we can find it.
// In Gemini Share pages, there are lines like `[null,"user_prompt_here","response_here"]` or similar in the `AF_initDataCallback`.
// Let's print elements of array that look like a user prompt or model response.
// Let's find any text that contains "drive.google.com" or "video" or "background" or "change" or "replace".
const lines = content.split('\n');
console.log('Total lines:', lines.length);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('vz24FaLtJwxr') || line.includes('ezgif') || line.includes('background') || line.includes('video') || line.includes('drive')) {
    if (line.length < 500) {
      console.log(`Line ${i}:`, line.trim());
    } else {
      console.log(`Line ${i} matches but too long (${line.length} chars). Substrings:`);
      // print matches around the keywords
      const words = ['drive', 'video', 'background', 'https://', 'id='];
      words.forEach(w => {
        let idx = line.indexOf(w);
        while (idx !== -1) {
          console.log(`  found '${w}':`, line.substring(Math.max(0, idx - 80), Math.min(line.length, idx + 120)));
          idx = line.indexOf(w, idx + 1);
        }
      });
    }
  }
}
