import { Song, LeaderboardEntry } from '@/types';
import { INITIAL_SONGS } from './songs-data';

const LOCAL_STORAGE_LEADERBOARD_KEY = 'oido_absoluto_leaderboard';

const DEFAULT_MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'mock-1',
    player_name: 'Charly G.',
    country_code: 'AR',
    score: 14850,
    songs_guessed: 18,
    exact_hits: 11,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'mock-2',
    player_name: 'BeatleManiac',
    country_code: 'GB',
    score: 12400,
    songs_guessed: 15,
    exact_hits: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'mock-3',
    player_name: 'VinylQueen',
    country_code: 'ES',
    score: 10950,
    songs_guessed: 13,
    exact_hits: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'mock-4',
    player_name: 'RetroGamer99',
    country_code: 'MX',
    score: 9200,
    songs_guessed: 11,
    exact_hits: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    id: 'mock-5',
    player_name: 'Rockero80s',
    country_code: 'CL',
    score: 7800,
    songs_guessed: 9,
    exact_hits: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString()
  },
  {
    id: 'mock-6',
    player_name: 'StereoSound',
    country_code: 'US',
    score: 6450,
    songs_guessed: 8,
    exact_hits: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
  },
  {
    id: 'mock-7',
    player_name: 'Melomana_UY',
    country_code: 'UY',
    score: 5100,
    songs_guessed: 6,
    exact_hits: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 2880).toISOString()
  },
  {
    id: 'mock-8',
    player_name: 'CumbiaYRock',
    country_code: 'CO',
    score: 4200,
    songs_guessed: 5,
    exact_hits: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 4320).toISOString()
  }
];

export async function fetchSongs(): Promise<Song[]> {
  return INITIAL_SONGS;
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local) as LeaderboardEntry[];
        return parsed.sort((a, b) => b.score - a.score).slice(0, limit);
      } catch (e) {
        console.error('Error parsing local leaderboard:', e);
      }
    }
    // Inicializar localStorage con defaults
    localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(DEFAULT_MOCK_LEADERBOARD));
  }

  return DEFAULT_MOCK_LEADERBOARD.slice(0, limit);
}

export async function saveLeaderboardScore(entry: {
  player_name: string;
  country_code: string;
  score: number;
  songs_guessed: number;
  exact_hits: number;
}): Promise<LeaderboardEntry> {
  const newEntry: LeaderboardEntry = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lb-${Date.now()}`,
    player_name: entry.player_name.trim() || 'Melómano Anónimo',
    country_code: (entry.country_code || 'AR').toUpperCase(),
    score: entry.score,
    songs_guessed: entry.songs_guessed,
    exact_hits: entry.exact_hits,
    created_at: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    const current = await fetchLeaderboard(100);
    const updated = [newEntry, ...current].sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(updated));
  }

  return newEntry;
}
