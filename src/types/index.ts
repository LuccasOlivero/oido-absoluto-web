export interface Song {
  id: string;
  title: string;
  artist: string;
  year: number;
  audio_url: string;
  youtube_id?: string;
  cover_url?: string;
  genre?: string;
  preview_start?: number; // Offset en segundos donde inicia el coro o parte reconocible
}

export type SnippetDuration = 1 | 3 | 5;

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  country_code: string;
  score: number;
  songs_guessed: number;
  exact_hits: number;
  created_at: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export type GameStatus =
  | 'idle'
  | 'playing'
  | 'round_result'
  | 'game_over';

export interface RoundResult {
  song: Song;
  selectedYear: number;
  actualYear: number;
  yearDiff: number;
  snippetUsed: SnippetDuration;
  pointsEarned: number;
  isExact: boolean;
  bonusPoints: number;
  streak: number;
  livesRemaining: number;
  lifeLost: boolean;
}
