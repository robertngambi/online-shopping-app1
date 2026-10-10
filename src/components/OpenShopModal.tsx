import React, { useState, useRef } from 'react';
import { 
  X, 
  Store, 
  User, 
  Tag, 
  MapPin, 
  Phone, 
  CreditCard, 
  Lock, 
  Check, 
  ShieldCheck, 
  Smartphone,
  AlertCircle,
  FolderOpen,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Shop, User as UserType } from '../types';
import { BUSINESS_CATEGORIES } from '../data/countries';

interface OpenShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onRegisterShop: (shopData: Omit<Shop, 'id' | 'shopNumber' | 'totalSales' | 'commissionPaid' | 'createdAt'>) => void;
}

export const OpenShopModal: React.FC<OpenShopModalProps> = ({
  isOpen,
  onClose,
  user,
  onRegisterShop,
}) => {
  const [ownerName, setOwnerName] = useState(user.fullName || '');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [caption, setCaption] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user.phone || '+260977123456');
  const [mobileProvider, setMobileProvider] = useState<'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo' | 'Bank Transfer'>('Airtel Money');
  const [bankCard, setBankCard] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [confirmSecurityPin, setConfirmSecurityPin] = useState('');
  const [logo, setLogo] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ownerName.trim() || !shopName.trim() || !caption.trim() || !address.trim() || !phone.trim() || !securityPin.trim()) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    if (securityPin.length < 4) {
      setError('Security password/PIN must be at least 4 characters.');
      return;
    }

    if (securityPin !== confirmSecurityPin) {
      setError('Security passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onRegisterShop({
        ownerName: ownerName.trim(),
        shopName: shopName.trim(),
        category,
        caption: caption.trim(),
        address: address.trim(),
        phone: phone.trim(),
        mobileProvider,
        bankCard: bankCard.trim() || undefined,
        securityPin: securityPin.trim(),
        rating: 5.0,
        logo,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                Open Shop
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Owner Name & Shop Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Business / Shop Owner's Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Robert Ngambi"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Business / Shop Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Copperbelt Agro Hardware"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Choose Category Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-neutral-800">
                Choose Category *
              </label>
              <span className="text-[11px] text-amber-700 font-semibold">
                {BUSINESS_CATEGORIES.length} Categories Available
              </span>
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
              <select
                id="open-shop-category-select"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-neutral-50 hover:bg-white border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-hidden font-medium text-neutral-800 transition-all cursor-pointer shadow-2xs"
              >
                <option value="" disabled>-- Select a shop / business category --</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Select the commercial sector that best matches your business products and services.
            </p>
          </div>

          {/* Caption (in few words describing business) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Business Caption (Few words describing the business) *
            </label>
            <textarea
              rows={2}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Quality building materials, high-yield seeds, and industrial tools supplied with fast local delivery."
              className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Physical Address */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Business Physical Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 104, Cairo Road, Lusaka Central"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Phone Number with Mobile Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Merchant Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+260977123456"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Primary Mobile Money Provider *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  value={mobileProvider}
                  onChange={(e) => setMobileProvider(e.target.value as any)}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden font-medium"
                >
                  <option value="Airtel Money">Airtel Money (Zambia)</option>
                  <option value="MTN MoMo">MTN MoMo</option>
                  <option value="Zamtel Kwacha">Zamtel Kwacha</option>
                  <option value="Bank Transfer">Bank Transfer / Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shop Logo / Storefront Photo */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Shop Logo / Storefront Picture *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const res = ev.target?.result as string;
                    if (res) setLogo(res);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-300 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-800 block">Store Logo or Signboard</span>
                  <span className="text-[11px] text-neutral-500">Pick image from your device</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Open files</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bank Credit Card Registration */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Bank Credit / Debit Card Registration (For Payouts)
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={bankCard}
                onChange={(e) => setBankCard(e.target.value)}
                placeholder="Card Number or Bank Account (e.g. Visa ending 4242)"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <span className="text-[10px] text-neutral-400">
              For commercial settlements and automated shop sales disbursements.
            </span>
          </div>

          {/* Security Password for Shop Owner Account */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Shop Security Login Password</span>
            </div>
            <p className="text-[11px] text-amber-800/80">
              Set a security password/PIN. You will be prompted to enter this password every time you access your Shop Management portal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <input
                  type="password"
                  required
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="Set Shop Password *"
                  className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl focus:border-amber-600 focus:outline-hidden"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={confirmSecurityPin}
                  onChange={(e) => setConfirmSecurityPin(e.target.value)}
                  placeholder="Confirm Shop Password *"
                  className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-xl focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Register & Open Shop Account</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
