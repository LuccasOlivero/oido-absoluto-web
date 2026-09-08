const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Validates final songs data', async (t) => {
    // We expect the final output file to be `src/lib/songs-data.ts`
    // but the build script should output a JSON for validation first, 
    // or we can test the intermediate JSON `final_songs_data.json`
    const finalDataPath = path.join(__dirname, '..', 'final_songs_data.json');
    
    let songsData;
    try {
        const rawData = fs.readFileSync(finalDataPath, 'utf8');
        songsData = JSON.parse(rawData);
    } catch (e) {
        assert.fail(`Could not read or parse final_songs_data.json: ${e.message}`);
    }

    await t.test('has exactly 37 years (1990-2026)', () => {
        const years = new Set(songsData.map(s => s.year));
        assert.strictEqual(years.size, 37, 'Should cover 37 unique years');
        for (let year = 1990; year <= 2026; year++) {
            assert.ok(years.has(year), `Missing year: ${year}`);
        }
    });

    await t.test('has exactly 30 songs per year', () => {
        const songsPerYear = {};
        for (const song of songsData) {
            songsPerYear[song.year] = (songsPerYear[song.year] || 0) + 1;
        }
        for (let year = 1990; year <= 2026; year++) {
            assert.strictEqual(songsPerYear[year], 30, `Year ${year} should have exactly 30 songs, got ${songsPerYear[year]}`);
        }
    });

    await t.test('every song has a valid youtube_id and preview_start', () => {
        for (const song of songsData) {
            assert.ok(song.youtube_id, `Song ${song.id} missing youtube_id`);
            assert.strictEqual(typeof song.youtube_id, 'string', `Song ${song.id} youtube_id should be string`);
            assert.ok(song.preview_start !== undefined, `Song ${song.id} missing preview_start`);
        }
    });
});
