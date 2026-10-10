import React from 'react';
import { X, Palette, Check, Sparkles } from 'lucide-react';
import { AppTheme } from '../types';

interface AppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

interface ThemeOption {
  id: AppTheme;
  name: string;
  subtitle: string;
  headerGradient: string;
  buttonBg: string;
  badgeBg: string;
  previewClass: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'brown',
    name: 'Warm Brown (Default)',
    subtitle: 'Rich Zambian Earth, Amber & Warm Gold',
    headerGradient: 'from-amber-700 via-amber-800 to-yellow-900',
    buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    previewClass: 'bg-amber-50 border-amber-300 ring-amber-500',
  },
  {
    id: 'green',
    name: 'Emerald Green',
    subtitle: 'Lush Agriculture, Forest & Fresh Produce',
    headerGradient: 'from-emerald-700 via-emerald-800 to-teal-900',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    previewClass: 'bg-emerald-50 border-emerald-300 ring-emerald-500',
  },
  {
    id: 'blue',
    name: 'Zambezi Blue',
    subtitle: 'Victoria Falls River Water & Modern Tech',
    headerGradient: 'from-blue-700 via-blue-800 to-indigo-900',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    previewClass: 'bg-sky-50 border-blue-300 ring-blue-500',
  },
  {
    id: 'slate',
    name: 'Kopala Slate',
    subtitle: 'Industrial Mineral, Charcoal & Modern Steel',
    headerGradient: 'from-slate-700 via-slate-800 to-zinc-900',
    buttonBg: 'bg-slate-700 hover:bg-slate-800 text-white',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-400',
    previewClass: 'bg-slate-100 border-slate-300 ring-slate-600',
  },
];

export const AppearanceModal: React.FC<AppearanceModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 to-yellow-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Appearance</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes list */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? `${theme.previewClass} ring-2 shadow-xs`
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.headerGradient} shadow-xs flex items-center justify-center text-white`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{theme.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-white text-neutral-800 shadow-2xs border border-black/5">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{theme.subtitle}</p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-neutral-300'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
