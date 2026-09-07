import fs from 'fs';
import https from 'https';

const START_YEAR = 1990;
const END_YEAR = 2025;

const delay = ms => new Promise(r => setTimeout(r, ms));

async function fetchWikiContent(title, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'en.wikipedia.org',
          path: `/w/api.php?action=query&prop=revisions&rvprop=content&titles=${encodeURIComponent(title)}&format=json`,
          headers: { 'User-Agent': 'OidoAbsolutoBot/1.0 (Contact: luccas@example.com)' }
        };
        https.get(options, (res) => {
          let chunk = '';
          res.on('data', c => chunk += c);
          res.on('end', () => resolve(chunk));
        }).on('error', reject);
      });
      
      const json = JSON.parse(data);
      const pages = json.query.pages;
      const page = pages[Object.keys(pages)[0]];
      if (page.missing === '') return null;
      return page.revisions[0]['*'];
    } catch (e) {
      console.warn(`Attempt ${i+1} failed for ${title}. Retrying in 3s...`);
      await delay(3000);
    }
  }
  return null;
}

function cleanWikitext(text) {
  if (!text) return '';
  // Remove ref tags
  text = text.replace(/<ref[^>]*>.*?<\/ref>/g, '');
  text = text.replace(/<ref[^>]*\/>/g, '');
  
  // Extract text from [[Link|Text]] or [[Text]]
  text = text.replace(/\[\[([^\]\|]+)\|([^\]]+)\]\]/g, '$2');
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
  
  // Remove quotes
  text = text.replace(/"/g, '');
  
  // Remove stylistic double-quotes from wiki: ''Text'' -> Text
  text = text.replace(/''/g, '');
  
  // Truncate at notes or extra columns
  text = text.split('||')[0].trim();
  
  return text.trim();
}

async function scrapeSongs() {
  const yearsData = {};
  let totalCount = 0;
  
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    console.log(`Fetching year ${year}...`);
    const title = `Billboard_Year-End_Hot_100_singles_of_${year}`;
    const content = await fetchWikiContent(title);
    
    if (!content) {
      console.warn(`Year ${year} missing or failed.`);
      continue;
    }
    
    const lines = content.split('\n');
    const songs = [];
    
    for (const line of lines) {
      if (line.startsWith('|-') || line.startsWith('|}') || line.startsWith('!')) continue;
      
      // Match pattern like: | 1 || "Song" || Artist OR | "Song" || Artist
      const matchWithNumber = line.match(/^\|\s*\d+\s*\|\|(.*)/);
      const matchWithoutNumber = line.match(/^\|\s*"(.*?)"\s*\|\|(.*)/);
      
      if (matchWithNumber) {
        const parts = matchWithNumber[1].split('||');
        if (parts.length >= 2) {
          const title = cleanWikitext(parts[0]);
          const artist = cleanWikitext(parts[1]);
          if (title && artist) songs.push(`${artist} - ${title}`);
        }
      } else if (matchWithoutNumber) {
        const title = cleanWikitext(matchWithoutNumber[1]);
        const artist = cleanWikitext(matchWithoutNumber[2]);
        if (title && artist) songs.push(`${artist} - ${title}`);
      }
      
      if (songs.length === 50) break;
    }
    
    console.log(`Found ${songs.length} songs for ${year}.`);
    yearsData[year] = songs;
    totalCount += songs.length;
    
    await delay(2000);
  }
  
  fs.writeFileSync('songs-list.json', JSON.stringify(yearsData, null, 2));
  console.log(`Done! Wrote ${totalCount} songs to songs-list.json`);
}

scrapeSongs().catch(console.error);
