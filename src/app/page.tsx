"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GameView } from "@/components/GameView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { Song } from "@/types";
import { INITIAL_SONGS, getRandomSongs } from "@/lib/songs-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard">("game");
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isHelpOpen, setIsHelpOpen] = useState(true);

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
    <div className="min-h-screen text-stone-800 flex flex-col font-sans antialiased">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        lives={lives}
        score={score}
        multiplier={multiplier}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
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
      <footer className="w-full border-t border-stone-200/70 py-5 px-4 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2.5">
        <div className="flex items-center gap-2">
          <span>
            🎧 <strong>oído absoluto</strong>
          </span>
          <span className="text-stone-300">•</span>
          <span>1.0s / 3.0s / 5.0s</span>
        </div>

        <div className="flex items-center gap-3 text-stone-500">
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="hover:text-purple-700 transition-colors cursor-pointer"
          >
            Reglas
          </button>
          <span>•</span>
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
