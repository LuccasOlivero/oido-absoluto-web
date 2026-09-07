"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GameView } from "@/components/GameView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { Song } from "@/types";
import { INITIAL_SONGS, getRandomSongs } from "@/lib/songs-data";
import { GameStatus } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");

  useEffect(() => {
    setSongs(getRandomSongs());
  }, []);

  const handleUpdateGameState = (state: {
    lives: number;
    score: number;
    multiplier: number;
  }) => {
    setLives(state.lives);
    setScore(state.score);
    setMultiplier(state.multiplier);
  };

  const handleNavigation = (target: "game" | "leaderboard") => {
    if (target === "game" && lives <= 0) {
      // Reset game state if returning to game after dying
      setLives(3);
      setScore(0);
      setMultiplier(1.0);
      setSongs(getRandomSongs());
      setGameStatus("idle");
    }
    setActiveTab(target);
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col font-sans antialiased">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleNavigation}
        lives={lives}
        score={score}
        multiplier={multiplier}
        showHUD={activeTab === "game" && gameStatus !== "idle"}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8 flex flex-col">
        {activeTab === "game" ? (
          <GameView
            songs={songs.length > 0 ? songs : INITIAL_SONGS}
            lives={lives}
            score={score}
            multiplier={multiplier}
            onUpdateState={handleUpdateGameState}
            onViewLeaderboard={() => handleNavigation("leaderboard")}
            onGameStatusChange={setGameStatus}
          />
        ) : (
          <LeaderboardView onPlayClick={() => handleNavigation("game")} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-800/80 py-6 px-4 text-center text-xs text-stone-500 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2.5 bg-black/30">
        <button
          type="button"
          onClick={() => handleNavigation(activeTab === 'game' ? 'leaderboard' : 'game')}
          className="font-bold text-amber-500 hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all cursor-pointer tracking-wider uppercase"
        >
          {activeTab === 'game' ? 'Ranking Mundial' : 'Volver a Jugar'}
        </button>

        <div className="flex items-center justify-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-sm">🎧</span>
          <span>
            Desarrollado por{' '}
            <a
              href="https://www.linkedin.com/in/lucas-chorolqui-319090264/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
            >
              Lucas
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
