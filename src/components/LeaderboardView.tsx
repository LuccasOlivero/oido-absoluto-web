'use client';

import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { LeaderboardEntry } from '@/types';
import { fetchLeaderboard } from '@/lib/supabase';
import { getCountryByCode } from '@/lib/countries';
import { Search, RefreshCw, Play, Sparkles, Globe2, Flame, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

import { createClient } from '@/lib/supabase/client';

const FlagImage = ({ code, className = "w-6 h-4" }: { code: string; className?: string }) => (
  <img 
    src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} 
    alt={code} 
    loading="lazy"
    className={`rounded-[2px] object-cover shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-stone-800 ${className}`} 
  />
);

interface LeaderboardViewProps {
  onPlayClick: () => void;
}

export function LeaderboardView({ onPlayClick }: LeaderboardViewProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [, startTransition] = useTransition();

  const loadScores = useCallback(async () => {
    try {
      const data = await fetchLeaderboard(100);
      startTransition(() => {
        setEntries(data);
        setLoading(false);
      });
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      startTransition(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialFetch() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted && user) setCurrentUserId(user.id);

        const data = await fetchLeaderboard(100);
        if (mounted) {
          startTransition(() => {
            setEntries(data);
            setLoading(false);
          });
        }
      } catch {
        if (mounted) {
          startTransition(() => {
            setLoading(false);
          });
        }
      }
    }

    initialFetch();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase().trim();
    return entries.filter((e) => {
      const country = getCountryByCode(e.country_code);
      return (
        e.player_name.toLowerCase().includes(q) ||
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q)
      );
    });
  }, [entries, search]);

  const top3 = entries.slice(0, 3);
  const visibleEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  return (
    <div className="w-full flex flex-col items-center gap-5 sm:gap-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 bg-black border border-stone-800 p-4 sm:p-7 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Globe2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              RED GLOBAL
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-stone-200 leading-tight uppercase tracking-widest">
            Mejores Oídos
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setLoading(true);
              loadScores();
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-cyan-400 border border-stone-700 hover:border-cyan-900 transition-all active:scale-95 cursor-pointer shadow-inner"
            title="Recargar Ranking"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onPlayClick();
            }}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(217,70,239,0.4)] border border-fuchsia-400/50 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white drop-shadow-md" />
            <span className="drop-shadow-md">NUEVA SESIÓN</span>
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      {!loading && top3.length >= 3 && search === '' && currentPage === 1 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end mt-2">
          {/* 2nd Place */}
          <div className={`order-2 sm:order-1 bg-cyan-950/20 border border-cyan-900/50 rounded-2xl p-3.5 sm:p-4 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-[inset_0_0_15px_rgba(34,211,238,0.05)] h-full sm:h-[90%] transition-colors ${top3[1].user_id === currentUserId ? 'animate-flash-row' : ''}`}>
            <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
              <FlagImage code={top3[1].country_code} className="w-8 h-6 sm:w-10 sm:h-7 opacity-80" />
              <div>
                <div className="text-[10px] font-bold px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded-full inline-block sm:mb-1 border border-cyan-800">
                  🥈 Nv. 2
                </div>
                <h3 className="font-bold text-stone-300 text-sm truncate uppercase">
                  {top3[1].player_name}
                </h3>
                <span className="text-[10px] text-stone-500 block">
                  {getCountryByCode(top3[1].country_code).name}
                </span>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-black text-cyan-500 font-mono sm:mt-1.5 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              {top3[1].score.toLocaleString()} <span className="text-[10px] text-cyan-700">pts</span>
            </span>
          </div>

          {/* 1st Place */}
          <div className={`order-1 sm:order-2 bg-amber-950/20 border border-amber-500/50 rounded-2xl p-4 sm:p-6 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-[0_0_20px_rgba(245,158,11,0.15)] h-full z-10 relative transition-colors ${top3[0].user_id === currentUserId ? 'animate-flash-row' : ''}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.6)]">
              <Trophy className="w-3 h-3" /> CAMPEÓN
            </div>
            <div className="flex items-center sm:flex-col gap-3 sm:gap-2 w-full mt-2 sm:mt-0">
              <FlagImage code={top3[0].country_code} className="w-10 h-7 sm:w-14 sm:h-10 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]" />
              <div className="flex-1 sm:w-full">
                <h3 className="font-black text-amber-400 text-base sm:text-lg truncate uppercase drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                  {top3[0].player_name}
                </h3>
                <span className="text-xs text-amber-700 font-bold block uppercase tracking-wider">
                  {getCountryByCode(top3[0].country_code).name}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end sm:items-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono sm:mt-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                {top3[0].score.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Puntos</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className={`order-3 sm:order-3 bg-fuchsia-950/20 border border-fuchsia-900/50 rounded-2xl p-3.5 sm:p-4 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-[inset_0_0_15px_rgba(217,70,239,0.05)] h-full sm:h-[90%] transition-colors ${top3[2].user_id === currentUserId ? 'animate-flash-row' : ''}`}>
            <div className="flex items-center sm:flex-col gap-3 sm:gap-2">
              <FlagImage code={top3[2].country_code} className="w-8 h-6 sm:w-10 sm:h-7 opacity-80" />
              <div>
                <div className="text-[10px] font-bold px-2 py-0.5 bg-fuchsia-950 text-fuchsia-400 rounded-full inline-block sm:mb-1 border border-fuchsia-800">
                  🥉 Nv. 3
                </div>
                <h3 className="font-bold text-stone-300 text-sm truncate uppercase">
                  {top3[2].player_name}
                </h3>
                <span className="text-[10px] text-stone-500 block">
                  {getCountryByCode(top3[2].country_code).name}
                </span>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-black text-fuchsia-500 font-mono sm:mt-1.5 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
              {top3[2].score.toLocaleString()} <span className="text-[10px] text-fuchsia-800">pts</span>
            </span>
          </div>
        </div>
      )}

      {/* Filter and Table */}
      <div className="w-full bg-black border border-stone-800 rounded-3xl p-4 sm:p-5 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rastrear oído..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-stone-950 text-cyan-400 text-xs sm:text-sm font-mono rounded-xl border border-stone-800 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] placeholder-stone-600 transition-all"
            />
          </div>
          <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
            {filteredEntries.length} REGISTROS
          </span>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/50 text-[10px] font-black uppercase tracking-widest text-stone-500">
                <th className="py-2.5 px-2.5 text-center w-10">ID</th>
                <th className="py-2.5 px-2.5" title="Nombre del Jugador">Oído</th>
                <th className="py-2.5 px-2.5 text-right" title="Puntaje Total">Energía</th>
                <th className="py-2.5 px-2.5 text-center hidden sm:table-cell" title="Cantidad de temas adivinados">Ciclos</th>
                <th className="py-2.5 px-2.5 text-center hidden md:table-cell" title="Aciertos exactos en el año correcto">Sincronía</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-xs sm:text-sm font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-cyan-600">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400 mb-1.5" />
                    ACCEDIENDO A LA RED GLOBAL...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-600 text-xs">
                    DATOS NO ENCONTRADOS.
                  </td>
                </tr>
              ) : (
                visibleEntries.map((entry, index) => {
                  const country = getCountryByCode(entry.country_code);
                  const isTop1 = index === 0;
                  const isCurrentUser = currentUserId && entry.user_id === currentUserId;

                  return (
                    <tr
                      key={entry.id || index}
                      className={`transition-colors hover:bg-stone-900/50 ${
                        isTop1 ? 'bg-amber-950/10' : ''
                      } ${
                        isCurrentUser ? 'border-y border-cyan-500/30 animate-flash-row' : ''
                      }`}
                    >
                      {/* Rank # */}
                      <td className="py-2.5 px-2.5 text-center font-bold text-stone-600">
                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `0${index + 1}`}
                      </td>

                      {/* Player & Country Flag */}
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2.5">
                          <FlagImage code={country.code} className="w-6 h-4 shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-cyan-300 truncate text-xs sm:text-sm drop-shadow-[0_0_2px_rgba(34,211,238,0.3)]">
                              {entry.player_name}
                            </span>
                            <span className="text-[10px] text-stone-500 truncate uppercase">
                              {country.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                        <span className="font-black text-amber-400 text-xs sm:text-sm drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                          {entry.score.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-amber-700 ml-0.5">pts</span>
                      </td>

                      {/* Songs Guessed */}
                      <td className="py-2.5 px-2.5 text-center text-stone-500 hidden sm:table-cell">
                        {entry.songs_guessed}
                      </td>

                      {/* Exact Hits */}
                      <td className="py-2.5 px-2.5 text-center hidden md:table-cell">
                        <span className="inline-flex items-center gap-1 text-fuchsia-400 text-xs bg-fuchsia-950/40 px-2 py-0.5 rounded border border-fuchsia-900 shadow-[0_0_5px_rgba(217,70,239,0.2)]">
                          <Sparkles className="w-3 h-3" />
                          {entry.exact_hits}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                sfx.playClick();
                setCurrentPage(p => Math.max(1, p - 1));
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-cyan-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer uppercase tracking-widest"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> ATRÁS
            </button>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
              PÁGINA {currentPage} DE {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                sfx.playClick();
                setCurrentPage(p => Math.min(totalPages, p + 1));
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-cyan-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer uppercase tracking-widest"
            >
              ADELANTE <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
