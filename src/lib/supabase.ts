import { Song, LeaderboardEntry } from '@/types';
import { INITIAL_SONGS } from './songs-data';


import { supabase } from './supabase-client';

const LOCAL_STORAGE_LEADERBOARD_KEY = 'oido_absoluto_leaderboard_v2';

const DEFAULT_MOCK_LEADERBOARD: LeaderboardEntry[] = [
  // ... mock data will be kept for fallback
  {
    id: 'mock-1',
    player_name: 'Charly G.',
    country_code: 'AR',
    score: 14850,
    songs_guessed: 18,
    exact_hits: 11,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];

export async function fetchSongs(): Promise<Song[]> {
  return INITIAL_SONGS;
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard from Supabase:', error);
      throw error;
    }

    if (data && data.length > 0) {
      return data as LeaderboardEntry[];
    }
  } catch (e) {
    console.warn('Fallback to local mock data due to error:', e);
  }

  // Fallback
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
  const newEntry = {
    player_name: entry.player_name.trim() || 'Melómano Anónimo',
    country_code: (entry.country_code || 'AR').toUpperCase(),
    score: entry.score,
    songs_guessed: entry.songs_guessed,
    exact_hits: entry.exact_hits
  };

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([newEntry])
      .select()
      .single();

    if (error) {
      console.error('Error saving score to Supabase:', error);
      throw error;
    }
    
    return data as LeaderboardEntry;
  } catch (e) {
    console.error('Failed to save to Supabase, fallback to local storage:', e);
    // Fallback logic
    const fallbackEntry: LeaderboardEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lb-${Date.now()}`,
      ...newEntry,
      created_at: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      const current = await fetchLeaderboard(100);
      const updated = [fallbackEntry, ...current].sort((a, b) => b.score - a.score);
      localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(updated));
    }
    return fallbackEntry;
  }
}
