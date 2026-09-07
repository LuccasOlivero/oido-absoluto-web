'use client';

import React, { useEffect } from 'react';
import { RoundResult } from '@/types';
import { Trophy, ArrowRight, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
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
        textColor: 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]',
        bg: 'bg-fuchsia-950/40 border-fuchsia-600/50 shadow-[inset_0_0_15px_rgba(217,70,239,0.3)]'
      };
    }
    if (yearDiff === 1) {
      return {
        title: '¡Casi Perfecto!',
        subtitle: '¡Solo 1 año de diferencia!',
        badge: '✨ 80% Puntos',
        textColor: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
        bg: 'bg-cyan-950/40 border-cyan-600/50 shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]'
      };
    }
    if (yearDiff <= 3) {
      return {
        title: '¡Buen Intento!',
        subtitle: `Diferencia de ${yearDiff} años`,
        badge: '👍 50% Puntos',
        textColor: 'text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]',
        bg: 'bg-purple-950/30 border-purple-800/50'
      };
    }
    if (yearDiff <= 5) {
      return {
        title: 'Por Poco...',
        subtitle: `Diferencia de ${yearDiff} años`,
        badge: '⚠️ 25% Puntos',
        textColor: 'text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]',
        bg: 'bg-amber-950/30 border-amber-900/50'
      };
    }
    return {
      title: '¡Le erraste!',
      subtitle: `Diferencia de ${yearDiff} años (máx: 5)`,
      badge: '💔 -1 Vida',
      textColor: 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
      bg: 'bg-red-950/40 border-red-700/50 shadow-[inset_0_0_15px_rgba(239,68,68,0.3)]'
    };
  };

  const header = getResultHeader();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-4 sm:gap-5 relative my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Result Header Badge */}
        <div className={`w-full p-4 rounded-2xl border ${header.bg} flex flex-col items-center text-center`}>
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 bg-black/60 rounded-full mb-2 text-stone-300 border border-stone-700">
            {header.badge}
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-wider ${header.textColor}`}>
            {header.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-mono">{header.subtitle}</p>
        </div>

        {/* Song Card */}
        <div className="w-full flex items-center gap-4 bg-black/50 p-3.5 rounded-2xl border border-stone-800">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-stone-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            {song.cover_url || song.youtube_id ? (
              <img
                src={song.cover_url || `https://img.youtube.com/vi/${song.youtube_id}/mqdefault.jpg`}
                alt={song.title}
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-600">
                🎵
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest truncate">
              {song.genre || 'Canción'}
            </span>
            <h3 className="text-base font-bold text-stone-200 truncate">
              {song.title}
            </h3>
            <p className="text-xs text-stone-500 truncate">{song.artist}</p>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onPlayFull}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer border border-cyan-900/50 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingFull ? 'Pausar' : 'Escuchar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comparison grid */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          <div className="bg-black/60 p-3 rounded-2xl border border-stone-800 flex flex-col items-center shadow-inner">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Tu Respuesta</span>
            <span className="text-2xl font-black text-stone-300 font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{selectedYear}</span>
            <span className="text-[10px] text-stone-600 font-mono">({snippetUsed}s oído)</span>
          </div>

          <div className="bg-cyan-950/20 p-3 rounded-2xl border border-cyan-900/30 flex flex-col items-center shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Año Real</span>
            <span className="text-2xl font-black text-cyan-400 font-mono drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{actualYear}</span>
            <span className="text-[10px] text-cyan-700 font-mono font-bold">
              {isExact ? '¡Exacto!' : `Diff: ${yearDiff}`}
            </span>
          </div>
        </div>

        {/* Points Banner */}
        <div className="w-full flex items-center justify-between px-4 py-3 bg-amber-950/30 border border-amber-900/50 rounded-2xl shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]" />
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Puntos Ganados:</span>
          </div>
          <div className="flex items-center gap-2">
            {bonusPoints > 0 && (
              <span className="text-[11px] text-fuchsia-300 font-bold bg-fuchsia-950/60 px-2 py-0.5 rounded-full border border-fuchsia-800 shadow-[0_0_5px_rgba(217,70,239,0.4)]">
                +{bonusPoints} bonus
              </span>
            )}
            <span className="text-base font-black text-amber-400 font-mono drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
              +{pointsEarned} pts
            </span>
          </div>
        </div>

        {/* Next song button */}
        <button
          type="button"
          onClick={onNextRound}
          autoFocus
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-base flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.4)] active:scale-95 transition-all cursor-pointer border border-fuchsia-400/50"
        >
          <span className="drop-shadow-md">Siguiente Canción</span>
          <ArrowRight className="w-4 h-4 drop-shadow-md" />
        </button>
      </motion.div>
    </div>
  );
}
