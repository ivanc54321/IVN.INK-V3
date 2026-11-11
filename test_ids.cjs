const fs = require('fs');

const ids = [
  '1AQVyAPM2swNqASxpNAFqCqSArGc_A64r',
  '1wqWW45tA9hnp1T2CbsTshKkAODfBqNRO',
  '1zjojQbKBjCnI_AXsF6SFLI295oG3R67F',
  '1LJoESmHzdGqkay6oGoVHHErhKjGPjFJ8',
  '1xalHfQ-knre0wXJC5uOBt4EBakXlUy6C',
  '1pF8yY8QPUhxeTN09IvbX-QqKWW-x2LpI',
  '1gUCiqQGpSECuxgDvw4C4B0Csv0G4m0CH',
  '1gEAeQTIAOEGuC39BgTXKgWyBgSLAQKzA',
  '1Be8CAp16DeVNBJoFAookBKsVALcCBPMF',
  '1AZYKBK8WA9MeA5YCA7sdA4kgBQ8CoAQE',
  '1_7R2smJ6DqcANI4NHmljrJGNuRz0rK8D',
  '16S9eKM2W0qdSyP-4-TbR3zeIBGcAEcC3',
  '1OIlL3L2JB874GPhFI9_IqmuTCajshE7g',
  '1QhV44Z_GQBHsGf5PuckJMZfIVTPZaiXE',
  '1x4d-JwN2l9sIKwpINJwakXdYAZzz0jbn',
  '1XMoDZlWmzc_IiQP9Pl2qlTD28M00Ic5P',
  '181gW5cw07ABjrw0mOlbD6GPxon5_oEbD',
  '1OQHcU5yYO6yG6hyRrsJIs341ZlXquv4a',
  '1fj7fFnZqIznhM5S8ePLmGkbUoLZEiTib',
  '1-xQrTVX7kNnWA0vU1y80MgF0tuwFPjKo',
  '1oySatCZuAYA-8NIsLW680OBb5BBuQa5D',
  '1_A2XtX4mazh452AkDKtknc1qofaU07Bw',
  '1SuF1G7QPktpUlYaizLhaXeCUaNXgcQvK'
];

async function checkId(id) {
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    const controller = new AbortController();
    const idTimeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(idTimeout);
    
    const contentType = res.headers.get('content-type') || '';
    const contentDisposition = res.headers.get('content-disposition') || '';
    const contentLength = res.headers.get('content-length') || '';
    
    if (res.status === 200 && (contentType.includes('video') || contentType.includes('octet-stream') || contentDisposition.includes('.mp4') || parseInt(contentLength) > 100000)) {
      console.log(`[VALID VIDEO] ID: ${id} | Content-Type: ${contentType} | Disposition: ${contentDisposition} | Size: ${contentLength}`);
      return { id, contentType, size: contentLength, valid: true };
    } else {
      console.log(`[INVALID/OTHER] ID: ${id} | Status: ${res.status} | Content-Type: ${contentType} | Size: ${contentLength}`);
    }
  } catch (err) {
    console.log(`[ERROR] ID: ${id} | Error: ${err.message}`);
  }
  return { id, valid: false };
}

async function main() {
  console.log(`Testing ${ids.length} possible Google Drive IDs...`);
  const results = [];
  for (const id of ids) {
    const res = await checkId(id);
    if (res.valid) {
      results.push(res);
    }
  }
  console.log('\n--- SUMMARY OF VALID VIDEOS ---');
  console.log(results);
}

main();
