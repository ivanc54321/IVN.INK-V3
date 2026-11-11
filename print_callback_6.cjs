const fs = require('fs');

if (fs.existsSync('script_callback_6.js')) {
  const content = fs.readFileSync('script_callback_6.js', 'utf8');
  console.log('script_callback_6.js length:', content.length);
  console.log('--- CONTENT ---');
  console.log(content.slice(0, 1000));
} else {
  console.log('script_callback_6.js does not exist.');
}
