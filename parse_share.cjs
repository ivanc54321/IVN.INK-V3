const fs = require('fs');

const content = fs.readFileSync('share_content.html', 'utf8');

// Unescape unicode sequences (e.g., \u003d -> =, \u0026 -> &)
function unescapeJS(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
    return String.fromCharCode(parseInt(grp, 16));
  }).replace(/\\/g, '');
}

const cleanContent = unescapeJS(content);
fs.writeFileSync('clean_share.html', cleanContent);

// Search for any URL that contains drive.google.com or has "id=" or includes "/file/d/"
console.log('URLs in unescaped HTML:');
const urlMatches = cleanContent.match(/https?:\/\/[^\s"'`<>]+/g);
if (urlMatches) {
  const uniq = [...new Set(urlMatches)];
  const driveUrls = uniq.filter(u => u.includes('drive.google.com') || u.includes('docs.google.com') || u.includes('drive/file') || u.includes('id='));
  console.log('Drive links:', driveUrls);
  
  const videoUrls = uniq.filter(u => u.includes('.mp4') || u.includes('.webm') || u.includes('video') || u.includes('videoplayback'));
  console.log('Video links:', videoUrls);
  
  const googleUserContentUrls = uniq.filter(u => u.includes('googleusercontent.com'));
  console.log('Google UserContent links:', googleUserContentUrls);

  const youtubeUrls = uniq.filter(u => u.includes('youtube.com') || u.includes('youtu.be'));
  console.log('YouTube links:', youtubeUrls);
}

// Let's do a substring search for "google.com/file/d/" or similar in the clean content
const index = cleanContent.indexOf('google.com');
console.log('Is google.com present?', index !== -1);
if (index !== -1) {
  // Find all indices of google.com
  let pos = cleanContent.indexOf('google.com');
  while (pos !== -1) {
    const surrounding = cleanContent.substring(Math.max(0, pos - 100), Math.min(cleanContent.length, pos + 250));
    console.log('--- SURROUNDING GOOGLE.COM ---');
    console.log(surrounding);
    pos = cleanContent.indexOf('google.com', pos + 1);
  }
}
