const fs = require('fs');
const path = require('path');

async function download() {
  const fileId = '1_VY2dEWhYBK62WHEvq-7XrM00wIEVLkn';
  const dest = path.join(__dirname, 'public', 'background.mp4');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(path.dirname(dest))) {
    fs.mkdirSync(path.dirname(dest));
  }
  
  let url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log('Fetching initial URL:', url);
  
  let response = await fetch(url);
  console.log('Initial Response Status:', response.status);
  console.log('Initial Response headers:', [...response.headers.entries()]);
  
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const text = await response.text();
    console.log('HTML warning page received. Checking for confirmation parameter...');
    
    // Look for confirm=xxxx parameter
    const match = text.match(/confirm=([a-zA-Z0-9_\-]+)/);
    if (match) {
      const confirmToken = match[1];
      console.log('Parsed confirm token:', confirmToken);
      url = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmToken}`;
      console.log('Downloading with confirmation query URL:', url);
      response = await fetch(url);
    } else {
      // Sometimes it is hosted under a direct googleapis or drive.usercontent link
      const fallbackHref = text.match(/href="([^"]+confirm=[^"&]+[^"]+)"/) ||
                           text.match(/id="download-form" action="([^"]+)"/);
      if (fallbackHref) {
        let confirmUrl = fallbackHref[1].replace(/&amp;/g, '&');
        if (confirmUrl.startsWith('/')) {
          confirmUrl = 'https://drive.google.com' + confirmUrl;
        }
        console.log('Found alternative warning form URL:', confirmUrl);
        response = await fetch(confirmUrl);
      } else {
        console.error('Google Drive returned HTML block but no confirm token could be extracted.');
        console.log('Snippet of HTML response:', text.slice(0, 1500));
        throw new Error('Google Drive virus confirmation check failed);');
      }
    }
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(dest, buffer);
  console.log(`Download finished! Saved ${buffer.length} bytes to ${dest}`);
}

download().catch(err => {
  console.error('Download execution has failed:', err);
  process.exit(1);
});
