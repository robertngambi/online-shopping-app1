import React from 'react';
import { 
  X, 
  Info, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Megaphone, 
  DollarSign, 
  FileText,
  Lock,
  Smartphone
} from 'lucide-react';

interface AboutAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">About Eastern Online Store</h2>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-neutral-800 leading-relaxed text-xs sm:text-sm">
          
          {/* Section 1: How the App Works */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>1. How Eastern Online Store Works</span>
            </h3>
            <p className="text-neutral-600">
              Eastern Online Store connects individual shoppers and commercial enterprises across Zambia and the broader Southern/Eastern Africa region. All users subscribe upon initial launch to unlock full multi-vendor browsing, direct live encrypted merchant messaging, real-time promotional countdowns, and mobile money checkout.
            </p>
          </div>

          {/* Section 2: Shop Creation & Operation Guide */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600" />
              <span>2. Creating & Operating a Digital Shop</span>
            </h3>
            <p className="text-neutral-600">
              Any subscriber can register as a verified merchant by tapping <strong>"Open Shop"</strong>. You specify your business name, trade category (Groceries, Fashion, Hardware, Agriculture, Tech, Crafts), physical storefront location, mobile money settlement account, and a 4-digit Security Password.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Add Products:</strong> Upload 1 primary caption photo and up to 4 high-resolution gallery photos per item.</li>
              <li><strong>Editable by Owner Only:</strong> Access is protected behind your encrypted merchant PIN.</li>
              <li><strong>Discount Promotions:</strong> Apply flash sales with live per-second countdown timers that auto-broadcast to all active subscribers.</li>
            </ul>
          </div>

          {/* Section 3: Commission & App Maintenance Policy */}
          <div className="space-y-2 p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <span>3. Platform Maintenance Fee & 3.0% Commission</span>
            </h3>
            <p className="text-neutral-700 text-xs">
              To guarantee high server uptime, mobile network SMS dispatch, and verified security, every merchant sale exceeding <strong>K200 ZMW</strong> incurs a <strong>3.0% maintenance deduction</strong> routed to the Eastern Online Store platform administration. An automated payout notification is sent to the shop owner upon order confirmation.
            </p>
          </div>

          {/* Section 4: Advertisements Hub Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>4. Business Advertising Hub & Packages</span>
            </h3>
            <p className="text-neutral-600">
              Any business (with or without a physical shop) can promote their services via the Advertisements Hub. Choose light aesthetic backgrounds (Orange, Green, Blue, Gray) with geometric accents, upload media or 30-second video loops, and select affordable packages:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-bold text-xs pt-1">
              <div className="p-2 bg-neutral-100 rounded-xl">K5 (1 Week)</div>
              <div className="p-2 bg-neutral-100 rounded-xl">K8 (2 Weeks)</div>
              <div className="p-2 bg-neutral-100 rounded-xl">K15 (1 Month)</div>
              <div className="p-2 bg-neutral-100 rounded-xl">K24 (2 Months)</div>
            </div>
          </div>

          {/* Section 5: Company Rules & Regulations */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>5. Company Rules, Regulations & Consumer Rights</span>
            </h3>
            <p className="text-neutral-600">
              All merchants must guarantee authentic product quality and provide immediate delivery contact. Misleading listings, fraudulent mobile money requests, or unauthorized goods will result in immediate shop de-indexing and blacklist verification.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-200 text-center text-neutral-400 text-xs">
            © 2026 Eastern Online Store Platform Inc. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  );
};
