'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Song, SnippetDuration, RoundResult, GameStatus } from '@/types';
import { UnifiedGameModule } from './UnifiedGameModule';
import { RoundResultModal } from './RoundResultModal';
import { GameOverModal } from './GameOverModal';
import { SnippetAudioPlayer, sfx } from '@/lib/audio-engine';
import { YouTubeEngine, YouTubeEngineRef } from './YouTubeEngine';
import { saveLeaderboardScore } from '@/lib/supabase';
import { Music4 } from 'lucide-react';

interface GameViewProps {
  songs: Song[];
  lives: number;
  score: number;
  multiplier: number;
  onUpdateState: (state: {
    lives: number;
    score: number;
    multiplier: number;
    songsGuessed: number;
    exactHits: number;
  }) => void;
  onViewLeaderboard: () => void;
}

export function GameView({
  songs,
  lives,
  score,
  multiplier,
  onUpdateState,
  onViewLeaderboard
}: GameViewProps) {
  const currentYear = new Date().getFullYear();

  // Game session states
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetDuration>(1);
  const [selectedYear, setSelectedYear] = useState<number>(1990);
  
  useEffect(() => {
    setSelectedYear(1990 + Math.floor(Math.random() * (new Date().getFullYear() - 1990 + 1)));
  }, []);
  const [isPlayingSnippet, setIsPlayingSnippet] = useState(false);
  const [snippetProgress, setSnippetProgress] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [songsGuessed, setSongsGuessed] = useState(0);
  const [exactHits, setExactHits] = useState(0);
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const audioPlayerRef = useRef<SnippetAudioPlayer | null>(null);
  const youtubeRef = useRef<YouTubeEngineRef | null>(null);

  // Initialize audio player instance
  useEffect(() => {
    const player = new SnippetAudioPlayer();
    player.setCallbacks(
      (playing) => {
        setIsPlayingSnippet(playing);
        if (!playing) setIsPlayingFull(false);
      },
      (prog) => setSnippetProgress(prog)
    );
    audioPlayerRef.current = player;

    return () => {
      player.destroy();
    };
  }, []);

  // Current song
  const currentSong: Song | undefined = songs[currentSongIndex % songs.length];

  // Load audio URL / YouTube video when song changes
  useEffect(() => {
    if (currentSong) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.loadSong(currentSong);
      }
      if (youtubeRef.current && currentSong.youtube_id) {
        youtubeRef.current.cueSong(currentSong.youtube_id, (currentSong.preview_start || 0) + 5);
      }
    }
  }, [currentSong]);

  // Handle playing snippet (prioritizes YouTube, with fallback to HTML5 audio)
  const handlePlaySnippet = () => {
    if (!currentSong) return;
    const startOffset = (currentSong.preview_start || 0) + 5;

    if (currentSong.youtube_id && youtubeRef.current) {
      youtubeRef.current.playSnippet(selectedSnippet, startOffset);
    } else {
      console.warn('[Oído Absoluto] No YouTube ID for song:', currentSong?.title);
    }
  };

  const handleStopSnippet = () => {
    if (youtubeRef.current) {
      youtubeRef.current.stop();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
    }
  };

  const handlePlayFullSong = () => {
    if (!currentSong || !audioPlayerRef.current) return;
    if (isPlayingFull) {
      handleStopSnippet();
      setIsPlayingFull(false);
    } else {
      audioPlayerRef.current.playFullSong(0);
      setIsPlayingFull(true);
    }
  };

  // Confirm guess calculation
  const handleConfirmYear = () => {
    if (!currentSong) return;
    handleStopSnippet();
    if (currentSong.youtube_id && youtubeRef.current) {
      youtubeRef.current.playFull(currentSong.preview_start || 0);
      setIsPlayingFull(true);
    }

    const actualYear = currentSong.year;
    const yearDiff = Math.abs(selectedYear - actualYear);
    const isExact = yearDiff === 0;

    // Base score by snippet
    let baseScore = 300;
    if (selectedSnippet === 1) baseScore = 1000;
    else if (selectedSnippet === 3) baseScore = 600;

    let pointsEarned = 0;
    let bonusPoints = 0;
    let newLives = lives;
    let lifeLost = false;
    let newMultiplier = multiplier;
    let nextExactHits = exactHits;
    let nextSongsGuessed = songsGuessed;

    if (isExact) {
      bonusPoints = 500;
      pointsEarned = Math.round((baseScore + bonusPoints) * multiplier);
      newMultiplier = Math.min(2.5, +(multiplier + 0.2).toFixed(1));
      nextExactHits += 1;
      nextSongsGuessed += 1;
      sfx.playExact();
    } else if (yearDiff === 1) {
      pointsEarned = Math.round(baseScore * 0.8 * multiplier);
      newMultiplier = Math.min(2.5, +(multiplier + 0.1).toFixed(1));
      nextSongsGuessed += 1;
      sfx.playClose();
    } else if (yearDiff <= 3) {
      pointsEarned = Math.round(baseScore * 0.5 * multiplier);
      nextSongsGuessed += 1;
      sfx.playClose();
    } else if (yearDiff <= 5) {
      pointsEarned = Math.round(baseScore * 0.25 * multiplier);
      nextSongsGuessed += 1;
    } else {
      // Off by > 5 years -> Lose 1 heart
      newLives = Math.max(0, lives - 1);
      lifeLost = true;
      newMultiplier = 1.0;
      sfx.playLifeLost();
    }

    const roundResult: RoundResult = {
      song: currentSong,
      selectedYear,
      actualYear,
      yearDiff,
      snippetUsed: selectedSnippet,
      pointsEarned,
      isExact,
      bonusPoints,
      streak: Math.round((newMultiplier - 1) * 5),
      livesRemaining: newLives,
      lifeLost
    };

    setLastResult(roundResult);
    setExactHits(nextExactHits);
    setSongsGuessed(nextSongsGuessed);

    const newScore = score + pointsEarned;
    onUpdateState({
      lives: newLives,
      score: newScore,
      multiplier: newMultiplier,
      songsGuessed: nextSongsGuessed,
      exactHits: nextExactHits
    });

    if (newLives <= 0) {
      setGameStatus('game_over');
    } else {
      setGameStatus('round_result');
    }
  };

  // Next round setup
  const handleNextRound = () => {
    handleStopSnippet();
    setIsPlayingFull(false);
    setGameStatus('playing');
    setLastResult(null);
    setSelectedSnippet(1);
    setSelectedYear(1990 + Math.floor(Math.random() * (currentYear - 1990 + 1)));
    setCurrentSongIndex((prev) => prev + 1);
  };

  // Play Again restart
  const handleRestart = () => {
    handleStopSnippet();
    setIsPlayingFull(false);
    setGameStatus('playing');
    setLastResult(null);
    setSelectedSnippet(1);
    setSelectedYear(1990 + Math.floor(Math.random() * (currentYear - 1990 + 1)));
    setSongsGuessed(0);
    setExactHits(0);
    setCurrentSongIndex(0);
    onUpdateState({
      lives: 3,
      score: 0,
      multiplier: 1.0,
      songsGuessed: 0,
      exactHits: 0
    });
  };

  // Save leaderboard score
  const handleSaveScore = async (playerName: string, countryCode: string) => {
    await saveLeaderboardScore({
      player_name: playerName,
      country_code: countryCode,
      score,
      songs_guessed: songsGuessed,
      exact_hits: exactHits
    });
    setGameStatus('idle');
    onViewLeaderboard();
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 max-w-lg mx-auto">
      {/* Hidden YouTube Engine for snippet streaming */}
      <YouTubeEngine
        ref={youtubeRef}
        videoId={currentSong?.youtube_id}
        onPlayStateChange={(playing) => {
          setIsPlayingSnippet(playing);
          if (!playing) setIsPlayingFull(false);
        }}
        onProgressChange={(prog) => setSnippetProgress(prog)}
        onErrorFallback={() => {
          console.warn('[Oído Absoluto] YouTube playback failed for:', currentSong?.title);
        }}
      />

      {/* Round Header & Progress Info */}
      <div className="w-full flex items-center justify-between px-2 text-stone-500 text-xs font-mono">
        <div className="flex items-center gap-1.5 font-semibold">
          <Music4 className="w-3.5 h-3.5 text-purple-600" />
          <span>Ronda #{currentSongIndex + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Aciertos: <strong className="text-stone-800">{songsGuessed}</strong></span>
          <span>•</span>
          <span>Exactos: <strong className="text-purple-700">{exactHits}</strong></span>
        </div>
      </div>

      {/* Unified Control Module */}
      <UnifiedGameModule
        selectedSnippet={selectedSnippet}
        isPlaying={isPlayingSnippet}
        progress={snippetProgress}
        onSelectSnippet={(dur) => {
          handleStopSnippet();
          setSelectedSnippet(dur);
        }}
        onPlay={handlePlaySnippet}
        onStop={handleStopSnippet}
        year={selectedYear}
        minYear={1990}
        maxYear={currentYear}
        onYearChange={(y) => setSelectedYear(y)}
        onConfirm={handleConfirmYear}
        disabled={gameStatus === 'round_result' || gameStatus === 'game_over'}
      />

      {/* Round Result Modal */}
      {gameStatus === 'round_result' && lastResult && (
        <RoundResultModal
          result={lastResult}
          onNextRound={handleNextRound}
          onPlayFull={handlePlayFullSong}
          isPlayingFull={isPlayingFull}
        />
      )}

      {/* Game Over Modal */}
      {gameStatus === 'game_over' && (
        <GameOverModal
          score={score}
          songsGuessed={songsGuessed}
          exactHits={exactHits}
          onRestart={handleRestart}
          onViewLeaderboard={onViewLeaderboard}
          onSubmitScore={handleSaveScore}
        />
      )}
    </div>
  );
}
