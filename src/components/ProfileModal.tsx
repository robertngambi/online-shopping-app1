import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CreditCard, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Edit3
} from 'lucide-react';
import { User as UserType, CreditCard as CardType } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  selectedCountry: string;
  onOpenEditProfile: () => void;
  onOpenMyShop: () => void;
  onOpenOpenShop: () => void;
  onDeletePreviousShopping?: (id: string) => void;
  onDeleteCard: (cardId: string) => void;
  onAddCard: (card: Omit<CardType, 'id'>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedCountry,
  onOpenEditProfile,
  onOpenMyShop,
  onOpenOpenShop,
  onDeleteCard,
  onAddCard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cards'>('overview');
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user.fullName.toUpperCase());
  const [expiry, setExpiry] = useState('');
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'American Express'>('Visa');

  if (!isOpen) return null;

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim() || !expiry.trim()) return;

    if (user.savedCards.length >= 5) {
      alert('Maximum of 5 bank cards allowed.');
      return;
    }

    const masked = `•••• •••• •••• ${cardNumber.replace(/\s+/g, '').slice(-4) || '1234'}`;
    onAddCard({
      cardNumber: masked,
      cardHolder: cardHolder.trim().toUpperCase(),
      expiry: expiry.trim(),
      cardType,
    });

    setCardNumber('');
    setExpiry('');
    setShowAddCardForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Header Card */}
        <div className="p-6 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-300 shadow-md"
                referrerPolicy="no-referrer"
              />
              {user.isShopOwner && (
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-[10px] font-bold shadow-xs">
                  <Store className="w-3 h-3" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
                {user.isShopOwner && (
                  <span className="text-[10px] bg-amber-400/30 text-amber-200 border border-amber-300/40 px-2 py-0.5 rounded-full font-bold">
                    Shop Owner
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200">
                @{user.username} • {user.country}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-amber-100/90 mt-1">
                <span>{user.phone}</span>
                <span>•</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2">
            <button
              id="profile-edit-btn"
              onClick={onOpenEditProfile}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            {user.isShopOwner ? (
              <button
                id="profile-my-shop-btn"
                onClick={() => {
                  onClose();
                  onOpenMyShop();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>My Shop</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenOpenShop();
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Shop</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-amber-600 text-amber-800' : 'border-transparent text-neutral-500'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cards' ? 'border-amber-600 text-amber-800' : 'border-transparent text-neutral-500'
            }`}
          >
            Saved Bank Cards ({user.savedCards?.length || 0}/5)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Country & Currency</span>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.country}</p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Account Status</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Active Subscriber</span>
                  </p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Member Since</span>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">{user.createdAt}</p>
                </div>
              </div>

              {/* Merchant / Open Shop Card */}
              {!user.isShopOwner ? (
                <div className="p-4 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-200">
                      <Store className="w-3.5 h-3.5" />
                      <span>Merchant Registration</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">Open Your Shop on Eastern Store</h4>
                    <p className="text-xs text-amber-100/90 mt-0.5">Sell products, upload up to 5 photos, and run countdown deals.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOpenShop();
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 flex-shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Open Shop</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Store className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">Merchant Portal Access</h4>
                      <p className="text-[11px] text-amber-800/80">Manage products, PIN security, analytics, and discount deals.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMyShop();
                    }}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>My Shop Portal</span>
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Update Regional Settings or Password</h4>
                  <p className="text-[11px] text-neutral-500">Change your currency preference, phone number, and avatar.</p>
                </div>
                <button
                  onClick={onOpenEditProfile}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB: SAVED BANK CARDS (UP TO 5, EDITABLE & DELETABLE) */}
          {activeTab === 'cards' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Registered Bank Credit / Debit Cards ({user.savedCards?.length || 0}/5)
                </span>
                {(!user.savedCards || user.savedCards.length < 5) && !showAddCardForm && (
                  <button
                    onClick={() => setShowAddCardForm(true)}
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Bank Card</span>
                  </button>
                )}
              </div>

              {/* Add Card Form */}
              {showAddCardForm && (
                <form onSubmit={handleCreateCard} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-300 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-800">Add New Bank Card</h4>
                    <button type="button" onClick={() => setShowAddCardForm(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Card Number (16 digits)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Cardholder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl uppercase"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Expiry (MM/YY)"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCardForm(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              )}

              {/* Cards List */}
              <div className="space-y-2">
                {(!user.savedCards || user.savedCards.length === 0) ? (
                  <p className="text-xs text-neutral-400 py-4 text-center">No bank cards registered yet.</p>
                ) : (
                  user.savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-neutral-100 text-neutral-700">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-xs text-neutral-900 block">{card.cardNumber}</strong>
                          <span className="text-[10px] text-neutral-500">
                            {card.cardHolder} • Expires: {card.expiry} • {card.cardType}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('Delete this saved card?')) {
                            onDeleteCard(card.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
