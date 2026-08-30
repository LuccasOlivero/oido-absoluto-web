import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'lib');
const dataFile = path.join(srcDir, 'songs-data.ts');

const chunks = [
  'songs-1990-1992.ts',
  'songs-1993-1995.ts',
  'songs-1996-1998.ts',
  'songs-1999-2001.ts',
  'songs-2002-2004.ts',
  'songs-2005-2007.ts',
  'songs-2008-2010.ts',
  'songs-2011-2013.ts',
  'songs-2014-2016.ts',
  'songs-2017-2019.ts',
  'songs-2020-2022.ts',
  'songs-2023-2026.ts'
];

let allSongs = [];
let idCounter = 0;

for (const chunk of chunks) {
  const p = path.join(srcDir, chunk);
  if (!fs.existsSync(p)) {
    console.log(`Missing ${p}`);
    continue;
  }
  
  const content = fs.readFileSync(p, 'utf-8');
  // Match everything inside the array []
  const match = content.match(/\[\s*([\s\S]*?)\s*\];/);
  if (match && match[1]) {
    // A bit hacky but it extracts the raw objects string
    let innerContent = match[1];
    
    // We will parse it by fixing IDs so they don't collide
    // Actually, we can just grab the objects.
    // Let's use regex to find { ... }
    const regex = /\{[^{}]*\}/g;
    let objMatch;
    while ((objMatch = regex.exec(innerContent)) !== null) {
      allSongs.push(objMatch[0]);
    }
  }
}

let finalTs = `import { Song } from '@/types';\n\nexport const INITIAL_SONGS: Song[] = [\n`;
finalTs += allSongs.join(',\n');
finalTs += `\n];\n\n`;
finalTs += `export function getRandomSongs(count?: number): Song[] {
  const shuffled = [...INITIAL_SONGS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return count ? shuffled.slice(0, count) : shuffled;
}\n`;

fs.writeFileSync(dataFile, finalTs);

// Delete chunks
for (const chunk of chunks) {
  const p = path.join(srcDir, chunk);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
  }
}

console.log(`Merged ${allSongs.length} songs into songs-data.ts!`);
