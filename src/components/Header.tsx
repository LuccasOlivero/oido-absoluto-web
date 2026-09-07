'use client';

import React from 'react';
import { Headphones, Trophy, Activity } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  activeTab: 'game' | 'leaderboard';
  onSelectTab: (tab: 'game' | 'leaderboard') => void;
  lives: number;
  maxLives?: number;
  score: number;
  multiplier: number;
  showHUD?: boolean;
}

export function Header({
  activeTab,
  onSelectTab,
  lives,
  maxLives = 3,
  score,
  multiplier,
  showHUD = true
}: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto p-[10px] sm:px-4 sm:py-5 sticky top-0 z-50 relative">
      <div className="w-full bg-[#1c1917] border border-[#292524] rounded-[24px] p-[10px] sm:px-5 sm:py-3 flex flex-row items-center justify-between gap-2 sm:gap-4 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] relative z-20">
        
        {/* Brand Logo - Desktop Only */}
        <div className="hidden sm:flex items-center justify-start flex-1">
          <button
            onClick={() => onSelectTab('game')}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#a855f7] to-[#d946ef] text-white flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(217,70,239,0.5)] group-hover:scale-105 group-hover:rotate-3 transition-all">
              <Headphones className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-md" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[15px] sm:text-base font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-mono leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                OÍDO ABSOLUTO
              </span>
              <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium tracking-wide mt-0.5 uppercase">
                <Activity className="w-3 h-3 text-fuchsia-500" /> adivina el año
              </span>
            </div>
          </button>
        </div>

        {/* Tab Switcher - Mobile & Desktop */}
        <div className="flex items-center p-1 bg-black/40 rounded-2xl relative border border-stone-800 shrink-0 mx-auto flex-1 sm:flex-initial">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('game');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 z-10 ${
              activeTab === 'game'
                ? 'bg-stone-800 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)] border border-fuchsia-900/50'
                : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900/50'
            }`}
          >
            <Headphones className={`w-4 h-4 ${activeTab === 'game' ? 'text-fuchsia-400' : ''}`} />
            <span>Juego</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('leaderboard');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 z-10 ${
              activeTab === 'leaderboard'
                ? 'bg-stone-800 text-amber-400 shadow-[0_0_10px_rgba(252,211,77,0.2)] border border-amber-900/50'
                : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900/50'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-amber-500' : ''}`} />
            <span>Ranking</span>
          </button>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center justify-end sm:flex-1 gap-3">
          <UserMenu />
        </div>
      </div>

      {showHUD && (
        <>
          {/* Global HUD - Absolutely positioned outside the header box */}
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1.5 rounded-xl border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)] backdrop-blur-sm transition-all duration-300 animate-in fade-in zoom-in-95">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm transition-all duration-300 ${
                    i < lives ? 'scale-100 opacity-100 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)] text-red-500' : 'grayscale opacity-25 scale-75 text-stone-600'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-9 right-4 z-10">
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-xl border border-amber-900/30 shadow-[0_0_8px_rgba(252,211,77,0.15)] backdrop-blur-sm text-sm font-bold text-amber-400 font-mono transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="drop-shadow-[0_0_4px_rgba(252,211,77,0.5)]">{score.toLocaleString()}</span>
              {multiplier > 1.0 && (
                <span className="text-[11px] text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-1 rounded shadow-[0_0_5px_rgba(34,211,238,0.4)]">
                  x{multiplier.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
