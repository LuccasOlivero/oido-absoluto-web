'use client';

import React, { useEffect } from 'react';
import { RoundResult } from '@/types';
import { Trophy, ArrowRight, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoundResultModalProps {
  result: RoundResult;
  onNextRound: () => void;
  onPlayFull: () => void;
  isPlayingFull: boolean;
}

export function RoundResultModal({
  result,
  onNextRound,
  onPlayFull,
  isPlayingFull
}: RoundResultModalProps) {
  const {
    song,
    selectedYear,
    actualYear,
    yearDiff,
    snippetUsed,
    pointsEarned,
    isExact,
    bonusPoints
  } = result;

  useEffect(() => {
    if (isExact) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isExact]);

  const getResultHeader = () => {
    if (isExact) {
      return {
        title: '¡OÍDO ABSOLUTO!',
        subtitle: '¡Año exacto sin margen de error!',
        badge: '🎯 100% Precisión',
        textColor: 'text-amber-900',
        bg: 'bg-amber-50 border-amber-200'
      };
    }
    if (yearDiff === 1) {
      return {
        title: '¡Casi Perfecto!',
        subtitle: '¡Solo 1 año de diferencia!',
        badge: '✨ 80% Puntos',
        textColor: 'text-emerald-900',
        bg: 'bg-emerald-50 border-emerald-200'
      };
    }
    if (yearDiff <= 3) {
      return {
        title: '¡Buen Intento!',
        subtitle: `Diferencia de ${yearDiff} años`,
        badge: '👍 50% Puntos',
        textColor: 'text-purple-900',
        bg: 'bg-purple-50 border-purple-200'
      };
    }
    if (yearDiff <= 5) {
      return {
        title: 'Por Poco...',
        subtitle: `Diferencia de ${yearDiff} años`,
        badge: '⚠️ 25% Puntos',
        textColor: 'text-orange-900',
        bg: 'bg-orange-50 border-orange-200'
      };
    }
    return {
      title: '¡Le erraste!',
      subtitle: `Diferencia de ${yearDiff} años (máx: 5)`,
      badge: '💔 -1 Vida',
      textColor: 'text-rose-900',
      bg: 'bg-rose-50 border-rose-200'
    };
  };

  const header = getResultHeader();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col items-center gap-4 sm:gap-5 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Result Header Badge */}
        <div className={`w-full p-4 rounded-2xl border ${header.bg} flex flex-col items-center text-center`}>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/80 rounded-full mb-1.5 text-stone-700 border border-stone-200/60">
            {header.badge}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black ${header.textColor}`}>
            {header.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{header.subtitle}</p>
        </div>

        {/* Song Card */}
        <div className="w-full flex items-center gap-4 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-xs">
            {song.cover_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={song.cover_url}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                🎵
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] text-purple-700 font-semibold uppercase tracking-wider truncate">
              {song.genre || 'Canción'}
            </span>
            <h3 className="text-base font-bold text-stone-900 truncate">
              {song.title}
            </h3>
            <p className="text-xs text-stone-500 truncate">{song.artist}</p>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onPlayFull}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingFull ? 'Pausar' : 'Escuchar'}</span>
              </button>

              {song.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${song.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-all border border-red-200/60 cursor-pointer"
                >
                  <span>YouTube</span>
                  <span className="text-[10px]">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Comparison grid */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 flex flex-col items-center">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Tu Respuesta</span>
            <span className="text-2xl font-black text-stone-800 font-mono">{selectedYear}</span>
            <span className="text-[10px] text-stone-400 font-mono">({snippetUsed}s oído)</span>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80 flex flex-col items-center">
            <span className="text-[10px] text-emerald-700 font-semibold uppercase">Año Real</span>
            <span className="text-2xl font-black text-emerald-800 font-mono">{actualYear}</span>
            <span className="text-[10px] text-emerald-600 font-mono">
              {isExact ? '¡Exacto!' : `Diff: ${yearDiff} ${yearDiff === 1 ? 'año' : 'años'}`}
            </span>
          </div>
        </div>

        {/* Points Banner */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-950">Puntos Ganados:</span>
          </div>
          <div className="flex items-center gap-2">
            {bonusPoints > 0 && (
              <span className="text-[11px] text-amber-700 font-semibold bg-amber-200/70 px-2 py-0.5 rounded-full">
                +{bonusPoints} bonus
              </span>
            )}
            <span className="text-base font-black text-amber-900 font-mono">
              +{pointsEarned} pts
            </span>
          </div>
        </div>

        {/* Next song button */}
        <button
          type="button"
          onClick={onNextRound}
          autoFocus
          className="w-full py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          <span>Siguiente Canción</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
