"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GameView } from "@/components/GameView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { Song } from "@/types";
import { INITIAL_SONGS, getRandomSongs } from "@/lib/songs-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);

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

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col font-sans">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lives={lives}
        score={score}
        multiplier={multiplier}
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
            onViewLeaderboard={() => setActiveTab("leaderboard")}
          />
        ) : (
          <LeaderboardView onPlayClick={() => setActiveTab("game")} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200/70 py-5 px-4 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto gap-4 sm:gap-2.5">
        <div className="flex items-center gap-2">
          <span>
            🎧 <strong className="hidden sm:inline">oído absoluto</strong>
          </span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline">1.0s / 3.0s / 5.0s</span>
        </div>

        <div className="flex items-center justify-center">
          <span>
            Desarrollado por{' '}
            <a
              href="https://www.linkedin.com/in/lucas-chorolqui-319090264/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-600 hover:text-purple-500 transition-colors underline decoration-purple-200 underline-offset-2"
            >
              Lucas
            </a>
          </span>
        </div>

        <div className="flex items-center gap-3 text-stone-500">
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className="hover:text-amber-700 transition-colors cursor-pointer"
          >
            Ranking Mundial
          </button>
        </div>
      </footer>
    </div>
  );
}
