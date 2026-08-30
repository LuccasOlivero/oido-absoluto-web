'use client';

import React from 'react';
import { SnippetDuration } from '@/types';
import { Play, Square, Sparkles, Zap, Search, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { Visualizer } from './Visualizer';
import { sfx } from '@/lib/audio-engine';

interface UnifiedGameModuleProps {
  // Audio & snippet props
  selectedSnippet: SnippetDuration;
  isPlaying: boolean;
  progress: number;
  onSelectSnippet: (duration: SnippetDuration) => void;
  onPlay: () => void;
  onStop: () => void;

  // Year timeline props
  year: number;
  minYear?: number;
  maxYear?: number;
  onYearChange: (year: number) => void;
  onConfirm: () => void;

  disabled?: boolean;
}

export function UnifiedGameModule({
  selectedSnippet,
  isPlaying,
  progress,
  onSelectSnippet,
  onPlay,
  onStop,
  year,
  minYear = 1960,
  maxYear = typeof window !== 'undefined' ? new Date().getFullYear() : 2026,
  onYearChange,
  onConfirm,
  disabled = false
}: UnifiedGameModuleProps) {
  const currentYear = maxYear;

  // Generate decade steps dynamically up to current year
  const decades: number[] = [];
  for (let d = 1960; d <= currentYear; d += 10) {
    decades.push(d);
  }

  const snippets: {
    duration: SnippetDuration;
    label: string;
    points: number;
    icon: typeof Sparkles;
    activeStyle: string;
  }[] = [
    {
      duration: 1,
      label: '1.0s',
      points: 1000,
      icon: Sparkles,
      activeStyle: 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-200/70 shadow-xs'
    },
    {
      duration: 3,
      label: '3.0s',
      points: 600,
      icon: Zap,
      activeStyle: 'bg-purple-50 border-purple-300 text-purple-900 ring-2 ring-purple-200/70 shadow-xs'
    },
    {
      duration: 5,
      label: '5.0s',
      points: 300,
      icon: Search,
      activeStyle: 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-200/70 shadow-xs'
    }
  ];

  const handleStep = (step: number) => {
    sfx.playClick();
    const next = Math.max(minYear, Math.min(currentYear, year + step));
    onYearChange(next);
  };

  const handleDecadeClick = (dec: number) => {
    sfx.playClick();
    onYearChange(Math.min(currentYear, dec));
  };

  return (
    <div className="w-full bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-7 shadow-xs flex flex-col gap-5 sm:gap-6">
      {/* 1. SECCIÓN: REPRODUCTOR DE FRAGMENTO */}
      <div className="w-full flex flex-col items-center gap-3.5 sm:gap-4">
        {/* Encabezado */}
        <div className="w-full flex items-center justify-between px-0.5">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            1. Fragmento de Audio
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            Menos tiempo = Más puntos
          </span>
        </div>

        {/* Botones de duración de fragmentos */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3.5">
          {snippets.map((snip) => {
            const isSelected = selectedSnippet === snip.duration;
            const Icon = snip.icon;

            return (
              <button
                key={snip.duration}
                type="button"
                disabled={disabled || isPlaying}
                onClick={() => {
                  sfx.playClick();
                  onStop();
                  onSelectSnippet(snip.duration);
                }}
                className={`relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-1.5 sm:px-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? snip.activeStyle
                    : 'bg-stone-50/70 border-stone-200/70 text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-100'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'}`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-sm sm:text-base font-bold font-mono">
                    {snip.label}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold opacity-85">
                  +{snip.points} pts
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizador de ondas */}
        <Visualizer isPlaying={isPlaying} intensity={selectedSnippet === 1 ? 1.3 : 1} />

        {/* Barra de progreso del fragmento */}
        <div className="w-full max-w-xs flex flex-col gap-1">
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 transition-all duration-75 rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-stone-400">
            <span>0.0s</span>
            <span className="text-purple-700 font-semibold">{selectedSnippet}s</span>
          </div>
        </div>

        {/* Botón Central de Play/Stop */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (isPlaying) {
                onStop();
              } else {
                onPlay();
              }
            }}
            className={`flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full transition-all duration-200 cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/25 scale-105'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25 hover:scale-105 active:scale-95'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <Square className="w-6 h-6 fill-white animate-pulse" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold text-stone-700">
              {isPlaying ? 'Reproduciendo audio...' : 'Toca para reproducir'}
            </p>
            <p className="text-[10px] text-stone-400 sm:hidden">
              Puedes repetir las veces que quieras
            </p>
          </div>
        </div>
      </div>

      {/* DIVISOR SUTIL */}
      <div className="w-full border-t border-stone-100 relative my-0.5">
        <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-2.5 py-0.5 bg-stone-100 text-[10px] uppercase font-bold text-stone-400 rounded-full">
          Adivina el año
        </div>
      </div>

      {/* 2. SECCIÓN: ADIVINAR EL AÑO */}
      <div className="w-full flex flex-col items-center gap-3.5 sm:gap-4">
        {/* Encabezado año */}
        <div className="w-full flex items-center justify-between px-0.5">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            2. Año de Lanzamiento
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {minYear} - {currentYear}
          </span>
        </div>

        {/* Display del Año Seleccionado */}
        <div className="py-2 px-8 bg-purple-50/90 border border-purple-200/80 rounded-2xl shadow-2xs">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 font-mono">
            {year}
          </span>
        </div>

        {/* Botones de ajuste fino (-5, -1, +1, +5) y décadas */}
        <div className="w-full flex flex-col items-center gap-2">
          {/* Fila de controles rápidos táctiles */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              disabled={disabled || year <= minYear}
              onClick={() => handleStep(-5)}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200/80 active:scale-95 transition-all disabled:opacity-40 cursor-pointer min-w-[38px] text-center"
            >
              -5
            </button>
            <button
              type="button"
              disabled={disabled || year <= minYear}
              onClick={() => handleStep(-1)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 active:scale-95 transition-all disabled:opacity-40 cursor-pointer min-w-[38px] flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={disabled || year >= currentYear}
              onClick={() => handleStep(1)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 active:scale-95 transition-all disabled:opacity-40 cursor-pointer min-w-[38px] flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={disabled || year >= currentYear}
              onClick={() => handleStep(5)}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200/80 active:scale-95 transition-all disabled:opacity-40 cursor-pointer min-w-[38px] text-center"
            >
              +5
            </button>
          </div>

          {/* Atajos por décadas con scroll horizontal si es necesario en móviles */}
          <div className="w-full flex items-center justify-center overflow-x-auto py-1 px-0.5 gap-1 scrollbar-none">
            {decades.map((dec) => {
              const isCurrentDecade = Math.floor(year / 10) * 10 === dec;
              return (
                <button
                  key={dec}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDecadeClick(dec)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                    isCurrentDecade
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 active:bg-stone-200'
                  }`}
                >
                  &apos;{dec.toString().slice(2)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider interactivo táctil */}
        <div className="w-full flex flex-col gap-1.5 pt-1">
          <input
            type="range"
            min={minYear}
            max={currentYear}
            value={year}
            disabled={disabled}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                onYearChange(Math.max(minYear, Math.min(currentYear, val)));
              }
            }}
            className="w-full cursor-pointer touch-pan-x"
          />
          <div className="flex justify-between text-[11px] text-stone-400 font-mono px-0.5">
            <span>{minYear}</span>
            <span>1980</span>
            <span>2000</span>
            <span>{currentYear}</span>
          </div>
        </div>

        {/* Botón de Confirmación Principal */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            sfx.playClick();
            onConfirm();
          }}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Confirmar Año {year}</span>
        </button>
      </div>
    </div>
  );
}
