'use client';

import React, { useState } from 'react';
import { CountryPicker } from './CountryPicker';
import { Country } from '@/types';
import { Trophy, RefreshCw, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

interface GameOverModalProps {
  score: number;
  songsGuessed: number;
  exactHits: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  onSubmitScore: (playerName: string, countryCode: string) => Promise<void>;
}

export function GameOverModal({
  score,
  songsGuessed,
  exactHits,
  onRestart,
  onViewLeaderboard,
  onSubmitScore
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting || isSaved) return;

    setIsSubmitting(true);
    try {
      sfx.playClick();
      await onSubmitScore(playerName.trim(), selectedCountry.code);
      setIsSaved(true);
      sfx.playExact();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col items-center gap-4 sm:gap-5 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-1.5">💔</div>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-950">
            Fin de la Partida
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Te has quedado sin vidas. ¡Gran oído musical!
          </p>
        </div>

        {/* Final Score Callout */}
        <div className="w-full bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex flex-col items-center">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
            Puntaje Final
          </span>
          <span className="text-4xl font-black text-amber-950 font-mono my-0.5">
            {score.toLocaleString()}
          </span>
          <span className="text-xs text-amber-700/80 font-medium">puntos acumulados</span>

          {/* Quick stats row */}
          <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-200/60 text-center">
            <div>
              <span className="text-[10px] text-stone-500 uppercase">Aciertos</span>
              <p className="text-lg font-bold text-stone-800 font-mono">{songsGuessed}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase">Exactos (1.0s)</span>
              <p className="text-lg font-bold text-amber-800 font-mono flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {exactHits}
              </p>
            </div>
          </div>
        </div>

        {/* Form to submit score */}
        {!isSaved ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Tu Nombre o Apodo
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Ej: Melómano77, DJ_Rock..."
                className="w-full px-4 py-2.5 bg-stone-50 text-stone-900 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-sm placeholder-stone-400"
              />
            </div>

            <CountryPicker
              selectedCode={selectedCountry.code}
              onSelect={(country) => setSelectedCountry(country)}
            />

            <button
              type="submit"
              disabled={!playerName.trim() || isSubmitting}
              className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-purple-200" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Récord en Ranking'}</span>
            </button>
          </form>
        ) : (
          <div className="w-full p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div className="text-xs">
              <p className="font-bold">¡Récord guardado con éxito!</p>
              <p className="text-emerald-700">Ya apareces en la tabla de clasificación.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-stone-200 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Jugar de Nuevo</span>
          </button>

          <button
            type="button"
            onClick={onViewLeaderboard}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Ranking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
