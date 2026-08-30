'use client';

import React from 'react';
import { Headphones, Trophy, HelpCircle, Activity } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

interface HeaderProps {
  activeTab: 'game' | 'leaderboard';
  onSelectTab: (tab: 'game' | 'leaderboard') => void;
  lives: number;
  maxLives?: number;
  score: number;
  multiplier: number;
}

export function Header({
  activeTab,
  onSelectTab,
  lives,
  maxLives = 3,
  score,
  multiplier
}: HeaderProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-5 sticky top-0 z-50">
      <div className="w-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl px-3 sm:px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all">
        
        {/* Top Row on Mobile: Brand Logo + Controls */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          {/* Logo / Título */}
          <div
            onClick={() => onSelectTab('game')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-fuchsia-500 text-white flex items-center justify-center border-2 border-white/50 shadow-[0_0_15px_rgba(217,70,239,0.5)] group-hover:scale-105 group-hover:rotate-3 transition-all">
              <Headphones className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] sm:text-base font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-fuchsia-600 font-mono leading-none">
                OÍDO ABSOLUTO
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:flex items-center gap-1 font-medium tracking-wide mt-0.5">
                <Activity className="w-3 h-3 text-cyan-500" /> adivina el año del tema
              </span>
            </div>
          </div>

          {/* HUD in mobile top right */}
          <div className="flex items-center gap-1.5 sm:hidden">
            {/* Lives */}
            <div className="flex items-center gap-0.5 bg-rose-50/90 px-2 py-1 rounded-xl border border-rose-200/50 shadow-xs">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs transition-all duration-300 ${
                    i < lives ? 'scale-100 opacity-100 drop-shadow-[0_0_2px_rgba(244,63,94,0.5)]' : 'grayscale opacity-25 scale-75'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 bg-gradient-to-br from-stone-900 to-stone-800 px-2.5 py-1 rounded-xl border border-stone-700 shadow-xs text-xs font-bold text-amber-400 font-mono">
              <span>{score.toLocaleString()}</span>
              {multiplier > 1.0 && (
                <span className="text-[9px] text-cyan-300 bg-cyan-900/50 border border-cyan-800 px-1 rounded shadow-[0_0_5px_rgba(6,182,212,0.4)]">
                  x{multiplier.toFixed(1)}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Tab Switcher - Glassmorphic Pill */}
        <div className="flex items-center p-1 bg-stone-100/80 shadow-inner rounded-2xl w-full sm:w-auto relative border border-stone-200/50">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('game');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer z-10 ${
              activeTab === 'game'
                ? 'bg-white text-purple-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
            }`}
          >
            <Headphones className={`w-4 h-4 ${activeTab === 'game' ? 'text-purple-600' : ''}`} />
            <span>Juego</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('leaderboard');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer z-10 ${
              activeTab === 'leaderboard'
                ? 'bg-white text-amber-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50/50'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-amber-500' : ''}`} />
            <span>Ranking</span>
          </button>
        </div>

        {/* Desktop HUD */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-rose-50/90 px-3 py-1.5 rounded-2xl border border-rose-200/50 shadow-xs">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`text-base transition-all duration-300 ${
                  i < lives ? 'scale-100 opacity-100 drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]' : 'grayscale opacity-25 scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Current Score - Digital Display Look */}
          <div className="flex items-center gap-2.5 bg-gradient-to-b from-stone-900 to-stone-800 px-4 py-1.5 rounded-2xl border border-stone-700 shadow-md">
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Score</span>
              <span className="text-sm sm:text-base font-black text-amber-400 font-mono leading-none drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]">
                {score.toLocaleString()}
              </span>
            </div>
            {multiplier > 1.0 && (
              <span className="text-[10px] font-black tracking-wider text-cyan-300 bg-cyan-900/60 px-2 py-0.5 rounded-lg border border-cyan-700 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                x{multiplier.toFixed(1)}
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
