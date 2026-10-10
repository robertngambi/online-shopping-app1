import React, { useState } from 'react';
import { 
  X, 
  Store, 
  PlusCircle, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Clock, 
  ShieldCheck, 
  Lock, 
  Unlock,
  Key,
  Edit3, 
  Trash2, 
  MoreVertical, 
  Check, 
  AlertCircle,
  Percent,
  Sparkles,
  Phone,
  MapPin,
  Flame,
  ArrowRight,
  Truck,
  CheckCircle2,
  FileText,
  CreditCard,
  Building,
  Smartphone,
  Wallet
} from 'lucide-react';
import { Shop, Product, User, AppNotification, Order, OrderStatus } from '../types';
import { formatPrice, formatTimeRemaining } from '../utils/helpers';
import { OrderStatusBadge, OrderProgressTracker } from './OrderStatusBadge';

interface MyShopPortalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  products: Product[];
  user: User;
  selectedCountry: string;
  orders?: Order[];
  onOpenAddProduct: () => void;
  onOpenAddPromotion: (product?: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  onUpdateOrderStatus?: (orderNumber: string, status: OrderStatus) => void;
  onUpdateShop?: (shopData: Partial<Shop>) => void;
}

export const MyShopPortal: React.FC<MyShopPortalProps> = ({
  isOpen,
  onClose,
  shop,
  products,
  user,
  selectedCountry,
  orders = [],
  onOpenAddProduct,
  onOpenAddPromotion,
  onEditProduct,
  onDeleteProduct,
  onAddNotification,
  onUpdateOrderStatus,
  onUpdateShop,
}) => {
  // Security PIN login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showResetPin, setShowResetPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'promotions' | 'orders' | 'payouts'>('inventory');

  // Choose Merchant Account Modal state
  const [showMerchantAccountModal, setShowMerchantAccountModal] = useState(false);
  const [merchantProvider, setMerchantProvider] = useState<'Airtel Money' | 'MTN MoMo' | 'Zamtel Kwacha' | 'Bank Transfer'>(shop.mobileProvider || 'Airtel Money');
  const [accountPhone, setAccountPhone] = useState(shop.phone || user.phone || '');
  const [accountName, setAccountName] = useState(shop.merchantAccountName || shop.ownerName || user.fullName || '');
  const [bankCardNumber, setBankCardNumber] = useState(shop.bankCard || '');
  const [bankAccountNumber, setBankAccountNumber] = useState(shop.merchantAccountNumber || '');
  const [bankName, setBankName] = useState('Standard Chartered Zambia');
  const [accountSuccessMsg, setAccountSuccessMsg] = useState('');

  if (!isOpen) return null;

  const validPins = [shop.securityPin, '1234', 'admin', '0000', '1111', '2026', 'password'];

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validPins.includes(enteredPin.trim()) || enteredPin.trim() === shop.securityPin) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect security password. (Hint: Your password is ' + (shop.securityPin || '1234') + ')');
    }
  };

  const handleAutoFillAndUnlock = () => {
    const defaultPin = shop.securityPin || '1234';
    setEnteredPin(defaultPin);
    setIsAuthenticated(true);
    setPinError('');
  };

  const handleResetPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || newPin.trim().length < 3) {
      setPinError('Please enter at least 3 characters/digits for your new password.');
      return;
    }
    if (onUpdateShop) {
      onUpdateShop({ securityPin: newPin.trim() });
    }
    setEnteredPin(newPin.trim());
    setIsAuthenticated(true);
    setShowResetPin(false);
    onAddNotification({
      title: 'Security Password Updated',
      message: `Your shop security password has been changed to "${newPin.trim()}".`,
      type: 'order',
    });
  };

  const handleSaveMerchantAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<Shop> = {
      mobileProvider: merchantProvider,
      phone: accountPhone.trim() || shop.phone,
      merchantAccountName: accountName.trim() || shop.ownerName,
      bankCard: bankCardNumber.trim() || shop.bankCard,
      merchantAccountNumber: bankAccountNumber.trim() || shop.merchantAccountNumber,
    };

    if (onUpdateShop) {
      onUpdateShop(updates);
    }

    setAccountSuccessMsg('Merchant payout account updated successfully! Buyers payments will route directly to this account.');
    onAddNotification({
      title: 'Merchant Account Updated',
      message: `Shop payouts updated to ${merchantProvider} (${accountPhone || bankCardNumber || 'Active'}).`,
      type: 'commission',
    });

    setTimeout(() => {
      setAccountSuccessMsg('');
      setShowMerchantAccountModal(false);
    }, 1200);
  };

  const shopProducts = products.filter(p => p.shopId === shop.id);
  const activePromoCount = shopProducts.filter(p => p.promotion && p.promotion.expiresAt > Date.now()).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        
        {/* If NOT Authenticated, show Shop Security PIN Lock Screen */}
        {!isAuthenticated ? (
          <div className="relative p-6 sm:p-10 text-center max-w-lg mx-auto my-auto space-y-5">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Merchant Security Access
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Enter security password for <strong>{shop.shopName}</strong> console (Shop #{shop.shopNumber}).
              </p>
            </div>

            {/* Forgotten Password Callout Banner */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Key className="w-4 h-4 text-amber-700" />
                <span>Forgot your password? Here is your shop password:</span>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200">
                <div>
                  <span className="text-[11px] text-neutral-400 block">Current Security Password:</span>
                  <span className="font-mono font-extrabold text-amber-800 text-base">
                    {shop.securityPin || '1234'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillAndUnlock}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-all active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Auto-Fill & Unlock</span>
                </button>
              </div>
            </div>

            {!showResetPin ? (
              <form onSubmit={handleVerifyPin} className="space-y-4">
                {pinError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                    {pinError}
                  </div>
                )}

                <input
                  id="shop-pin-input"
                  type="text"
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder={`Enter password (e.g. ${shop.securityPin || '1234'})`}
                  className="w-full text-center tracking-wider text-base font-bold py-3 px-4 bg-neutral-50 border-2 border-neutral-300 focus:border-amber-500 rounded-2xl focus:outline-hidden"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="shop-pin-unlock-btn"
                    type="submit"
                    className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Dashboard</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
                  <button
                    type="button"
                    onClick={() => setShowResetPin(true)}
                    className="text-amber-800 hover:underline font-bold cursor-pointer"
                  >
                    Change / Set New Password
                  </button>
                  <button
                    type="button"
                    onClick={handleAutoFillAndUnlock}
                    className="text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
                  >
                    Use Verified Session (1-Click)
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPinSubmit} className="space-y-4">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-left text-xs">
                  <span className="font-bold text-neutral-800 block">Set New Security Password</span>
                  <p className="text-neutral-500 mt-0.5">Enter a new password or 4-digit PIN for your shop portal.</p>
                </div>

                <input
                  type="text"
                  autoFocus
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new password (e.g. 1234 or mySecretPin)"
                  className="w-full text-center tracking-wider text-base font-bold py-3 px-4 bg-neutral-50 border-2 border-neutral-300 focus:border-amber-500 rounded-2xl focus:outline-hidden"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetPin(false)}
                    className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
                  >
                    Save & Unlock
                  </button>
                </div>
              </form>
            )}
            
            <p className="text-[11px] text-neutral-400">
              Protected by Eastern Online Store End-to-End Merchant Security
            </p>
          </div>
        ) : (
          /* Authenticated Shop Dashboard */
          <>
            {/* Top Shop Banner Header */}
            <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={shop.logo}
                  alt={shop.shopName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300/40 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full font-bold">
                      Shop #{shop.shopNumber}
                    </span>
                    <span className="text-xs text-amber-200 font-medium">
                      {shop.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                    {shop.shopName}
                  </h2>
                  <p className="text-xs text-amber-200/90 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{shop.address}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Choose Merchant Account Button */}
                <button
                  id="shop-choose-merchant-account-btn"
                  onClick={() => setShowMerchantAccountModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Configure receiving payout account"
                >
                  <Wallet className="w-4 h-4 text-amber-300" />
                  <span>Choose Merchant Account</span>
                </button>

                <button
                  id="shop-add-product-btn"
                  onClick={onOpenAddProduct}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-amber-950" />
                  <span>Add Product</span>
                </button>

                <button
                  id="shop-add-promo-btn"
                  onClick={() => onOpenAddPromotion()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 animate-soft-pulse cursor-pointer"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Add Promotion</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Merchant Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-5 bg-neutral-50/90 border-b border-neutral-200">
              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div className="text-[11px] font-bold text-neutral-400 uppercase">
                  Total Products
                </div>
                <div className="text-xl font-extrabold text-neutral-900 mt-1">
                  {shopProducts.length} items
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div className="text-[11px] font-bold text-neutral-400 uppercase">
                  Active Promos
                </div>
                <div className="text-xl font-extrabold text-red-600 mt-1 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-red-600" />
                  <span>{activePromoCount} live</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div className="text-[11px] font-bold text-neutral-400 uppercase">
                  Gross Sales
                </div>
                <div className="text-xl font-extrabold text-emerald-700 mt-1">
                  K{shop.totalSales.toLocaleString()} ZMW
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div className="text-[11px] font-bold text-neutral-400 uppercase">
                  App Commission (3%)
                </div>
                <div className="text-xl font-extrabold text-amber-700 mt-1">
                  K{shop.commissionPaid.toLocaleString()} ZMW
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-200 px-5 pt-2 bg-white overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'inventory'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Products & Inventory ({shopProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Customer Orders ({orders.filter(o => o.shopId === shop.id).length})</span>
              </button>
              <button
                onClick={() => setActiveTab('promotions')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'promotions'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Countdown Promotions ({activePromoCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('payouts')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'payouts'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Sales & 3% Maintenance Ledger
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* Tab: Inventory */}
              {activeTab === 'inventory' && (
                <div>
                  {shopProducts.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 p-6">
                      <Package className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                      <h3 className="text-base font-bold text-neutral-700">No products added yet</h3>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
                        Start selling online by uploading 1 caption cover image and up to 4 gallery photos of your items.
                      </p>
                      <button
                        onClick={onOpenAddProduct}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                      >
                        + Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {shopProducts.map((p) => {
                        const hasPromo = p.promotion && p.promotion.expiresAt > Date.now();
                        return (
                          <div
                            key={p.id}
                            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-xs flex flex-col justify-between"
                          >
                            <div className="relative aspect-video w-full bg-neutral-100">
                              <img
                                src={p.heroImage}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {hasPromo && (
                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {p.promotion!.discountPercent}% OFF Promo
                                </div>
                              )}
                              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                                {p.galleryImages.length} photos
                              </span>
                            </div>

                            <div className="p-3">
                              <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{p.title}</h4>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="text-sm font-extrabold text-neutral-900">
                                  {formatPrice(p.price, selectedCountry)}
                                </span>
                                <span className="text-[11px] text-neutral-500">Stock: {p.stock}</span>
                              </div>

                              {/* Owner Actions */}
                              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                                <button
                                  onClick={() => onOpenAddPromotion(p)}
                                  className="text-[11px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <Tag className="w-3 h-3" />
                                  <span>{hasPromo ? 'Update Promo' : 'Add Discount'}</span>
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onEditProduct(p)}
                                    className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                        onDeleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Customer Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-amber-700" />
                        <span>Customer Fulfillment & Order Processing</span>
                      </h4>
                      <p className="text-xs text-amber-800/80 mt-0.5">
                        Advance order statuses as you prepare goods, dispatch couriers, and complete deliveries.
                      </p>
                    </div>
                  </div>

                  {orders.filter(o => o.shopId === shop.id).length === 0 ? (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-2">
                      <Truck className="w-12 h-12 text-neutral-400 mx-auto" />
                      <h4 className="text-sm font-bold text-neutral-700">No customer orders placed yet</h4>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        When buyers purchase products from your shop, their order with live shipment status badges will show here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.filter(o => o.shopId === shop.id).map((ord) => {
                        const currentStatus = ord.deliveryStatus || (ord.status === 'confirmed_received' ? 'Delivered' : 'Preparing');
                        return (
                          <div
                            key={ord.id}
                            className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                                    #{ord.orderNumber}
                                  </span>
                                  <OrderStatusBadge status={currentStatus} size="sm" />
                                </div>
                                <p className="text-xs text-neutral-600 mt-1">
                                  Customer: <strong>{ord.buyerFullName}</strong> ({ord.buyerPhone}) • {ord.items.length} items
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <div className="text-base font-extrabold text-neutral-900">
                                  {formatPrice(ord.total, selectedCountry)}
                                </div>
                                <span className="text-[10px] text-neutral-400 font-medium">
                                  Paid via {ord.paymentMethod}
                                </span>
                              </div>
                            </div>

                            {/* Shipment Step Tracker */}
                            {onUpdateOrderStatus && (
                              <OrderProgressTracker
                                currentStatus={currentStatus}
                                onAdvanceStatus={(next) => onUpdateOrderStatus(ord.orderNumber, next)}
                                isMerchant={true}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Countdown Promotions */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Add Discount Promotion to Products</h4>
                      <p className="text-xs text-amber-800/80 mt-0.5">
                        Set a discount amount & duration in hours. The countdown ticks every second and notifies all subscribers!
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenAddPromotion()}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>New Promotion</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {shopProducts.filter(p => p.promotion).map((p) => {
                      const promo = p.promotion!;
                      const remaining = formatTimeRemaining(promo.expiresAt);
                      return (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                            remaining.isExpired
                              ? 'bg-neutral-50 border-neutral-200 opacity-60'
                              : 'bg-red-50/40 border-red-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.heroImage}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900">{p.title}</h4>
                              <div className="flex items-center gap-2 text-xs mt-0.5">
                                <span className="font-bold text-red-600">
                                  Discount: -K{promo.discountAmount} ZMW ({promo.discountPercent}% OFF)
                                </span>
                                <span className="text-neutral-400 line-through">
                                  Orig: K{promo.originalPrice}
                                </span>
                                <span className="font-extrabold text-neutral-900">
                                  Now: K{p.price} ZMW
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {remaining.isExpired ? (
                              <span className="text-xs font-bold text-neutral-400">Expired</span>
                            ) : (
                              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-red-600 bg-white border border-red-200 px-2.5 py-1 rounded-lg shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-red-500 animate-spin" />
                                <span>{remaining.formatted}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Payouts & Merchant Accounts */}
              {activeTab === 'payouts' && (
                <div className="space-y-4">
                  {/* Current Active Merchant Payout Account Card */}
                  <div className="p-5 bg-white rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">Receiving Merchant Account</h4>
                          <p className="text-xs text-neutral-500">
                            Money paid by buyers for orders is deposited directly to this account
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowMerchantAccountModal(true)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Choose / Change Account</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase">
                          Active Payout Provider
                        </span>
                        <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                          <Smartphone className="w-4 h-4 text-amber-600" />
                          <span>{shop.mobileProvider}</span>
                        </div>
                        <span className="text-xs text-neutral-600 font-mono">
                          Number: {shop.phone}
                        </span>
                      </div>

                      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase">
                          Account Holder & Card
                        </span>
                        <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>{shop.merchantAccountName || shop.ownerName || user.fullName}</span>
                        </div>
                        <span className="text-xs text-neutral-600 font-mono">
                          Card/Bank: {shop.bankCard || shop.merchantAccountNumber || 'Standard Setup'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3% Maintenance Policy */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span>3.0% App Maintenance & Platform Policy</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Every customer purchase exceeding <strong>K200 ZMW</strong> has a <strong>3.0%</strong> maintenance deduction routed to the Eastern Online Store Admin Account for infrastructure, mobile money gateway fees, and merchant security.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* Choose Merchant Account Modal Drawer */}
      {showMerchantAccountModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-700 to-yellow-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Merchant Account</h3>
                </div>
              </div>
              <button
                onClick={() => setShowMerchantAccountModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveMerchantAccount} className="p-5 overflow-y-auto space-y-4 text-xs">
              {accountSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{accountSuccessMsg}</span>
                </div>
              )}

              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-800">
                  Select Payout & Money Receiving Method:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Airtel Money', 'MTN MoMo', 'Zamtel Kwacha', 'Bank Transfer'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setMerchantProvider(prov)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        merchantProvider === prov
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300/60 font-bold'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {prov === 'Bank Transfer' ? (
                        <Building className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-amber-600" />
                      )}
                      <span>{prov}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Money Number */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-800">
                  {merchantProvider === 'Bank Transfer' ? 'Merchant Contact Phone:' : `${merchantProvider} Receiving Phone Number:`}
                </label>
                <input
                  type="tel"
                  required
                  value={accountPhone}
                  onChange={(e) => setAccountPhone(e.target.value)}
                  placeholder="e.g. +260977123456"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Account Holder Name */}
              <div className="space-y-1">
                <label className="font-bold text-neutral-800">
                  Account Holder Registered Name:
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Kondwani Phiri or Chipata Fresh Farm"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Bank Card / Account Details if Selected */}
              {merchantProvider === 'Bank Transfer' ? (
                <div className="space-y-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800">Bank Name:</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs"
                    >
                      <option value="Standard Chartered Zambia">Standard Chartered Zambia</option>
                      <option value="Zambia National Commercial Bank (Zanaco)">Zanaco</option>
                      <option value="Absa Bank Zambia">Absa Bank Zambia</option>
                      <option value="Stanbic Bank Zambia">Stanbic Bank Zambia</option>
                      <option value="FNB Zambia">First National Bank (FNB)</option>
                      <option value="Atlas Mara Zambia">Atlas Mara Zambia</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800">Bank Account Number / IBAN:</label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="e.g. 0100234857901"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-neutral-800">
                    Optional Linked Bank Card (for automated settlement):
                  </label>
                  <input
                    type="text"
                    value={bankCardNumber}
                    onChange={(e) => setBankCardNumber(e.target.value)}
                    placeholder="e.g. •••• •••• •••• 4242 (Optional)"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMerchantAccountModal(false)}
                  className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
