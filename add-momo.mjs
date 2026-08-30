import fs from 'fs';
let content = fs.readFileSync('src/lib/songs-data.ts', 'utf-8');
const newSong = `  {
    id: 'momo-me-llama',
    title: 'ME LLAMA',
    artist: 'MOMO (Beret Cover)',
    year: 2019,
    youtube_id: '5EouEAo9wy0',
    preview_start: 30
  },
`;
// find where INITIAL_SONGS starts and insert it at the end
const insertIndex = content.lastIndexOf('];');
if (insertIndex !== -1) {
  content = content.slice(0, insertIndex) + newSong + content.slice(insertIndex);
  fs.writeFileSync('src/lib/songs-data.ts', content);
  console.log('Added Momo at the end of the array!');
} else {
  console.log('Could not find insert index');
}
