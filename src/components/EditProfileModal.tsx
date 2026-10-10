import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Lock, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  FolderOpen,
  Upload,
  Camera,
  Trash2
} from 'lucide-react';
import { User as UserType } from '../types';
import { COUNTRIES } from '../data/countries';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onSaveProfile: (updated: Partial<UserType>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [country, setCountry] = useState(user.country);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [password, setPassword] = useState(user.password || '123456');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local device file browsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (.png, .jpg, .jpeg, .webp, etc.).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        setCustomAvatarUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    onSaveProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, '_'),
      phone: phone.trim(),
      email: email.trim(),
      country,
      avatar: customAvatarUrl.trim() || avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      password,
    });

    onClose();
  };

  const hasAvatarPicture = Boolean(avatar && avatar.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 to-amber-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Profile</h2>
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

          {/* Profile Picture Device File Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Profile Picture
            </label>

            {/* Hidden native device file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center gap-4 ${
                isDragging 
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400' 
                  : 'border-dashed border-neutral-300 bg-neutral-50/80 hover:bg-neutral-50'
              }`}
            >
              {/* Avatar Preview */}
              <div className="relative flex-shrink-0">
                {hasAvatarPicture ? (
                  <div className="relative group">
                    <img
                      src={avatar}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md ring-2 ring-amber-100"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xs transition-transform active:scale-90"
                      title="Remove profile picture"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-200 border-2 border-neutral-300 flex flex-col items-center justify-center text-neutral-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Action Buttons: Open files & Choose/Change profile picture */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">
                    {hasAvatarPicture ? 'Custom Profile Picture Loaded' : 'No Profile Picture Selected'}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Browse files from your phone, tablet, or computer to upload any photo or graphic.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {/* Primary Button: 'Choose profile picture' if no picture, or 'Change profile picture' if picture exists */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{hasAvatarPicture ? 'Change profile picture' : 'Choose profile picture'}</span>
                  </button>

                  {/* Open Files Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-300 shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Open files</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Image URL fallback */}
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value);
                  if (e.target.value.trim()) {
                    setAvatar(e.target.value.trim());
                  }
                }}
                placeholder="Or paste external image web link (https://...)..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Select Country & Region *
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl font-medium"
            >
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Security Password */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Security Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
