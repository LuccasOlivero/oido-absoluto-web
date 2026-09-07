import { Song, LeaderboardEntry } from '@/types';
import { INITIAL_SONGS } from './songs-data';


import { createClient } from './supabase/client';

const LOCAL_STORAGE_LEADERBOARD_KEY = 'oido_absoluto_leaderboard_v3';

const DEFAULT_MOCK_LEADERBOARD: LeaderboardEntry[] = [];

export async function fetchSongs(): Promise<Song[]> {
  return INITIAL_SONGS;
}

export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  try {
    const supabase = createClient();
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
}): Promise<LeaderboardEntry | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null; // Only logged in users can save scores

  const newEntry = {
    user_id: user.id,
    player_name: entry.player_name.trim() || 'Melómano Anónimo',
    country_code: (entry.country_code || 'AR').toUpperCase(),
    score: entry.score,
    songs_guessed: entry.songs_guessed,
    exact_hits: entry.exact_hits,
    created_at: new Date().toISOString()
  };

  try {
    // Check if user already has a score
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('id, score')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      if (entry.score > existing.score) {
        // Update if new score is higher
        const { data, error } = await supabase
          .from('leaderboard')
          .update(newEntry)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return data as LeaderboardEntry;
      } else {
        // Score is lower, don't update
        return null;
      }
    } else {
      // Insert new score
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([newEntry])
        .select()
        .single();
      if (error) throw error;
      return data as LeaderboardEntry;
    }
  } catch (e) {
    console.error('Failed to save to Supabase:', e);
    return null;
  }
}
