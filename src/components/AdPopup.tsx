import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, VolumeX } from 'lucide-react';
import { Advertisement, AdBgTheme } from '../types';

interface AdPopupProps {
  ad: Advertisement | null;
  onClose: () => void;
  onOpenForMore: (ad: Advertisement) => void;
}

const THEME_STYLES: Record<AdBgTheme, { bg: string; border: string; accent: string; deepPill: string; text: string }> = {
  orange: { 
    bg: 'bg-orange-50/95', 
    border: 'border-orange-300', 
    accent: 'bg-orange-600', 
    deepPill: 'bg-orange-900 hover:bg-orange-950',
    text: 'text-orange-950'
  },
  green: { 
    bg: 'bg-emerald-50/95', 
    border: 'border-emerald-300', 
    accent: 'bg-emerald-600', 
    deepPill: 'bg-emerald-900 hover:bg-emerald-950',
    text: 'text-emerald-950'
  },
  blue: { 
    bg: 'bg-sky-50/95', 
    border: 'border-sky-300', 
    accent: 'bg-sky-600', 
    deepPill: 'bg-sky-900 hover:bg-sky-950',
    text: 'text-sky-950'
  },
  gray: { 
    bg: 'bg-slate-100/95', 
    border: 'border-slate-300', 
    accent: 'bg-slate-700', 
    deepPill: 'bg-slate-900 hover:bg-black',
    text: 'text-slate-950'
  },
};

export const AdPopup: React.FC<AdPopupProps> = ({
  ad,
  onClose,
  onOpenForMore,
}) => {
  // Requirement: Exit button should be disabled for 3 seconds, then become active
  const [countdown, setCountdown] = useState(3);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!ad) return;
    setCountdown(3);
    setCanClose(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ad]);

  if (!ad) return null;

  const style = THEME_STYLES[ad.bgTheme] || THEME_STYLES.orange;

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 z-50 max-w-xs sm:max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Small sized, round-edged ad container */}
      <div className={`relative ${style.bg} backdrop-blur-md rounded-3xl p-3.5 shadow-2xl border-2 ${style.border} overflow-hidden`}>
        
        {/* Attractive light deep colored round geometric decorative objects */}
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-25 pointer-events-none ${style.accent}`} />
        <div className={`absolute -left-3 -bottom-3 w-16 h-16 rounded-full opacity-20 pointer-events-none ${style.accent}`} />

        {/* Top Header with Disabled-for-3s Exit 'X' Button */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 text-neutral-800 shadow-2xs">
              Sponsored Ad
            </span>
          </div>

          {/* Requirement: Top-right X button disabled for 3s, then becomes active */}
          <button
            id="ad-popup-close-btn"
            disabled={!canClose}
            onClick={onClose}
            title={canClose ? 'Close Ad' : `Close available in ${countdown}s`}
            className={`p-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
              canClose
                ? 'bg-white text-neutral-800 hover:bg-neutral-200 shadow-xs cursor-pointer'
                : 'bg-black/10 text-neutral-500 cursor-not-allowed opacity-70'
            }`}
          >
            {canClose ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <span className="text-[10px] font-mono w-4 h-4 flex items-center justify-center">{countdown}s</span>
            )}
          </button>
        </div>

        {/* Main Display: media playing repeatedly without sound or high-res photo */}
        <div 
          onClick={() => onOpenForMore(ad)}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/10 shadow-xs border border-white/80 cursor-pointer group"
        >
          {ad.mediaType === 'video' ? (
            <video
              src={ad.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <img
              src={ad.mediaUrl}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Soundless indicator if video */}
          {ad.mediaType === 'video' && (
            <span className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white text-[9px]">
              <VolumeX className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Ad Title & Snippet */}
        <div className="mt-2.5 relative z-10">
          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1 leading-tight">
            {ad.title}
          </h4>
          <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5">
            {ad.description}
          </p>
        </div>

        {/* Requirement: 'For More' button in much deep color of same background, white border, (100%) rounded edges */}
        <div className="mt-3 relative z-10">
          <button
            id="ad-for-more-btn"
            onClick={() => onOpenForMore(ad)}
            className={`w-full py-2 px-4 ${style.deepPill} text-white text-xs font-bold rounded-full border-2 border-white shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-98`}
          >
            <span>For More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
