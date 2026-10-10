import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Globe, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Check, 
  Sparkles,
  Camera,
  AlertCircle
} from 'lucide-react';
import { User as UserType, Country } from '../types';
import { COUNTRIES } from '../data/countries';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSaveUser: (userData: Partial<UserType>) => void;
  currentUser?: UserType;
  isInitialRequired?: boolean;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
];

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  onSaveUser,
  currentUser,
  isInitialRequired = false,
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [selectedCountryName, setSelectedCountryName] = useState(currentUser?.country || 'Zambia');
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected country config (defaults to Zambia)
  const currentCountry = COUNTRIES.find(c => c.name === selectedCountryName) || COUNTRIES[0];

  useEffect(() => {
    if (currentUser?.phone) {
      const dial = currentCountry.dialCode;
      if (currentUser.phone.startsWith(dial)) {
        setPhoneWithoutCode(currentUser.phone.substring(dial.length));
      } else {
        setPhoneWithoutCode(currentUser.phone);
      }
    }
  }, [currentUser, currentCountry]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !email.trim() || !phoneWithoutCode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!currentUser && !password) {
      setError('Please set a secure password for your account.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fullPhone = `${currentCountry.dialCode}${phoneWithoutCode.replace(/^[0+]/, '')}`;
      onSaveUser({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        email: email.trim(),
        country: selectedCountryName,
        phone: fullPhone,
        avatar,
      });
      setIsSubmitting(false);
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {currentUser ? 'Edit Profile' : 'Subscribe'}
              </h2>
            </div>
          </div>

          {!isInitialRequired && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Picture Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
              Choose Profile Picture
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-600 ring-2 ring-amber-400/40 flex-shrink-0">
                <img src={avatar} alt="Current Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(imgUrl)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatar === imgUrl ? 'border-amber-600 ring-2 ring-amber-400' : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Avatar ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="sub-fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Robert Ngambi"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                User Name (Appear as) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-semibold">@</span>
                <input
                  id="sub-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="robert_ngambi"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="sub-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="robertngambi303@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Country Selection (Default Zambia) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Country (Updates Currency & Dial Code API) *
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
              <select
                id="sub-country-select"
                value={selectedCountryName}
                onChange={(e) => setSelectedCountryName(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden font-medium"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.dialCode} • {c.currency} {c.symbol}) {c.code === 'ZM' ? '★ Default' : ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1 font-medium">
              Currency set to <strong>{currentCountry.currency} ({currentCountry.symbol})</strong> with live exchange rate synchronization.
            </p>
          </div>

          {/* Phone Number with auto Country Code */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Phone Number (with Mobile Account) *
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 text-sm font-bold rounded-xl flex-shrink-0">
                {currentCountry.dialCode}
              </span>
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="sub-phone-input"
                  type="tel"
                  required
                  value={phoneWithoutCode}
                  onChange={(e) => setPhoneWithoutCode(e.target.value)}
                  placeholder="977123456"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
            <span className="text-[10px] text-neutral-400">
              Compatible with Airtel Money, Zamtel Kwacha & MTN MoMo.
            </span>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {currentUser ? 'New Password (Optional)' : 'Set Password *'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="sub-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Confirm Password {password ? '*' : ''}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="sub-confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              id="sub-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{currentUser ? 'Save Profile Changes' : 'Complete Subscription & Open Profile'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
