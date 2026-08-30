import { Song } from '@/types';

export const INITIAL_SONGS: Song[] = [
  // Test YouTube Track
  {
    id: 'song-test-youtube',
    title: 'Tema de Prueba YouTube',
    artist: 'YouTube Video',
    year: 2015,
    genre: 'Pop / Test',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtube_id: 'YdiKjg88WYk',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 30
  },
  // 1960s
  {
    id: 'song-60-1',
    title: 'Twist and Shout',
    artist: 'The Beatles',
    year: 1963,
    genre: 'Rock & Roll',
    audio_url: 'https://audio.jukehost.co.uk/5K6Ea70eH4lZ8c12wV0n3W8DqO8X1l2m', // or direct preview
    youtube_id: 'b-VAx4VpBi8',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-60-2',
    title: '(I Can\'t Get No) Satisfaction',
    artist: 'The Rolling Stones',
    year: 1965,
    genre: 'Classic Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtube_id: 'nrIPxlFzDi0',
    cover_url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80',
    preview_start: 5
  },
  {
    id: 'song-60-3',
    title: 'Good Vibrations',
    artist: 'The Beach Boys',
    year: 1966,
    genre: 'Psychedelic Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    youtube_id: 'Eab_beh07HU',
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-60-4',
    title: 'Hey Jude',
    artist: 'The Beatles',
    year: 1968,
    genre: 'Pop Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    youtube_id: 'A_MjCqQoLLA',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    preview_start: 10
  },

  // 1970s
  {
    id: 'song-70-1',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    year: 1971,
    genre: 'Hard Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    youtube_id: 'QkF3oxziUI4',
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-70-2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    year: 1975,
    genre: 'Rock Opera',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    youtube_id: 'fJ9rUzIMcZQ',
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    preview_start: 15
  },
  {
    id: 'song-70-3',
    title: 'Dancing Queen',
    artist: 'ABBA',
    year: 1976,
    genre: 'Disco Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    youtube_id: 'xFrGuyw1V8s',
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-70-4',
    title: 'Stayin\' Alive',
    artist: 'Bee Gees',
    year: 1977,
    genre: 'Disco',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    youtube_id: 'I_izvAbhExY',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-70-5',
    title: 'Hotel California',
    artist: 'Eagles',
    year: 1976,
    genre: 'Soft Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    youtube_id: '09839DpTctU',
    cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },

  // 1980s
  {
    id: 'song-80-1',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    year: 1982,
    genre: 'Pop / Funk',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    youtube_id: 'Zi_XLORVofg',
    cover_url: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-80-2',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    year: 1987,
    genre: 'Hard Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    youtube_id: '1w7OgIMMRc4',
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-80-3',
    title: 'Take On Me',
    artist: 'a-ha',
    year: 1985,
    genre: 'Synthpop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    youtube_id: 'djV11Xbc914',
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-80-4',
    title: 'Like a Virgin',
    artist: 'Madonna',
    year: 1984,
    genre: 'Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    youtube_id: 's__rX_WL100',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-80-5',
    title: 'Africa',
    artist: 'Toto',
    year: 1982,
    genre: 'Soft Rock / Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    youtube_id: 'FTQbiNvZqaY',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  // 1990s
  {
    id: 'song-90-0',
    title: 'De Música Ligera',
    artist: 'Soda Stereo',
    year: 1990,
    genre: 'Rock Latino',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    youtube_id: 'T_FkEw27XJ0',
    cover_url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-90-1',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    year: 1991,
    genre: 'Grunge',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    youtube_id: 'hTWKbfoikeg',
    cover_url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-90-2',
    title: 'Wonderwall',
    artist: 'Oasis',
    year: 1995,
    genre: 'Britpop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    youtube_id: '6hzrDeceEKc',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-90-3',
    title: '...Baby One More Time',
    artist: 'Britney Spears',
    year: 1998,
    genre: 'Teen Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtube_id: 'C-u5WLJ9Yk4',
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-90-4',
    title: 'Wannabe',
    artist: 'Spice Girls',
    year: 1996,
    genre: 'Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    youtube_id: 'gJLIiF15wjQ',
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-90-5',
    title: 'Californication',
    artist: 'Red Hot Chili Peppers',
    year: 1999,
    genre: 'Alternative Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    youtube_id: 'YlUKcNNmywk',
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },

  // 2000s
  {
    id: 'song-00-1',
    title: 'In the End',
    artist: 'Linkin Park',
    year: 2000,
    genre: 'Nu Metal / Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    youtube_id: 'eVTXPUF4Oz4',
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-00-2',
    title: 'Lose Yourself',
    artist: 'Eminem',
    year: 2002,
    genre: 'Hip Hop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    youtube_id: '_Yhyp-_hX2s',
    cover_url: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-00-3',
    title: 'Mr. Brightside',
    artist: 'The Killers',
    year: 2004,
    genre: 'Indie Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    youtube_id: 'gGdGFtwCN0k',
    cover_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-00-4',
    title: 'Hips Don\'t Lie',
    artist: 'Shakira ft. Wyclef Jean',
    year: 2006,
    genre: 'Latin Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    youtube_id: 'DUT5rEU6pqM',
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-00-5',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    year: 2008,
    genre: 'Pop Rock',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    youtube_id: 'dvgZkm1xWPE',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },

  // 2010s
  {
    id: 'song-10-1',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    year: 2010,
    genre: 'Soul / Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    youtube_id: 'rYEDA3JcQqw',
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-10-2',
    title: 'Get Lucky',
    artist: 'Daft Punk ft. Pharrell Williams',
    year: 2013,
    genre: 'Disco / Funk',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    youtube_id: '5NV6Rdv1a3I',
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-10-3',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    year: 2014,
    genre: 'Funk Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    youtube_id: 'OPf0YbXqDm0',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-10-4',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    year: 2017,
    genre: 'Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    youtube_id: 'JGwWNGJdvx8',
    cover_url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-10-5',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    year: 2019,
    genre: 'Synthwave / Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    youtube_id: '4NRXx6U8ABQ',
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-10-6',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    year: 2017,
    genre: 'Reggaeton / Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    youtube_id: 'kJQP7kiw5Fk',
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },

  // 2020s
  {
    id: 'song-20-1',
    title: 'Levitating',
    artist: 'Dua Lipa',
    year: 2020,
    genre: 'Nu-Disco / Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    youtube_id: 'TUVcZfQe-Kw',
    cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-20-2',
    title: 'As It Was',
    artist: 'Harry Styles',
    year: 2022,
    genre: 'Synthpop / Indie',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    youtube_id: 'H5v3kku4y6Q',
    cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-20-3',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    year: 2023,
    genre: 'Disco Pop',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtube_id: 'G7KNmW9a75Y',
    cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-20-4',
    title: 'Bzrp Music Sessions, Vol. 53',
    artist: 'Bizarrap & Shakira',
    year: 2023,
    genre: 'Electro Pop / Latin',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    youtube_id: 'CocEMWdc7Ck',
    cover_url: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  },
  {
    id: 'song-20-5',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    year: 2024,
    genre: 'Pop / Disco',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    youtube_id: 'eVli-tstM5E',
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
    preview_start: 0
  }
];

// Helper para barajar canciones aleatoriamente
export function getRandomSongs(count?: number): Song[] {
  const shuffled = [...INITIAL_SONGS];
  // Fisher-Yates shuffle for uniform randomness
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return count ? shuffled.slice(0, count) : shuffled;
}
