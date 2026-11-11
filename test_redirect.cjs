const https = require('https');

function testRedirect(url) {
  console.log('Testing URL:', url);
  https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
      console.log('Redirecting to:', res.headers.location);
      if (res.headers.location && res.headers.location !== url) {
        testRedirect(res.headers.location);
      }
    } else {
      console.log('Reached final destination. Status:', res.statusCode);
    }
  }).on('error', (e) => {
    console.error('Error:', e.message);
  });
}

testRedirect('https://share.gemini.google/vz24FaLtJwxr');
