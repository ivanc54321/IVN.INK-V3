const fs = require('fs');

async function main() {
  const url = 'https://gemini.google.com/share/5f3c61a42bc5?skid=369ffb66-f415-4bea-9573-b33898b975a0';
  console.log('Fetching', url, 'with SOCS cookie...');
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'SOCS=Cu8BAGGDXg; CONSENT=YES+; NID=532=WriaKTgkgDjY4XvD97m22V7tXh2AJB9CtBduZVPQg_WhKOFiFPEmyNM0FBn3CR-HBBnQnIWp8NKdVUT-POsON3FXnArZ9h1w6Chd5M-KPByp28cqNJohMGPCx07sDAnN0k_0nxzOsWlLinJY-WWSMGPz0jwf4lsvsgwk3USCDAMKEYvJWLRCHra3kPxdCM_VkeWOmoRhwzVYyEUaRhXubfiDLBmVYnKh'
      }
    });
    console.log('Status Code:', res.status);
    const body = await res.text();
    fs.writeFileSync('consent_done.html', body);
    console.log('Saved consent_done.html, size:', body.length);
    
    // Let's scan it for drive or file links
    const matches = body.match(/https?:\/\/[^\s"'`<>()\\\[\]{}]+/g) || [];
    const unique = [...new Set(matches)];
    console.log('Unique Links in consent_done.html:', unique.filter(u => u.includes('drive.google') || u.includes('docs.google') || u.includes('youtube') || u.includes('id=')));
    
    // Also let's print texts containing keywords like "video", "drive", "background"
    const textSegments = [];
    const plainText = body.replace(/<[^>]+>/g, ' ');
    const regex = /[^\n.]{0,100}(?:video|drive|background|replace|change)[^\n.]{0,150}/gi;
    let m;
    let count = 0;
    while ((m = regex.exec(plainText)) !== null && count < 20) {
      if (m[0].toLowerCase().includes('http') || m[0].toLowerCase().includes('drive') || m[0].toLowerCase().includes('file')) {
        console.log(`Msg Segment ${count++}:`, m[0].trim());
      }
    }
  } catch (err) {
    console.error('Error fetching with consent cookie:', err);
  }
}

main();
