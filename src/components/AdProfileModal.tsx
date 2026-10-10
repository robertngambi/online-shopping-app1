import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  ExternalLink, 
  Megaphone, 
  ShieldCheck, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { Advertisement, AdBgTheme } from '../types';

interface AdProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Advertisement | null;
}

const THEME_STYLES: Record<AdBgTheme, { bg: string; border: string; accent: string; deepPill: string }> = {
  orange: { bg: 'bg-[#FFF7ED]', border: 'border-orange-200', accent: 'bg-orange-600', deepPill: 'bg-orange-800' },
  green: { bg: 'bg-[#F0FDF4]', border: 'border-emerald-200', accent: 'bg-emerald-600', deepPill: 'bg-emerald-800' },
  blue: { bg: 'bg-[#F0F9FF]', border: 'border-sky-200', accent: 'bg-sky-600', deepPill: 'bg-sky-800' },
  gray: { bg: 'bg-[#F8FAFC]', border: 'border-slate-300', accent: 'bg-slate-700', deepPill: 'bg-slate-900' },
};

export const AdProfileModal: React.FC<AdProfileModalProps> = ({
  isOpen,
  onClose,
  ad,
}) => {
  if (!isOpen || !ad) return null;

  const style = THEME_STYLES[ad.bgTheme] || THEME_STYLES.orange;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg ${style.bg} rounded-3xl shadow-2xl border ${style.border} overflow-hidden my-auto max-h-[92vh] flex flex-col`}>
        
        {/* Decorative background geometric shapes */}
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 pointer-events-none ${style.accent}`} />
        <div className={`absolute -left-10 -bottom-10 w-40 h-40 rounded-full opacity-15 pointer-events-none ${style.accent}`} />

        {/* Top Exit 'X' Button on Top Right */}
        <div className="p-4 flex items-center justify-between relative z-10 border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 text-neutral-800 shadow-2xs border border-black/5">
              Business Ad Profile
            </span>
          </div>
          <button
            id="ad-profile-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ad Media Display */}
        <div className="p-4 sm:p-6 overflow-y-auto relative z-10 space-y-4">
          
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/10 shadow-sm border border-white/60">
            {ad.mediaType === 'video' ? (
              <video
                src={ad.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-[#1C1C1C] leading-snug">
              {ad.title}
            </h2>
            <p className="text-xs text-[#4A4A4A] font-medium mt-0.5">
              Promoted by <strong>{ad.creatorName}</strong> • {ad.packageLabel}
            </p>
          </div>

          {/* Business details in dull black as requested */}
          <div className="p-3.5 bg-white/80 rounded-2xl border border-black/5">
            <h4 className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider mb-1.5">
              About Business / Services Offered
            </h4>
            <p className="text-sm text-[#242424] leading-relaxed whitespace-pre-line">
              {ad.description}
            </p>
          </div>

          {/* Active Contact Buttons: Phone & Email in Bold */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wider">
              Direct Contact Channels
            </div>

            {/* Direct Phone Call Button */}
            <a
              id="ad-profile-call-btn"
              href={`tel:${ad.phone}`}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-50 text-[#1A1A1A] font-bold text-sm rounded-2xl border border-black/10 shadow-xs flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${style.accent}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-[#555] block">Direct Phone Call / SMS:</span>
                  <strong className="text-sm text-[#111]">{ad.phone}</strong>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
            </a>

            {/* Direct Email Sending Button (if available) */}
            {ad.email && (
              <a
                id="ad-profile-email-btn"
                href={`mailto:${ad.email}?subject=Inquiry%20via%20Eastern%20Online%20Store%20Ad:%20${encodeURIComponent(ad.title)}`}
                className="w-full py-3 px-4 bg-white hover:bg-neutral-50 text-[#1A1A1A] font-bold text-sm rounded-2xl border border-black/10 shadow-xs flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800 text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#555] block">Direct Email Inquiry:</span>
                    <strong className="text-sm text-[#111]">{ad.email}</strong>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              </a>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
