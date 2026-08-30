import fs from 'fs';
import https from 'https';

const songs = [
  { title: "Enter Sandman", artist: "Metallica", old: "CD-E-MQZaeg" },
  { title: "(Everything I Do) I Do It For You", artist: "Bryan Adams", old: "ZGoWtY_h4xo" },
  { title: "Baby Got Back", artist: "Sir Mix-A-Lot", old: "REvdzNTrEQI" },
  { title: "Jump Around", artist: "House of Pain", old: "XNzPOLYcgC0" },
  { title: "What Is Love", artist: "Haddaway", old: "HEXWRTEENIL" },
  { title: "Because You Loved Me", artist: "Celine Dion", old: "P_NrmKf663Q" },
  { title: "Believe", artist: "Cher", old: "4p0chD8U8fA" },
  { title: "Pretty Fly (For a White Guy)", artist: "The Offspring", old: "nzY2Qcu5i2A" },
  { title: "Lose Yourself", artist: "Eminem", old: "_YCGtT_PNYQ" },
  { title: "Mr. Brightside", artist: "The Killers", old: "gGdGFtwcjVQ" },
  { title: "Mr. Brightside", artist: "The Killers", old: "gGdGFtwPNUs" },
  { title: "I Gotta Feeling", artist: "Black Eyed Peas", old: "uSD4vshi2u4" },
  { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", old: "qsVNEwN10U0" },
  { title: "Hotline Bling", artist: "Drake", old: "uxjEOSvkSyI" },
  { title: "Starboy", artist: "The Weeknd ft. Daft Punk", old: "34Na4j8HLjc" },
  { title: "Paint The Town Red", artist: "Doja Cat", old: "m4_9TFeMf7U" },
  { title: "greedy", artist: "Tate McRae", old: "rW7yVlGzZ2I" },
  { title: "Too Sweet", artist: "Hozier", old: "a-sX4EusXvY" },
  { title: "I Had Some Help", artist: "Post Malone", old: "xIHTH3UeL0c" },
  { title: "A Bar Song (Tipsy)", artist: "Shaboozey", old: "t7bQwwqW-ww" },
  { title: "APT.", artist: "ROSÉ & Bruno Mars", old: "ekhcCW-Z7IY" }
];

async function searchYouTube(query) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(query + ' official audio');
    https.get('https://www.youtube.com/results?search_query=' + q, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        resolve(match ? match[1] : null);
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  let content = fs.readFileSync('src/lib/songs-data.ts', 'utf-8');
  let replacements = 0;
  
  for (const s of songs) {
    const id = await searchYouTube(s.artist + ' ' + s.title);
    if (id) {
      console.log(`Replacing ${s.old} with ${id} for ${s.title}`);
      // Only replace EXACT occurrences of the old ID in the single quotes
      content = content.replace(new RegExp(`youtube_id:\\s*'${s.old}'`, 'g'), `youtube_id: '${id}'`);
      replacements++;
    } else {
      console.log(`Could not find new ID for ${s.title}`);
    }
  }
  
  fs.writeFileSync('src/lib/songs-data.ts', content);
  console.log(`Made ${replacements} replacements.`);
}
run();
