import fs from 'fs';
import https from 'https';
import querystring from 'querystring';

// Path to the final output file
const OUT_FILE = './src/lib/songs-data.ts';
const STATE_FILE = './fetch-state.json';

// Load the list of songs
const yearsData = JSON.parse(fs.readFileSync('songs-list.json', 'utf-8'));

// Load state if exists
let fetchedSongs = [];
if (fs.existsSync(STATE_FILE)) {
  fetchedSongs = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  console.log(`Resuming with ${fetchedSongs.length} already fetched songs.`);
}

import { YouTube } from 'youtube-sr';

async function fetchYoutubeId(query) {
  try {
    const video = await YouTube.searchOne(query);
    if (video && video.id) {
      return video.id;
    }
    return null;
  } catch (error) {
    return null;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(fetchedSongs, null, 2));
  
  let tsContent = `import { Song } from '@/types';\n\nexport const INITIAL_SONGS: Song[] = [\n`;
  for (const s of fetchedSongs) {
    tsContent += `  {
    id: '${s.id}',
    title: "${s.title.replace(/"/g, '\\"')}",
    artist: "${s.artist.replace(/"/g, '\\"')}",
    year: ${s.year},
    youtube_id: '${s.youtube_id}',
    preview_start: 30
  },\n`;
  }
  tsContent += `];\n\n`;
  tsContent += `export function getRandomSongs(count?: number): Song[] {
  const shuffled = [...INITIAL_SONGS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return count ? shuffled.slice(0, count) : shuffled;
}\n`;

  fs.writeFileSync(OUT_FILE, tsContent);
}

async function run() {
  console.log('Generating songs data via DDG...');
  
  for (const [year, songs] of Object.entries(yearsData)) {
    console.log(`\n=== Processing year ${year} ===`);
    for (let i = 0; i < songs.length; i++) {
      const id = `song-${year}-${i}`;
      
      // Skip if already fetched
      if (fetchedSongs.find(s => s.id === id)) {
        continue;
      }
      
      const titleArtist = songs[i];
      const parts = titleArtist.split(' - ');
      const artist = parts[0];
      const title = parts.slice(1).join(' - ') || parts[0];
      
      let ytId = await fetchYoutubeId(titleArtist);
      if (!ytId) {
        await sleep(3000);
        ytId = await fetchYoutubeId(titleArtist + ' music video');
      }
      if (!ytId) {
        await sleep(3000);
        ytId = await fetchYoutubeId(title + ' ' + artist);
      }
      
      if (ytId) {
        console.log(`[${year}] [${i+1}/50] Found ${ytId} for ${titleArtist}`);
        fetchedSongs.push({
          id,
          title,
          artist,
          year: parseInt(year),
          youtube_id: ytId
        });
        saveState();
      } else {
        console.log(`[${year}] [${i+1}/50] FAILED for ${titleArtist}`);
      }
      
      // Delay to avoid ban
      await sleep(1500);
    }
  }

  console.log(`Done! Fetched a total of ${fetchedSongs.length} songs.`);
}

run();
