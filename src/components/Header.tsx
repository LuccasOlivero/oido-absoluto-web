'use client';

import React from 'react';
import { Headphones, Trophy, HelpCircle } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

interface HeaderProps {
  activeTab: 'game' | 'leaderboard';
  onSelectTab: (tab: 'game' | 'leaderboard') => void;
  lives: number;
  maxLives?: number;
  score: number;
  multiplier: number;
  onOpenHelp: () => void;
}

export function Header({
  activeTab,
  onSelectTab,
  lives,
  maxLives = 3,
  score,
  multiplier,
  onOpenHelp
}: HeaderProps) {
  return (
    <header className="w-full bg-[#F8F7F4]/95 backdrop-blur-md sticky top-0 z-40 border-b border-stone-200/70">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Top Row on Mobile: Brand Logo + Controls */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div
            onClick={() => onSelectTab('game')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs group-hover:scale-105 transition-transform">
              <Headphones className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold tracking-tight text-stone-800 font-mono leading-none block">
                oído absoluto
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:inline">adivina el año del tema</span>
            </div>
          </div>

          {/* HUD in mobile top right */}
          <div className="flex items-center gap-1.5 sm:hidden">
            {/* Lives */}
            <div className="flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100 text-sm">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span
                  key={i}
                  className={`transition-all duration-300 ${
                    i < lives ? 'scale-100 opacity-100' : 'grayscale opacity-25 scale-75'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 text-xs font-bold text-amber-900 font-mono">
              <span>{score.toLocaleString()}</span>
              {multiplier > 1.0 && (
                <span className="text-[9px] text-purple-700 bg-purple-100 px-1 rounded">
                  x{multiplier.toFixed(1)}
                </span>
              )}
            </div>

            {/* Help Button */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 active:bg-stone-100 cursor-pointer shadow-2xs"
              title="Cómo Jugar"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-stone-200/70 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('game');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-purple-600" />
            <span>Jugar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onSelectTab('leaderboard');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Ranking</span>
          </button>
        </div>

        {/* Desktop HUD */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-rose-50/80 px-2.5 py-1 rounded-xl border border-rose-100 shadow-xs">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`text-base transition-all duration-300 ${
                  i < lives ? 'scale-100 opacity-100' : 'grayscale opacity-25 scale-75'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Current Score */}
          <div className="flex items-center gap-2 bg-amber-50/80 px-3 py-1 rounded-xl border border-amber-100 shadow-xs">
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase font-semibold text-amber-800/70">Puntos</span>
              <span className="text-xs sm:text-sm font-bold text-amber-900 font-mono leading-none">
                {score.toLocaleString()}
              </span>
            </div>
            {multiplier > 1.0 && (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md border border-purple-200">
                x{multiplier.toFixed(1)}
              </span>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors shadow-xs cursor-pointer"
            title="Cómo Jugar"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
