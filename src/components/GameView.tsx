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
  onGameStatusChange?: (status: GameStatus) => void;
  onRestartGame: () => void;
}

export function GameView({
  songs,
  lives,
  score,
  multiplier,
  onUpdateState,
  onViewLeaderboard,
  onGameStatusChange,
  onRestartGame
}: GameViewProps) {
  const currentYear = new Date().getFullYear();

  // Game session states
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetDuration>(1);
  const [selectedYear, setSelectedYear] = useState<number>(Math.floor((1990 + currentYear) / 2));
  

  const [isPlayingSnippet, setIsPlayingSnippet] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [snippetProgress, setSnippetProgress] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  useEffect(() => {
    if (onGameStatusChange) {
      onGameStatusChange(gameStatus);
    }
  }, [gameStatus, onGameStatusChange]);

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
    if (gameStatus === 'idle') {
      setGameStatus('playing');
    }
    
    if (!currentSong) return;
    const startOffset = (currentSong.preview_start || 0) + 5;

    if (currentSong.youtube_id && currentSong.youtube_id !== 'NOT_FOUND' && youtubeRef.current) {
      youtubeRef.current.playSnippet(selectedSnippet, startOffset);
    } else {
      console.warn('[Oído Absoluto] No YouTube ID for song:', currentSong?.title);
      // Fallback
      if (audioPlayerRef.current) {
         // The SnippetAudioPlayer fails gracefully if url is missing
         audioPlayerRef.current.playSnippet(selectedSnippet, startOffset);
      }
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
    if (!currentSong) return;
    if (isPlayingFull) {
      handleStopSnippet();
      setIsPlayingFull(false);
    } else {
      if (currentSong.youtube_id && currentSong.youtube_id !== 'NOT_FOUND' && youtubeRef.current) {
        youtubeRef.current.playFull(currentSong.youtube_id, currentSong.preview_start || 0);
      } else if (audioPlayerRef.current) {
        audioPlayerRef.current.playFullSong(0);
      }
      setIsPlayingFull(true);
    }
  };

  // Confirm guess calculation
  const handleConfirmYear = () => {
    if (!currentSong) return;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Play full song directly (synchronously to keep user-gesture context for autoplay)
    if (currentSong?.youtube_id && currentSong.youtube_id !== 'NOT_FOUND' && youtubeRef.current) {
      youtubeRef.current.playFull(currentSong.youtube_id, currentSong.preview_start || 0);
      setIsPlayingFull(true);
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleStopSnippet();
    setIsPlayingFull(false);
    setGameStatus('playing');
    setLastResult(null);
    setSelectedSnippet(1);
    setSelectedYear(Math.floor((1990 + currentYear) / 2));
    setCurrentSongIndex((prev) => prev + 1);
  };

  // Play Again restart
  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleStopSnippet();
    setIsPlayingFull(false);
    setGameStatus('idle');
    setLastResult(null);
    setSelectedSnippet(1);
    setSelectedYear(Math.floor((1990 + currentYear) / 2));
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
    
    // Reshuffle songs in parent
    onRestartGame();
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
        onBufferingStateChange={(buffering: boolean) => setIsBuffering(buffering)}
        onErrorFallback={() => {
          console.warn('[TimePitch] YouTube playback failed for:', currentSong?.title);
          setIsPlayingSnippet(false);
          setIsBuffering(false);
          setIsPlayingFull(false);
        }}
      />

      {/* Unified Control Module */}
      <UnifiedGameModule
        selectedSnippet={selectedSnippet}
        isPlaying={isPlayingSnippet}
        isBuffering={isBuffering}
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
        />
      )}
    </div>
  );
}
