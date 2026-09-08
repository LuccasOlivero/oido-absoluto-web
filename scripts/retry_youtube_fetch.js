const fs = require('fs');
const path = require('path');
const YouTube = require('youtube-sr').default;

const files = [
    'raw_ar_songs_1990_1999.json',
    'raw_ar_songs_2000_2009.json',
    'raw_ar_songs_2010_2019.json',
    'raw_ar_songs_2020_2026.json'
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryMissing() {
    for (const file of files) {
        const filePath = path.join(__dirname, '..', file);
        if (!fs.existsSync(filePath)) {
            console.log(`File not found: ${file}`);
            continue;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let updated = false;

        for (let i = 0; i < data.length; i++) {
            const song = data[i];
            if (!song.youtube_id || song.youtube_id === 'null') {
                console.log(`Fetching missing ID for ${song.title} - ${song.artist}`);
                try {
                    const video = await YouTube.searchOne(`${song.title} ${song.artist} audio`);
                    if (video) {
                        song.youtube_id = video.id;
                        song.preview_start = 30;
                        updated = true;
                        console.log(`  -> Found: ${video.id}`);
                    } else {
                        console.log(`  -> Not found.`);
                        song.youtube_id = 'NOT_FOUND';
                    }
                } catch (e) {
                    console.error(`  -> Error: ${e.message}`);
                }
                
                // Generous delay to avoid rate limiting
                await delay(2000);
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Updated ${file}`);
        }
    }
}

retryMissing().then(() => console.log('Done retry.'));
