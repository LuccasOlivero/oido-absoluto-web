'use client';

import React from 'react';
import { X, Award } from 'lucide-react';
import { sfx } from '@/lib/audio-engine';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col gap-4 sm:gap-5 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">¿Cómo Jugar?</h2>
            <p className="text-xs text-stone-500">Reglas básicas y sistema de puntos</p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-600">
          {/* Step 1 */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-bold text-stone-900 text-xs mb-0.5">Escucha el fragmento</p>
              <p className="text-stone-500 text-xs">
                Se reproducirá un corte cortísimo de una canción. Puedes oírlo cuantas veces quieras.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <div className="w-full">
              <p className="font-bold text-stone-900 text-xs mb-1">Puntos por duración</p>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                <div className="bg-amber-50 p-1.5 rounded-xl border border-amber-200 text-center">
                  <span className="block font-bold text-amber-900 text-xs">1.0s</span>
                  <span className="text-[9px] text-amber-700 font-semibold">1,000 pts</span>
                </div>
                <div className="bg-purple-50 p-1.5 rounded-xl border border-purple-200 text-center">
                  <span className="block font-bold text-purple-900 text-xs">3.0s</span>
                  <span className="text-[9px] text-purple-700 font-semibold">600 pts</span>
                </div>
                <div className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-200 text-center">
                  <span className="block font-bold text-emerald-900 text-xs">5.0s</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">300 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="font-bold text-stone-900 text-xs mb-0.5">Precisión del Año y Vidas</p>
              <p className="text-stone-500 text-xs leading-relaxed">
                • <strong>Año Exacto:</strong> 100% de puntos + <strong>Bonus +500 pts</strong>.<br />
                • <strong>±1 a 5 años:</strong> Puntuación por cercanía.<br />
                • <strong>Más de 5 años:</strong> 0 puntos y pierdes <strong>1 vida ❤️</strong>.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sfx.playClick();
            onClose();
          }}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-colors text-xs sm:text-sm shadow-xs active:scale-98 cursor-pointer"
        >
          ¡A Jugar!
        </button>
      </div>
    </div>
  );
}
