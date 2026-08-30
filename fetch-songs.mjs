import fs from 'fs';
import https from 'https';
import querystring from 'querystring';

const yearsData = {
  2020: [
    "The Weeknd - Blinding Lights",
    "BTS - Dynamite",
    "Dua Lipa - Don't Start Now",
    "Future - Life Is Good",
    "Harry Styles - Watermelon Sugar",
    "Drake - Toosie Slide",
    "Doja Cat - Say So",
    "Cardi B - WAP",
    "DaBaby - ROCKSTAR",
    "Justin Bieber - Yummy"
  ],
  2021: [
    "The Kid LAROI, Justin Bieber - STAY",
    "Olivia Rodrigo - drivers license",
    "Ed Sheeran - Bad Habits",
    "Lil Nas X - MONTERO",
    "Dua Lipa - Levitating",
    "The Weeknd - Save Your Tears",
    "Olivia Rodrigo - good 4 u",
    "Bruno Mars - Leave the Door Open",
    "Adele - Easy On Me",
    "Glass Animals - Heat Waves"
  ],
  2022: [
    "Harry Styles - As It Was",
    "Bizarrap - Quevedo Bzrp Music Sessions 52",
    "Bad Bunny - Tití Me Preguntó",
    "Bad Bunny - Me Porto Bonito",
    "Taylor Swift - Anti-Hero",
    "OneRepublic - I Ain't Worried",
    "David Guetta - I'm Good (Blue)",
    "Imagine Dragons - Enemy",
    "Rosalia - DESPECHA",
    "Shakira - Te Felicito"
  ],
  2023: [
    "Miley Cyrus - Flowers",
    "Bizarrap - Shakira Bzrp Music Sessions 53",
    "Karol G, Shakira - TQG",
    "Peso Pluma - Ella Baila Sola",
    "SZA - Kill Bill",
    "Ynglvcas - La Bebe Remix",
    "Rema - Calm Down",
    "Grupo Frontera - un x100to",
    "Dua Lipa - Dance The Night",
    "Jung Kook - Seven"
  ]
};

async function fetchYoutubeIdViaDDG(query) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      q: `site:youtube.com/watch "${query}"`
    });

    const options = {
      hostname: 'lite.duckduckgo.com',
      port: 443,
      path: '/lite/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for youtube.com/watch?v= ID
        const match = data.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
          resolve(match[1]);
        } else {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('Generating songs data via DDG...');
  let tsContent = `import { Song } from '@/types';\n\nexport const INITIAL_SONGS: Song[] = [\n`;
  let total = 0;
  
  for (const [year, songs] of Object.entries(yearsData)) {
    console.log(`Processing year ${year}...`);
    for (let i = 0; i < songs.length; i++) {
      const titleArtist = songs[i];
      const [artist, title] = titleArtist.split(' - ');
      
      let ytId = await fetchYoutubeIdViaDDG(titleArtist);
      if (!ytId) {
        await sleep(2000);
        ytId = await fetchYoutubeIdViaDDG(titleArtist + ' music video');
      }
      
      if (ytId) {
        console.log(`Found ${ytId} for ${titleArtist}`);
        tsContent += `  {
    id: 'song-${year}-${i}',
    title: "${title.replace(/"/g, '\\"')}",
    artist: "${artist.replace(/"/g, '\\"')}",
    year: ${year},
    youtube_id: '${ytId}',
    preview_start: 30
  },\n`;
        total++;
      } else {
        console.log(`FAILED for ${titleArtist}`);
      }
      // Wait to respect rate limits
      await sleep(1500);
    }
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

  fs.writeFileSync('./src/lib/songs-data.ts', tsContent);
  console.log(`Done! Wrote ${total} songs to src/lib/songs-data.ts`);
}

run();
