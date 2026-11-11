const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

// Let's search inside the HTML for the prompt/response payload.
// Typically it's in a script tag with ID or pattern. Let's find script tags containing '5f3c61a42bc5' (the share ID).
console.log('Searching for script tags with share data...');
const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptPattern.exec(content)) !== null) {
  const js = match[1];
  if (js.includes('5f3c61a42bc5')) {
    console.log('Found script tag containing share ID! ID length:', js.length);
    // Let's write it to a separate file so we can analyze it or parse it
    fs.writeFileSync('share_data.js', js);
    break;
  }
}

// Let's look for user/model messages. They usually appear as continuous string blocks. Let's write a parser that extracts all double-quoted strings of length between 30 and 1000 characters from the script, particularly ones that don't look like code or css paths.
if (fs.existsSync('share_data.js')) {
  console.log('Analyzing share_data.js...');
  const jsContent = fs.readFileSync('share_data.js', 'utf8');
  
  // Find strings like "..." or '...'
  const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let strMatch;
  let count = 0;
  while ((strMatch = stringRegex.exec(jsContent)) !== null && count < 100) {
    const s = strMatch[1];
    if (s.length > 25 && s.length < 500 && !s.includes('http') && !s.includes('css') && !s.includes('class') && !s.includes('font-font')) {
      // Decode escaped quotes and unicode
      const decoded = s.replace(/\\"/g, '"').replace(/\\u([0-9a-fA-F]{4})/g, (m, grp) => String.fromCharCode(parseInt(grp, 16)));
      if (decoded.includes('video') || decoded.includes('drive') || decoded.includes('link') || decoded.includes('backround') || decoded.includes('background') || decoded.includes('change') || decoded.includes('here') || decoded.includes('ezgif')) {
        console.log(`String Match ${count++}:`, decoded);
      }
    }
  }

  // Also let's extract ANY URLs inside share_data.js that contain "drive.google.com" or similar
  const driveRegex = /https:\/\/drive\.google\.com\/[^\s"',;`<>]+/g;
  const driveUrls = jsContent.match(driveRegex) || [];
  console.log('Drive URLs in script:', [...new Set(driveUrls)]);
  
  const anyUrlRegex = /https?:\/\/[^\s"',;`<>]+/g;
  const allUrls = jsContent.match(anyUrlRegex) || [];
  console.log('Unique non-google URLs in script:', [...new Set(allUrls)].filter(u => !u.includes('google.com') && !u.includes('gstatic') && !u.includes('googleapis')));
}
