const fs = require('fs');

async function main() {
  const url = 'https://gemini.google.com/share/5f3c61a42bc5?skid=369ffb66-f415-4bea-9573-b33898b975a0';
  console.log('Fetching', url);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      }
    });
    console.log('Status Code:', res.status);
    console.log('Headers:', [...res.headers.entries()]);
    const body = await res.text();
    fs.writeFileSync('real_share.html', body);
    console.log('Saved real_share.html, size:', body.length);
  } catch (err) {
    console.error('Error fetching share page:', err);
  }
}

main();
