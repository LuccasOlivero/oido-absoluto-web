const fs = require('fs');
const path = require('path');

const finalDataPath = path.join(__dirname, '..', 'final_songs_data.json');
const targetPath = path.join(__dirname, '..', 'src', 'lib', 'songs-data.ts');

const data = JSON.parse(fs.readFileSync(finalDataPath, 'utf8'));

// We want to preserve the rest of the file (e.g. getRandomSongs)
const currentContent = fs.readFileSync(targetPath, 'utf8');
const startIndex = currentContent.indexOf('export const INITIAL_SONGS');
const exportFuncIndex = currentContent.indexOf('export function getRandomSongs');

if (startIndex === -1 || exportFuncIndex === -1) {
    console.error("Could not find bounds in songs-data.ts");
    process.exit(1);
}

const before = currentContent.substring(0, startIndex);
const after = currentContent.substring(exportFuncIndex);

const newArray = `export const INITIAL_SONGS: Song[] = ${JSON.stringify(data, null, 2)};\n\n`;

fs.writeFileSync(targetPath, before + newArray + after, 'utf8');
console.log("Successfully applied new INITIAL_SONGS to src/lib/songs-data.ts");
