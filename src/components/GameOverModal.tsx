'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Country } from '@/types';
import { Trophy, RefreshCw, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';
import { detectCountryCode } from '@/lib/geo';
import { getCountryByCode } from '@/lib/countries';
import { createClient } from '@/lib/supabase/client';
import { saveLeaderboardScore } from '@/lib/supabase';

interface GameOverModalProps {
  score: number;
  songsGuessed: number;
  exactHits: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

export function GameOverModal({
  score,
  songsGuessed,
  exactHits,
  onRestart,
  onViewLeaderboard
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷'
  });
  const [scoreStatus, setScoreStatus] = useState<'saving' | 'saved' | 'not-logged-in' | 'no-new-record' | 'error' | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadDataAndSave() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setScoreStatus('saving');
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setHasProfile(true);
          setPlayerName(data.player_name);
          setSelectedCountry(getCountryByCode(data.country_code));
          
          try {
            const result = await saveLeaderboardScore({
              player_name: data.player_name,
              country_code: data.country_code,
              score,
              songs_guessed: songsGuessed,
              exact_hits: exactHits
            });
            
            if (result) {
              setScoreStatus('saved');
              sfx.playExact();
            } else {
              setScoreStatus('no-new-record');
            }
          } catch (e) {
            console.error(e);
            setScoreStatus('error');
          }
        }
      } else {
        setScoreStatus('not-logged-in');
      }
      setLoadingProfile(false);
    }
    loadDataAndSave();
  }, [score, songsGuessed, exactHits]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center gap-4 sm:gap-5 relative my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-1.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">💀</div>
          <h2 className="text-2xl sm:text-3xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            Fin de la Partida
          </h2>
          <p className="text-xs text-stone-400 mt-1 font-mono">
            Te has quedado sin vidas. ¡Gran oído musical!
          </p>
        </div>

        {/* Final Score Callout */}
        <div className="w-full bg-amber-950/20 border border-amber-900/50 p-4 rounded-2xl flex flex-col items-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
            Puntaje Final
          </span>
          <span className="text-4xl font-black text-amber-400 font-mono my-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
            {score.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest">puntos acumulados</span>

          {/* Quick stats row */}
          <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-amber-900/40 text-center">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Aciertos</span>
              <p className="text-lg font-black text-stone-300 font-mono">{songsGuessed}</p>
            </div>
            <div>
              <span className="text-[10px] text-fuchsia-600 uppercase font-bold tracking-wider">Exactos (1.0s)</span>
              <p className="text-lg font-black text-fuchsia-400 font-mono flex items-center justify-center gap-1 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
                <Sparkles className="w-3 h-3 text-fuchsia-400" />
                {exactHits}
              </p>
            </div>
          </div>
        </div>

        {/* Status Area */}
        <div className="w-full flex flex-col gap-3.5">
          {loadingProfile || scoreStatus === 'saving' ? (
            <div className="w-full h-16 bg-stone-900 rounded-xl animate-pulse flex items-center justify-center text-xs text-stone-500 font-mono">Guardando puntaje...</div>
          ) : hasProfile && scoreStatus === 'saved' ? (
            <div className="w-full p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800 flex items-center gap-3 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <CheckCircle2 className="w-5 h-5 shrink-0 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
              <div className="text-xs font-mono">
                <p className="font-bold text-cyan-300 drop-shadow-md">¡Nuevo récord personal!</p>
                <p className="text-cyan-600 font-sans mt-0.5">Se actualizó tu puntaje en el ranking mundial.</p>
              </div>
            </div>
          ) : hasProfile && scoreStatus === 'no-new-record' ? (
             <div className="w-full px-4 py-3 bg-stone-900/50 border border-stone-800 rounded-xl text-center">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-1">Tu récord sigue intacto</p>
                <p className="text-[11px] font-mono text-stone-500">Esta partida no superó tu máximo histórico.</p>
             </div>
          ) : scoreStatus === 'not-logged-in' ? (
            <div className="w-full px-4 py-3 bg-red-950/20 border border-red-900/50 rounded-xl text-center">
              <p className="text-xs text-red-500 uppercase tracking-widest font-bold mb-1">Modo Anónimo</p>
              <p className="text-[11px] font-mono text-stone-500">Inicia sesión para guardar tu puntaje en el ranking.</p>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-black hover:bg-stone-900 text-stone-400 hover:text-stone-300 font-bold tracking-wider text-xs flex items-center justify-center gap-1.5 border border-stone-800 hover:border-stone-700 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Jugar de Nuevo</span>
          </button>

          <button
            type="button"
            onClick={onViewLeaderboard}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-950/30 hover:bg-purple-900/50 text-purple-400 border border-purple-900/50 font-bold tracking-wider text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Ranking</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
