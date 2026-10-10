import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  Phone, 
  MessageSquare, 
  Truck, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Lock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { formatPrice } from '../utils/helpers';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  orders: Order[];
  user: User;
  selectedCountry: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (selectedCartItems?: CartItem[]) => void;
  onOpenChat: (shopId: string, shopName: string, shopPhone: string) => void;
  onUpdateOrderStage: (orderId: string, updates: Partial<Order>) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  orders,
  user,
  selectedCountry,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenChat,
  onUpdateOrderStage,
  onDeleteOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'delivery'>('pending');
  // State for which cart items are selected for payment (default: all checked)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => cart.map(i => i.product.id));
  // State for which order tracking details are expanded
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>(() => orders.map(o => o.id));

  if (!isOpen) return null;

  // Toggle selection of a single cart item
  const handleToggleSelect = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedProductIds.length === cart.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(cart.map(i => i.product.id));
    }
  };

  // Toggle tracking expansion
  const handleToggleExpandOrder = (orderId: string) => {
    setExpandedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Filter checked items and calculate total
  const checkedItems = cart.filter(item => selectedProductIds.includes(item.product.id));
  const checkedTotal = checkedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleContinueToPay = () => {
    if (checkedItems.length === 0) {
      alert('Please select at least one item to continue with payment.');
      return;
    }
    onClose();
    onProceedToCheckout(checkedItems);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200 overflow-hidden">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Shopping Cart</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full-Page Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col overflow-hidden">
        {/* Top Navigation Buttons (Just below header) */}
        <div className="grid grid-cols-2 bg-neutral-100 p-2 border-b border-neutral-200 gap-2 flex-shrink-0">
          {/* TAB 1: Pending payment on the left */}
          <button
            id="cart-pending-payment-tab"
            onClick={() => setActiveTab('pending')}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80 scale-101'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pending payment</span>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow-2xs">
                {cart.length}
              </span>
            )}
          </button>

          {/* TAB 2: Waiting delivery on the right */}
          <button
            id="cart-waiting-delivery-tab"
            onClick={() => setActiveTab('delivery')}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/80 scale-101'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Waiting delivery</span>
            {orders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold shadow-2xs">
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1 CONTENT: PENDING PAYMENT */}
        {activeTab === 'pending' && (
          <div className="flex-1 overflow-y-auto flex flex-col justify-between">
            <div className="p-4 sm:p-6 space-y-3">
              
              {/* Select All Bar if cart has items */}
              {cart.length > 0 && (
                <div className="flex items-center justify-between px-2 pb-1 text-xs text-neutral-500 border-b border-neutral-100">
                  <button
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-2 font-bold text-neutral-700 hover:text-amber-800 cursor-pointer"
                  >
                    {selectedProductIds.length === cart.length ? (
                      <CheckSquare className="w-4 h-4 text-amber-700" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                    <span>
                      {selectedProductIds.length === cart.length ? 'Deselect All' : 'Select All Items'}
                    </span>
                  </button>

                  <span className="text-[11px]">
                    {selectedProductIds.length} of {cart.length} selected for purchase
                  </span>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                  <h3 className="text-sm font-bold text-neutral-700">No items pending payment</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Explore products in the marketplace and add items to your shopping cart.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const isChecked = selectedProductIds.includes(item.product.id);
                  return (
                    <div
                      key={item.product.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isChecked 
                          ? 'bg-amber-50/40 border-amber-300/80 shadow-2xs' 
                          : 'bg-neutral-50 border-neutral-200 opacity-80'
                      }`}
                    >
                      {/* Left Checklist Button */}
                      <button
                        onClick={() => handleToggleSelect(item.product.id)}
                        className="p-1 rounded-lg text-neutral-700 hover:text-amber-800 cursor-pointer flex-shrink-0"
                        title={isChecked ? 'Uncheck item (buy later)' : 'Check item (buy now)'}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-amber-700 fill-amber-50" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-400" />
                        )}
                      </button>

                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={item.product.heroImage}
                          alt={item.product.title}
                          className="w-14 h-14 rounded-xl object-cover border border-neutral-200 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {item.product.title}
                          </h4>
                          <span className="text-[11px] text-neutral-500 font-medium block truncate">
                            {item.product.shopName}
                          </span>
                          <span className="text-xs font-extrabold text-amber-900 mt-0.5 block">
                            {formatPrice(item.product.price, selectedCountry)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-xl p-0.5 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom: Checked list total & 'Continue to Pay' Button */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-base font-bold text-neutral-900">Cart Total</span>
                  <span className="text-xl font-black text-amber-900">
                    {formatPrice(checkedTotal, selectedCountry)}
                  </span>
                </div>

                <button
                  id="cart-continue-to-pay-btn"
                  onClick={handleContinueToPay}
                  disabled={checkedItems.length === 0}
                  className={`w-full py-3.5 px-4 font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${
                    checkedItems.length > 0
                      ? 'bg-amber-600 hover:bg-amber-700 active:scale-98 text-white cursor-pointer'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Pay ({checkedItems.length} items)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 CONTENT: WAITING DELIVERY */}
        {activeTab === 'delivery' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Truck className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-700">No active delivery orders</h3>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  When you purchase products, track their real-time merchant packaging, transit, and destination arrival here.
                </p>
                <button
                  onClick={() => setActiveTab('pending')}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  View Cart Items
                </button>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderIds.includes(order.id);
                const isPackaged = order.isPackaged ?? true;
                const isInTransit = order.isInTransit ?? (order.deliveryStatus === 'In Transit' || order.deliveryStatus === 'Delivered');
                const isReached = order.isReachedDestination ?? (order.deliveryStatus === 'Delivered');
                const isConfirmed = order.isConfirmedReceived ?? (order.status === 'confirmed_received');

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-neutral-300"
                  >
                    {/* Order Top Bar: Title, Date, Amount */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-neutral-900">{order.shopName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                            #{order.orderNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) • Total: <strong className="text-neutral-900">{formatPrice(order.total, selectedCountry)}</strong>
                        </p>
                      </div>

                      {/* Top Action Buttons: Contact (Blue), Chat (Blue), Track Order */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Blue Contact Button */}
                        <a
                          href={`tel:${order.shopPhone}`}
                          className="p-2 sm:px-2.5 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title={`Call Shop (${order.shopPhone})`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Contact</span>
                        </a>

                        {/* Blue Chat Button */}
                        <button
                          onClick={() => {
                            onClose();
                            onOpenChat(order.shopId, order.shopName, order.shopPhone);
                          }}
                          className="p-2 sm:px-2.5 sm:py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title="Open Encrypted Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Chat</span>
                        </button>

                        {/* Track Order Button */}
                        <button
                          onClick={() => handleToggleExpandOrder(order.id)}
                          className="p-2 sm:px-2.5 sm:py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-700" />
                          <span className="hidden sm:inline">Track Order</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Items Thumbnails */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-neutral-50 px-2 py-1 rounded-xl border border-neutral-200 flex-shrink-0 text-xs">
                          <img src={item.heroImage} alt={item.title} className="w-6 h-6 rounded-md object-cover" referrerPolicy="no-referrer" />
                          <span className="text-[11px] font-medium text-neutral-700 truncate max-w-[120px]">{item.title}</span>
                          <span className="text-[10px] text-neutral-400 font-bold">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Live Tracking Checklist */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-neutral-200 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                            Live Delivery Tracking Checklist
                          </span>
                          <span className="text-[10px] text-amber-800 font-medium">
                            {user.isShopOwner ? 'Merchant Control Active' : 'Buyer Tracking View'}
                          </span>
                        </div>

                        {/* Merchant Steps Checklist (Packaged, In transit, Reached destination) */}
                        <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200 space-y-2.5">
                          <p className="text-[10px] text-neutral-400 font-semibold uppercase">
                            Shop Owner Progress:
                          </p>

                          {/* 1. Packaged */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isPackaged ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-400'}`}>
                                <Package className="w-3.5 h-3.5" />
                              </div>
                              <span className={`font-bold ${isPackaged ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                1. Packaged
                              </span>
                            </div>

                            {/* Merchant or Simulation toggle */}
                            <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isPackaged}
                                onChange={(e) => onUpdateOrderStage(order.id, { isPackaged: e.target.checked })}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className={isPackaged ? 'text-emerald-700' : 'text-neutral-400'}>
                                {isPackaged ? 'Completed' : 'Pending'}
                              </span>
                            </label>
                          </div>

                          {/* 2. In transit */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isInTransit ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-400'}`}>
                                <Truck className="w-3.5 h-3.5" />
                              </div>
                              <span className={`font-bold ${isInTransit ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                2. In transit
                              </span>
                            </div>

                            <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isInTransit}
                                onChange={(e) => onUpdateOrderStage(order.id, { 
                                  isInTransit: e.target.checked,
                                  isPackaged: true,
                                  deliveryStatus: e.target.checked ? 'In Transit' : 'Preparing'
                                })}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className={isInTransit ? 'text-emerald-700' : 'text-neutral-400'}>
                                {isInTransit ? 'In Motion' : 'Pending'}
                              </span>
                            </label>
                          </div>

                          {/* 3. Reached destination */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-1.5 rounded-lg ${isReached ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-400'}`}>
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <span className={`font-bold ${isReached ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                3. Reached destination
                              </span>
                            </div>

                            <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isReached}
                                onChange={(e) => onUpdateOrderStage(order.id, { 
                                  isReachedDestination: e.target.checked,
                                  isInTransit: true,
                                  isPackaged: true,
                                  deliveryStatus: e.target.checked ? 'Delivered' : 'In Transit'
                                })}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className={isReached ? 'text-emerald-700' : 'text-neutral-400'}>
                                {isReached ? 'Arrived' : 'Pending'}
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Distinct Box: 'Confirm Received' (Active ONLY to buyer & ONLY if 'Reached destination' is checked) */}
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isReached 
                            ? 'bg-emerald-50/70 border-emerald-300' 
                            : 'bg-neutral-100/70 border-neutral-200 opacity-75'
                        }`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                                <CheckCircle2 className={`w-4 h-4 ${isConfirmed ? 'text-emerald-600' : 'text-neutral-400'}`} />
                                <span>Confirm Received</span>
                              </div>
                              <p className="text-[10px] text-neutral-500">
                                {isReached 
                                  ? 'Destination reached! Click checkbox below to confirm delivery receipt.' 
                                  : 'Locked: Waiting for merchant to check "Reached destination".'}
                              </p>
                            </div>

                            {/* Checklist Button: Confirm Received */}
                            <button
                              id={`confirm-received-btn-${order.id}`}
                              disabled={!isReached}
                              onClick={() => onUpdateOrderStage(order.id, { 
                                isConfirmedReceived: !isConfirmed,
                                status: !isConfirmed ? 'confirmed_received' : 'paid'
                              })}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                                !isReached
                                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                  : isConfirmed
                                  ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700'
                                  : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 cursor-pointer'
                              }`}
                            >
                              {isConfirmed ? (
                                <>
                                  <CheckSquare className="w-4 h-4" />
                                  <span>Received Confirmed</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-4 h-4" />
                                  <span>Confirm Received</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Bottom Delete Button: Active ONLY when Confirm Received is checked */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-neutral-400">
                            {isConfirmed ? 'Order complete. You may remove this delivery record.' : 'Confirm receipt above to enable order deletion.'}
                          </span>

                          <button
                            id={`delete-order-btn-${order.id}`}
                            disabled={!isConfirmed}
                            onClick={() => {
                              if (confirm(`Remove order #${order.orderNumber} from your delivery records?`)) {
                                onDeleteOrder(order.id);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isConfirmed
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer active:scale-95'
                                : 'bg-neutral-100 text-neutral-300 border border-neutral-200 cursor-not-allowed'
                            }`}
                            title={isConfirmed ? 'Delete delivery record' : 'Confirm delivery receipt first'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Order</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
};
