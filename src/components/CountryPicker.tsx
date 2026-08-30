'use client';

import React, { useState, useMemo } from 'react';
import { COUNTRIES, getCountryByCode } from '@/lib/countries';
import { Country } from '@/types';
import { Search, ChevronDown, Check } from 'lucide-react';

interface CountryPickerProps {
  selectedCode: string;
  onSelect: (country: Country) => void;
}

export function CountryPicker({ selectedCode, onSelect }: CountryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = useMemo(() => getCountryByCode(selectedCode), [selectedCode]);

  const filtered = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="relative w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
        País de Origen (Bandera)
      </label>

      {/* Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-xs cursor-pointer"
      >
        <div className="flex items-center gap-3 truncate">
          <span className="text-2xl leading-none">{selected.flag}</span>
          <span className="font-semibold text-stone-800 text-sm truncate">{selected.name}</span>
          <span className="text-xs font-mono text-stone-500 bg-stone-200/80 px-1.5 py-0.5 rounded">
            {selected.code}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-purple-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150">
          {/* Search Input */}
          <div className="p-2 border-b border-stone-100 bg-stone-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar país o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-white text-stone-800 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-purple-400 placeholder-stone-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-stone-400">
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 text-purple-800 font-semibold'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-xs text-stone-400 font-mono">({country.code})</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-600" />}
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
