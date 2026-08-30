'use client';

import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { LeaderboardEntry } from '@/types';
import { fetchLeaderboard } from '@/lib/supabase';
import { getCountryByCode } from '@/lib/countries';
import { Search, RefreshCw, Play, Sparkles, Globe2, Flame } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

interface LeaderboardViewProps {
  onPlayClick: () => void;
}

function formatRelativeTime(dateStr: string, referenceTime: number): string {
  if (!referenceTime) return '';
  try {
    const diffMs = referenceTime - new Date(dateStr).getTime();
    if (isNaN(diffMs)) return '';
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  } catch {
    return '';
  }
}

export function LeaderboardView({ onPlayClick }: LeaderboardViewProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [, startTransition] = useTransition();

  const loadScores = useCallback(async () => {
    try {
      const data = await fetchLeaderboard(100);
      startTransition(() => {
        setEntries(data);
        setCurrentTime(Date.now());
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
        const data = await fetchLeaderboard(100);
        if (mounted) {
          startTransition(() => {
            setEntries(data);
            setCurrentTime(Date.now());
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

  return (
    <div className="w-full flex flex-col items-center gap-5 sm:gap-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 bg-white border border-stone-200/80 p-4 sm:p-7 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Globe2 className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Ranking Mundial
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-stone-900 leading-tight">
            Mejores Oídos del Mundo 🌍
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Jugadores con mayor precisión adivinando años musicales
          </p>
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
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Recargar Ranking"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onPlayClick();
            }}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Jugar Ahora</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length >= 3 && !search.trim() && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 items-end pt-1">
          {/* 2nd Place */}
          <div className="order-2 sm:order-1 bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 sm:p-4 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-xs">
            <div className="flex items-center sm:flex-col gap-3 sm:gap-1">
              <span className="text-3xl">{getCountryByCode(top3[1].country_code).flag}</span>
              <div>
                <div className="text-[10px] font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full inline-block sm:mb-1">
                  🥈 2º Puesto
                </div>
                <h3 className="font-bold text-stone-800 text-sm truncate">
                  {top3[1].player_name}
                </h3>
                <span className="text-[10px] text-stone-400 block">
                  {getCountryByCode(top3[1].country_code).name}
                </span>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-black text-stone-900 font-mono sm:mt-1.5">
              {top3[1].score.toLocaleString()} <span className="text-[10px] text-stone-400">pts</span>
            </span>
          </div>

          {/* 1st Place */}
          <div className="order-1 sm:order-2 bg-amber-50/90 border-2 border-amber-200/90 rounded-2xl p-4 sm:p-5 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-sm">
            <div className="flex items-center sm:flex-col gap-3 sm:gap-1">
              <span className="text-4xl">{getCountryByCode(top3[0].country_code).flag}</span>
              <div>
                <div className="text-[10px] font-bold px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full inline-flex items-center gap-1 sm:mb-1">
                  <span>🥇 1º Campeón</span>
                  <Flame className="w-3 h-3 text-amber-700" />
                </div>
                <h3 className="font-extrabold text-amber-950 text-base truncate">
                  {top3[0].player_name}
                </h3>
                <span className="text-[11px] text-amber-700 font-medium block">
                  {getCountryByCode(top3[0].country_code).name}
                </span>
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-amber-900 font-mono sm:mt-1.5">
              {top3[0].score.toLocaleString()} <span className="text-xs text-amber-700">pts</span>
            </span>
          </div>

          {/* 3rd Place */}
          <div className="order-3 sm:order-3 bg-orange-50/60 border border-orange-200/70 rounded-2xl p-3.5 sm:p-4 flex sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center shadow-xs">
            <div className="flex items-center sm:flex-col gap-3 sm:gap-1">
              <span className="text-3xl">{getCountryByCode(top3[2].country_code).flag}</span>
              <div>
                <div className="text-[10px] font-bold px-2 py-0.5 bg-orange-200 text-orange-900 rounded-full inline-block sm:mb-1">
                  🥉 3º Puesto
                </div>
                <h3 className="font-bold text-stone-800 text-sm truncate">
                  {top3[2].player_name}
                </h3>
                <span className="text-[10px] text-stone-400 block">
                  {getCountryByCode(top3[2].country_code).name}
                </span>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-black text-stone-900 font-mono sm:mt-1.5">
              {top3[2].score.toLocaleString()} <span className="text-[10px] text-stone-400">pts</span>
            </span>
          </div>
        </div>
      )}

      {/* Filter and Table */}
      <div className="w-full bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por jugador o país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 text-stone-800 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-purple-400 placeholder-stone-400"
            />
          </div>
          <span className="text-xs text-stone-400 font-medium">
            {filteredEntries.length} jugadores
          </span>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-stone-200/80 bg-stone-50/70 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-2.5 px-2.5 text-center w-10">#</th>
                <th className="py-2.5 px-2.5">Jugador & País</th>
                <th className="py-2.5 px-2.5 text-right">Puntaje</th>
                <th className="py-2.5 px-2.5 text-center hidden sm:table-cell">Temas</th>
                <th className="py-2.5 px-2.5 text-center hidden md:table-cell">Exactos (1.0s)</th>
                <th className="py-2.5 px-2.5 text-right hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-purple-600 mb-1.5" />
                    Cargando ranking...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => {
                  const country = getCountryByCode(entry.country_code);
                  const isTop1 = index === 0;

                  return (
                    <tr
                      key={entry.id || index}
                      className={`transition-colors hover:bg-stone-50/80 ${
                        isTop1 ? 'bg-amber-50/40 font-medium' : ''
                      }`}
                    >
                      {/* Rank # */}
                      <td className="py-2.5 px-2.5 text-center font-mono font-bold text-stone-500">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                      </td>

                      {/* Player & Country Flag */}
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none" title={country.name}>
                            {country.flag}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-stone-800 truncate text-xs sm:text-sm">
                              {entry.player_name}
                            </span>
                            <span className="text-[10px] text-stone-400 truncate">
                              {country.name} ({country.code})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                          {entry.score.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-stone-400 ml-0.5">pts</span>
                      </td>

                      {/* Songs Guessed */}
                      <td className="py-2.5 px-2.5 text-center font-mono text-stone-600 hidden sm:table-cell">
                        {entry.songs_guessed}
                      </td>

                      {/* Exact Hits */}
                      <td className="py-2.5 px-2.5 text-center hidden md:table-cell">
                        <span className="inline-flex items-center gap-0.5 text-amber-800 font-mono text-xs bg-amber-100/70 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          {entry.exact_hits}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-2.5 text-right text-xs text-stone-400 font-mono hidden sm:table-cell">
                        {formatRelativeTime(entry.created_at, currentTime)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
