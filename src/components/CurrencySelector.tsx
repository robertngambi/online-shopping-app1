import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { Country } from '../types';
import { formatPrice } from '../utils/helpers';

interface CurrencySelectorProps {
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
  variant?: 'header' | 'card' | 'inline';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCountry,
  onSelectCountry,
  variant = 'card',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCountry = COUNTRIES.find(
    (c) => c.name.toLowerCase() === (selectedCountry || 'Zambia').toLowerCase()
  ) || COUNTRIES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (c: Country) => {
    onSelectCountry(c.name);
    setIsOpen(false);
    setSearch('');
  };

  // Header compact pill variant
  if (variant === 'header') {
    return (
      <div ref={containerRef} className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer select-none ${
            isOpen
              ? 'bg-amber-100/90 border-amber-500 text-amber-900 shadow-xs'
              : 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-700'
          }`}
          title="Change currency"
        >
          <Globe className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="font-mono">{activeCountry.currency}</span>
          <span className="text-[11px] text-neutral-500">({activeCountry.symbol})</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-700' : 'text-neutral-400'}`} />
        </button>

        {/* Stretched-out Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 max-w-[85vw] bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Search header */}
            <div className="p-2 border-b border-neutral-100 bg-neutral-50 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency or country..."
                className="w-full text-xs bg-transparent border-none focus:outline-hidden text-neutral-800 placeholder-neutral-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
              {filteredCountries.map((c) => {
                const isSelected = activeCountry.name.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{c.name}</span>
                      <span className="font-mono text-[11px] text-neutral-500 font-semibold">
                        {c.currency} ({c.symbol})
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />}
                  </button>
                );
              })}
              {filteredCountries.length === 0 && (
                <div className="p-3 text-center text-xs text-neutral-400">
                  No matching currencies found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Box / Card variant (for Settings / About Me / Modals)
  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Single Select Box that stretches out on click */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
          isOpen
            ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-400/40'
            : 'bg-white hover:bg-neutral-50 border-neutral-300'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-neutral-900">{activeCountry.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-extrabold border border-amber-200">
                {activeCountry.currency} ({activeCountry.symbol})
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5 truncate">
              {activeCountry.name === 'Zambia'
                ? 'Default Base Currency (1 ZMW = K1.00)'
                : `1 ZMW ≈ ${(1 / activeCountry.exchangeRateToZMW).toFixed(2)} ${activeCountry.symbol}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
          <span className="text-xs font-bold text-amber-700 hidden sm:inline">
            {isOpen ? 'Close List' : 'Change Currency'}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-neutral-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-amber-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Stretched Out List container */}
      {isOpen && (
        <div className="mt-2 w-full bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Box */}
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2.5">
            <Search className="w-4 h-4 text-neutral-400 ml-1" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country, currency code or symbol (e.g. USD, Kwacha, Rand, Naira)..."
              className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-neutral-800 placeholder-neutral-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Currency options grid */}
          <div className="max-h-72 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filteredCountries.map((c) => {
              const isSelected = activeCountry.name.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-400/40 font-bold'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{c.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {c.currency} ({c.symbol})
                    </p>
                  </div>
                  {isSelected ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 flex-shrink-0 ml-2" />
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-medium ml-2">
                      1 ZMW = {(1 / c.exchangeRateToZMW).toFixed(2)} {c.symbol}
                    </span>
                  )}
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="col-span-full p-4 text-center text-xs text-neutral-400">
                No matching currencies found. Try searching country name or currency code.
              </div>
            )}
          </div>

          {/* Footer note inside dropdown */}
          <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500 px-4">
            <span>Live preview: K100 ZMW = <strong>{formatPrice(100, activeCountry.name)}</strong></span>
            <span className="text-amber-700 font-medium">Auto-converts all catalogue prices</span>
          </div>
        </div>
      )}
    </div>
  );
};
