'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES, getCountryByCode } from '@/lib/countries';
import { Country } from '@/types';
import { Search, ChevronDown, Check } from 'lucide-react';

interface CountryPickerProps {
  selectedCode: string;
  onSelect: (country: Country) => void;
}

const AUTO_COUNTRY: Country = { code: 'AUTO', name: 'Automático (Detectar)', flag: '🌍' };

export function CountryPicker({ selectedCode, onSelect }: CountryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(() => {
    if (selectedCode === 'AUTO') return AUTO_COUNTRY;
    return getCountryByCode(selectedCode);
  }, [selectedCode]);

  const filtered = useMemo(() => {
    let list = COUNTRIES;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
    }
    return [AUTO_COUNTRY, ...list];
  }, [search]);

  return (
    <div className="relative w-full">
      <input type="hidden" name="country_code" value={selected.code} />
      <label className="block text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
        Ubicación (País)
      </label>

      {/* Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-black text-emerald-400 font-mono rounded-xl border border-emerald-900/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm shadow-[inset_0_0_10px_rgba(16,185,129,0.1)] cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3 truncate">
          <span className="text-2xl leading-none">{selected.flag}</span>
          <span className="font-semibold truncate">{selected.name}</span>
          <span className="text-[10px] bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/50">
            {selected.code}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-emerald-600 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-stone-950 border border-emerald-900/50 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden animate-in fade-in duration-150">
          {/* Search Input */}
          <div className="p-2 border-b border-emerald-900/30 bg-black/50">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar país o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-black text-emerald-400 font-mono text-xs rounded-xl border border-emerald-900/30 focus:outline-none focus:border-emerald-500/50 placeholder-emerald-900/50"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-emerald-800 font-mono">
                No se encontraron países
              </div>
            ) : (
              filtered.map((country) => {
                const isSelected = country.code === selected.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onSelect(country);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/50'
                        : 'hover:bg-emerald-950/30 text-stone-400 hover:text-emerald-400 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-[10px] opacity-50">({country.code})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
