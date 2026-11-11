const fs = require('fs');
const content = fs.readFileSync('clean_share.html', 'utf8');

const scriptPattern = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptPattern.exec(content)) !== null) {
  const js = match[1];
  console.log(`Script ${i}: length = ${js.length}`);
  if (js.includes('AF_initDataCallback')) {
    console.log(`-> Script ${i} has AF_initDataCallback!`);
    fs.writeFileSync(`script_callback_${i}.js`, js);
  }
  i++;
}

// Let's do a search on any file that was created.
const files = fs.readdirSync('.');
files.forEach(f => {
  if (f.startsWith('script_callback_')) {
    const c = fs.readFileSync(f, 'utf8');
    console.log(`Scanning ${f} for drive links or YouTube links...`);
    const urls = c.match(/https?:\/\/[^\s"'`,;]+/g) || [];
    const uniqUrls = [...new Set(urls)];
    const interesting = uniqUrls.filter(u => u.includes('drive') || u.includes('file') || u.includes('youtube') || u.includes('uc?'));
    if (interesting.length > 0) {
      console.log(`Found interesting URLs in ${f}:`, interesting);
    }
  }
});
