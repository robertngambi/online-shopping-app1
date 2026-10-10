import React, { useState, useRef } from 'react';
import { 
  X, 
  Megaphone, 
  PlusCircle, 
  Palette, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  Clock, 
  Smartphone, 
  Check, 
  Trash2, 
  RotateCw, 
  MoreVertical, 
  AlertCircle,
  Eye,
  Sparkles,
  FolderOpen,
  FileText
} from 'lucide-react';
import { Advertisement, AdBgTheme, AdPackageType, User } from '../types';

interface AdvertisementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  ads: Advertisement[];
  onCreateAd: (adData: Omit<Advertisement, 'id' | 'createdAt' | 'expiresAt' | 'views'>) => void;
  onActivateAd: (adId: string, packageType: AdPackageType, packageCost: number, paymentMethod: 'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo') => void;
  onDeleteAd: (adId: string) => void;
  onViewAdProfile: (ad: Advertisement) => void;
}

const BG_COLOR_OPTIONS: { id: AdBgTheme; name: string; bgClass: string; accentClass: string; label: string }[] = [
  { id: 'orange', name: 'Light Orange', bgClass: 'bg-orange-50 border-orange-200 text-orange-950', accentClass: 'bg-orange-600', label: 'Warm & High Energy' },
  { id: 'green', name: 'Light Green', bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-950', accentClass: 'bg-emerald-600', label: 'Fresh & Trustworthy' },
  { id: 'blue', name: 'Light Blue', bgClass: 'bg-sky-50 border-sky-200 text-sky-950', accentClass: 'bg-sky-600', label: 'Corporate & Modern' },
  { id: 'gray', name: 'Light Gray', bgClass: 'bg-slate-100 border-slate-300 text-slate-900', accentClass: 'bg-slate-700', label: 'Minimalist & Solid' },
];

const PACKAGES: { type: AdPackageType; label: string; cost: number; days: number }[] = [
  { type: '1w', label: 'K5 - 1 Week', cost: 5, days: 7 },
  { type: '2w', label: 'K8 - 2 Weeks', cost: 8, days: 14 },
  { type: '1m', label: 'K15 - 1 Month', cost: 15, days: 30 },
  { type: '2m', label: 'K24 - 2 Months', cost: 24, days: 60 },
];

export const AdvertisementsModal: React.FC<AdvertisementsModalProps> = ({
  isOpen,
  onClose,
  user,
  ads,
  onCreateAd,
  onActivateAd,
  onDeleteAd,
  onViewAdProfile,
}) => {
  const [viewMode, setViewMode] = useState<'hub' | 'create'>('hub');
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');

  // Ad Form Fields
  const [bgTheme, setBgTheme] = useState<AdBgTheme>('orange');
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(user.phone || '+260977123456');
  const [email, setEmail] = useState(user.email || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Package & Payment Step
  const [showPackageStep, setShowPackageStep] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AdPackageType>('1w');
  const [paymentProvider, setPaymentProvider] = useState<'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo'>('Airtel Money');
  const [mobileNumberForPay, setMobileNumberForPay] = useState(user.phone || '+260977123456');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmationNote, setConfirmationNote] = useState('');
  const [error, setError] = useState('');

  // Re-activate modal
  const [renewingAd, setRenewingAd] = useState<Advertisement | null>(null);

  if (!isOpen) return null;

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const activeAds = ads.filter(a => a.status === 'active' && a.expiresAt > Date.now());
  const expiredAds = ads.filter(a => a.status === 'expired' || a.expiresAt <= Date.now());

  const handleStartCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !mediaUrl.trim() || !description.trim() || !phone.trim()) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    if (wordCount > 250) {
      setError('Description must be less than 250 words.');
      return;
    }

    setShowPackageStep(true);
  };

  const handleConfirmAdCreation = () => {
    const pkg = PACKAGES.find(p => p.type === selectedPackage) || PACKAGES[0];
    setIsProcessingPayment(true);
    setError('');

    setTimeout(() => {
      onCreateAd({
        title: title.trim(),
        creatorId: user.id,
        creatorName: user.fullName,
        bgTheme,
        mediaUrl,
        mediaType,
        description: description.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        packageType: pkg.type,
        packageCost: pkg.cost,
        packageLabel: pkg.label,
        paymentMethod: paymentProvider,
        status: 'active',
      });

      setIsProcessingPayment(false);
      setConfirmationNote(`Advertisement successfully activated! Paid K${pkg.cost} ZMW to Eastern Online Store Admin Account via ${paymentProvider}.`);
      
      // Reset form
      setTimeout(() => {
        setConfirmationNote('');
        setShowPackageStep(false);
        setViewMode('hub');
        setTitle('');
        setDescription('');
      }, 2500);
    }, 1200);
  };

  const handleRenewSubmit = () => {
    if (!renewingAd) return;
    const pkg = PACKAGES.find(p => p.type === selectedPackage) || PACKAGES[0];
    setIsProcessingPayment(true);

    setTimeout(() => {
      onActivateAd(renewingAd.id, pkg.type, pkg.cost, paymentProvider);
      setIsProcessingPayment(false);
      setRenewingAd(null);
      setConfirmationNote(`Ad "${renewingAd.title}" renewed for ${pkg.label}!`);
      setTimeout(() => setConfirmationNote(''), 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Advertisements</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle Bar */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-5 pt-2">
          <button
            onClick={() => {
              setViewMode('hub');
              setShowPackageStep(false);
            }}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              viewMode === 'hub' ? 'border-amber-600 text-amber-800' : 'border-transparent text-neutral-500'
            }`}
          >
            Browse Ads ({ads.length})
          </button>
          <button
            onClick={() => setViewMode('create')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              viewMode === 'create' ? 'border-amber-600 text-amber-800' : 'border-transparent text-neutral-500'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Advertisement</span>
          </button>
        </div>

        {/* Confirmation Banner */}
        {confirmationNote && (
          <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{confirmationNote}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* VIEW: BROWSE ADS HUB */}
          {viewMode === 'hub' && (
            <div>
              {/* Active / Expired Filter Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'active'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Active Ads ({activeAds.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('expired')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'expired'
                        ? 'bg-neutral-800 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Expired Ads ({expiredAds.length})
                  </button>
                </div>

                <button
                  onClick={() => setViewMode('create')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  + Create Ad (From K5)
                </button>
              </div>

              {/* Ads List */}
              <div className="space-y-3">
                {(activeTab === 'active' ? activeAds : expiredAds).length === 0 ? (
                  <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
                    <Megaphone className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs text-neutral-500">No {activeTab} advertisements found.</p>
                  </div>
                ) : (
                  (activeTab === 'active' ? activeAds : expiredAds).map((ad) => {
                    const bgStyle = BG_COLOR_OPTIONS.find(b => b.id === ad.bgTheme) || BG_COLOR_OPTIONS[0];
                    const isAdExpired = ad.expiresAt <= Date.now();

                    return (
                      <div
                        key={ad.id}
                        className={`p-3.5 rounded-2xl border relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${bgStyle.bgClass}`}
                      >
                        {/* Decorative background shape */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-15 pointer-events-none bg-current" />

                        <div className="flex items-center gap-3 relative z-10">
                          <img
                            src={ad.mediaUrl}
                            alt={ad.title}
                            className="w-16 h-16 rounded-xl object-cover border border-white/60 shadow-xs flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.2 rounded-full bg-white/70 shadow-2xs">
                                {ad.packageLabel}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-medium">
                                By {ad.creatorName}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold mt-1 text-neutral-900 line-clamp-1">{ad.title}</h4>
                            <p className="text-xs text-neutral-600 line-clamp-2 max-w-md mt-0.5">
                              {ad.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 relative z-10 self-end sm:self-center">
                          <button
                            onClick={() => onViewAdProfile(ad)}
                            className="px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold rounded-xl border border-neutral-300 shadow-2xs flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          {isAdExpired ? (
                            <button
                              onClick={() => setRenewingAd(ad)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>Activate Ad</span>
                            </button>
                          ) : null}

                          <button
                            onClick={() => {
                              if (confirm(`Delete ad "${ad.title}"?`)) {
                                onDeleteAd(ad.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete ad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW: CREATE AD STEP 1 & STEP 2 (PACKAGES) */}
          {viewMode === 'create' && !showPackageStep && (
            <form onSubmit={handleStartCreateAd} className="space-y-4">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Requirement: 'choose background' with Orange, Green, Blue, Gray with attractive light deep colored geometric objects */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Choose Ad Background Color (Light Tone with Decorative Accents) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BG_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBgTheme(opt.id)}
                      className={`p-3 rounded-2xl border-2 text-left relative overflow-hidden transition-all ${opt.bgClass} ${
                        bgTheme === opt.id ? 'ring-2 ring-amber-600 border-amber-600 shadow-sm' : 'border-neutral-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Geometric round object decorative accent */}
                      <div className={`absolute -right-3 -bottom-3 w-10 h-10 rounded-full opacity-30 ${opt.accentClass}`} />
                      <div className="relative z-10">
                        <div className="text-xs font-bold">{opt.name}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{opt.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title of Business / Product */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Add Title (Business or Product to Advertise) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Copperbelt Refrigerated Produce Transport"
                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Media File Upload (PNG, JPG, BIM, GIF or short video <=30s) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700">
                    Picture or File Attachment (.PNG, .JPG, .BIM, .GIF or video ≤30s) *
                  </label>
                  <span className="text-[10px] text-neutral-400">Silent auto-loop preview</span>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.bim,.gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const isVideo = file.type.startsWith('video/');
                      setMediaType(isVideo ? 'video' : 'image');
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        if (result) setMediaUrl(result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {/* Device File Browser Box with Open files button */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50/80 flex flex-col sm:flex-row items-center gap-4 mb-2">
                  {mediaUrl ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-neutral-300 bg-black flex-shrink-0">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                      ) : (
                        <img src={mediaUrl} alt="Ad media preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMediaUrl('')}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs text-[10px]"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-neutral-200 border border-neutral-300 flex flex-col items-center justify-center text-neutral-400 flex-shrink-0">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[9px]">No File</span>
                    </div>
                  )}

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <p className="text-xs font-bold text-neutral-800">
                      {mediaUrl ? 'Attachment Selected' : 'Choose Ad Image or File from Device'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Select high-res photos, graphics, BIM banners, animated GIFs, or clip from your device.
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open files</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-300 shadow-2xs flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{mediaUrl ? 'Replace File' : 'Browse Device'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Or paste external media URL (.png, .jpg, .gif, video link)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="px-2 py-1.5 text-xs bg-neutral-100 border border-neutral-300 rounded-xl font-medium"
                  >
                    <option value="image">Image/GIF</option>
                    <option value="video">Short Video</option>
                  </select>
                </div>
              </div>

              {/* Description (<250 words) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700">
                    Business / Service Offering Details *
                  </label>
                  <span className={`text-[11px] font-bold ${wordCount > 250 ? 'text-red-600' : 'text-neutral-400'}`}>
                    {wordCount}/250 words
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain your services, regional delivery coverage, rates, and special customer guarantees..."
                  className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Contact Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Contact Phone Number (Required for Direct Call Button) *
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
                    Contact Email (Optional for Direct Email Button)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="business@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Continue to Choose Package */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue: Choose Package & Pay</span>
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* VIEW: STEP 2 CHOOSE PACKAGE & MOBILE MONEY PAYMENT */}
          {viewMode === 'create' && showPackageStep && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="text-sm font-bold text-neutral-900">
                  Select Advertisement Duration Package
                </h3>
                <button
                  onClick={() => setShowPackageStep(false)}
                  className="text-xs text-neutral-500 hover:underline"
                >
                  ← Edit Ad Details
                </button>
              </div>

              {/* Package Options: K5 (1 week), K8 (2 weeks), K15 (1 Month), K24 (2 Months) */}
              <div className="grid grid-cols-2 gap-2.5">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.type}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.type)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedPackage === pkg.type
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-400/40'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-neutral-900">{pkg.label.split(' - ')[0]}</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        {pkg.days} Days
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-600 mt-1">
                      {pkg.label.split(' - ')[1]} Duration
                    </div>
                  </button>
                ))}
              </div>

              {/* Mobile Money Payment to App Admin Account */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">
                    Real-time Mobile Money Payment to App Admin Account
                  </span>
                  <span className="text-xs font-extrabold text-amber-700">
                    {PACKAGES.find(p => p.type === selectedPackage)?.label.split(' - ')[0]} ZMW
                  </span>
                </div>

                {/* Mobile provider options: Airtel, Zamtel, Momo */}
                <div className="grid grid-cols-3 gap-2">
                  {(['Airtel Money', 'MTN MoMo', 'Zamtel Kwacha'] as const).map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setPaymentProvider(provider)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        paymentProvider === provider
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    value={mobileNumberForPay}
                    onChange={(e) => setMobileNumberForPay(e.target.value)}
                    placeholder="Enter payer phone number"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmAdCreation}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isProcessingPayment ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Pay {PACKAGES.find(p => p.type === selectedPackage)?.label.split(' - ')[0]} ZMW</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* RENEW MODAL IF ACTIVATING EXPIRED AD */}
          {renewingAd && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-900">
                  Re-activate "{renewingAd.title}"
                </h4>
                <button onClick={() => setRenewingAd(null)} className="text-neutral-400 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.type}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.type)}
                    className={`p-2 rounded-xl border text-xs font-bold ${
                      selectedPackage === pkg.type ? 'bg-amber-600 text-white' : 'bg-white text-neutral-700'
                    }`}
                  >
                    {pkg.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRenewSubmit}
                disabled={isProcessingPayment}
                className="w-full py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {isProcessingPayment ? 'Processing...' : 'Confirm Re-activation'}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
