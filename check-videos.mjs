import fs from 'fs';
import https from 'https';

const content = fs.readFileSync('src/lib/songs-data.ts', 'utf-8');
const regex = /youtube_id:\s*'([^']+)'/g;
let match;
const ids = [];
while ((match = regex.exec(content)) !== null) {
  ids.push(match[1]);
}

console.log(`Found ${ids.length} videos to check.`);

async function checkVideo(id) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, (res) => {
      if (res.statusCode === 200) {
        resolve({ id, status: 'OK' });
      } else {
        resolve({ id, status: 'FAILED', code: res.statusCode });
      }
    }).on('error', () => {
      resolve({ id, status: 'ERROR' });
    });
  });
}

async function checkAll() {
  const broken = [];
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const results = await Promise.all(batch.map(checkVideo));
    for (const r of results) {
      if (r.status !== 'OK') {
        broken.push(r.id);
      }
    }
  }
  console.log('Broken videos:');
  console.log(JSON.stringify(broken, null, 2));
}

checkAll();
