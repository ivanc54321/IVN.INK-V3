const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

// Gemini share pages contain the page title and description in og:title, og:description, etc.
// But they also contain the main conversation content inside a specific JSON payload.
// Let's write a script to extract all text that looks like a markdown/conversational message.
// Typically in Google's share pages, there is a large JSON structure that has strings. 
// Let's find any text that could be a message. User prompts and model answers are stored inside arrays.
// Let's find strings in the script block that have markdown elements, list items, or are long paragraphs.

const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
let match;
const messages = [];

while ((match = stringRegex.exec(content)) !== null) {
  let val = match[1];
  // decode escaped characters
  try {
    val = val.replace(/\\"/g, '"').replace(/\\u([0-9a-fA-F]{4})/g, (m, grp) => String.fromCharCode(parseInt(grp, 16)));
    if (val.length > 10 && val.length < 2000) {
      if (
        (val.includes('drive.google.com') || val.includes('http') || val.includes('video') || val.includes('backround') || val.includes('background') || val.includes('change') || val.includes('replace') || val.includes('id=')) &&
        !val.includes('function') &&
        !val.includes('var ') &&
        !val.includes('document.') &&
        !val.includes('window.') &&
        !val.includes('google-') &&
        !val.includes('css')
      ) {
        messages.push(val);
      }
    }
  } catch(e) {}
}

console.log('--- FOUND POTENTIAL MESSAGE STRINGS ---');
const uniqueMessages = [...new Set(messages)];
uniqueMessages.forEach((m, idx) => console.log(`${idx}: ${m}`));
