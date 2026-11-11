const https = require('https');

const req = https.get('https://share.gemini.google/vz24FaLtJwxr', { timeout: 3000 }, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
});
req.on('timeout', () => {
  console.log('Timeout happened');
  req.destroy();
});
req.on('error', (err) => {
  console.log('Error:', err.message);
});
