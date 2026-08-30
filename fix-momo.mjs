import fs from 'fs';

let content = fs.readFileSync('src/lib/songs-data.ts', 'utf-8');

// 1. Remove the corrupted end of the file
const badStart = content.indexOf('export function getRandomSongs');
if (badStart !== -1) {
  content = content.slice(0, badStart);
}

// 2. We need to make sure INITIAL_SONGS is properly closed
// It probably ends with something like `},` now. Let's find the last `}`
const lastBrace = content.lastIndexOf('}');
content = content.slice(0, lastBrace + 1) + '\n];\n';

// 3. Add all the Momo songs properly!
let newSongs = '';
for (let year = 2010; year <= 2026; year++) {
  newSongs += `  {
    id: 'momo-me-llama-${year}',
    title: 'ME LLAMA',
    artist: 'MOMO (Beret Cover)',
    year: ${year},
    youtube_id: '5EouEAo9wy0',
    preview_start: 30
  },
`;
}

content = content.replace('];\n', ',\n' + newSongs + '];\n\n');

// 4. Re-add getRandomSongs
content += `export function getRandomSongs(count?: number): Song[] {
  const shuffled = [...INITIAL_SONGS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return count ? shuffled.slice(0, count) : shuffled;
}
`;

fs.writeFileSync('src/lib/songs-data.ts', content);
console.log('Fixed file and added all Momos!');
