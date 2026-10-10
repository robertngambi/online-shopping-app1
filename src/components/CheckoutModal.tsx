import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Lock, 
  Plus, 
  FileText,
  AlertCircle,
  Clock
} from 'lucide-react';
import { CartItem, Order, User, CreditCard as CardType, Shop } from '../types';
import { generateOrderNumber, calculateCommission, generateSmsQuoteReceipt, formatPrice } from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User;
  shops: Shop[];
  selectedCountry: string;
  onCompleteOrder: (order: Order, updatedUserCards?: CardType[]) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  shops,
  selectedCountry,
  onCompleteOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo' | 'Credit Card'>('Airtel Money');
  const [momoPhone, setMomoPhone] = useState(user.phone || '+260977123456');
  const [momoPin, setMomoPin] = useState('');
  const [showMomoPrompt, setShowMomoPrompt] = useState(false);

  // Credit Card state
  const [savedCards, setSavedCards] = useState<CardType[]>(user.savedCards || []);
  const [selectedCardId, setSelectedCardId] = useState<string>(
    user.savedCards && user.savedCards.length > 0 ? user.savedCards[0].id : 'new_card'
  );
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState(user.fullName.toUpperCase() || '');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || cart.length === 0) return null;

  // Group cart items by shop (for multiple shops or single shop)
  const primaryShopId = cart[0].product.shopId;
  const primaryShop = shops.find(s => s.id === primaryShopId) || shops[0];
  const primaryShopNumber = primaryShop ? primaryShop.shopNumber : 1001;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const { isEligible, commissionFee } = calculateCommission(subtotal);
  const total = subtotal;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentMethod !== 'Credit Card') {
      if (!momoPhone.trim()) {
        setError('Please enter mobile money phone number.');
        return;
      }
      // Show mobile money simulated push prompt
      setShowMomoPrompt(true);
      return;
    }

    // If Credit Card
    let updatedCardsList = [...savedCards];
    if (selectedCardId === 'new_card') {
      if (!newCardNumber.trim() || !newCardExpiry.trim() || !newCardCvv.trim()) {
        setError('Please complete all credit card fields.');
        return;
      }

      if (saveCardForFuture) {
        if (savedCards.length >= 5) {
          setError('Maximum of 5 bank cards can be saved. Please manage your cards in Profile.');
          return;
        }
        const masked = `•••• •••• •••• ${newCardNumber.replace(/\s+/g, '').slice(-4) || '1234'}`;
        const newCardObj: CardType = {
          id: `card_${Date.now()}`,
          cardNumber: masked,
          cardHolder: newCardHolder.trim().toUpperCase() || 'VALUED CUSTOMER',
          expiry: newCardExpiry.trim(),
          cardType: newCardNumber.startsWith('4') ? 'Visa' : 'MasterCard',
        };
        updatedCardsList.push(newCardObj);
      }
    }

    finalizeOrder(updatedCardsList);
  };

  const handleMomoPinConfirm = () => {
    if (!momoPin.trim() || momoPin.length < 4) {
      setError('Please enter your 4-digit Mobile Money PIN.');
      return;
    }
    setShowMomoPrompt(false);
    finalizeOrder();
  };

  const finalizeOrder = (updatedCards?: CardType[]) => {
    setIsProcessing(true);

    setTimeout(() => {
      // Generate Order Number in exact sequence: 001-1001-0001
      const orderCountForShop = Math.floor(Math.random() * 80) + 1;
      const orderNumber = generateOrderNumber(primaryShopNumber, orderCountForShop);

      const orderItems = cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        quantity: item.quantity,
        heroImage: item.product.heroImage,
      }));

      // SMS Quote Receipt content
      const receiptSms = generateSmsQuoteReceipt({
        shopName: primaryShop ? primaryShop.shopName : 'Eastern Online Store Merchant',
        orderNumber,
        items: orderItems,
        buyerUsername: user.username,
        buyerPhone: momoPhone || user.phone,
        total,
        paymentMethod,
      });

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        shopId: primaryShopId,
        shopName: primaryShop ? primaryShop.shopName : 'Eastern Online Store Merchant',
        shopPhone: primaryShop ? primaryShop.phone : '+260977123456',
        buyerId: user.id,
        buyerUsername: user.username,
        buyerFullName: user.fullName,
        buyerPhone: momoPhone || user.phone,
        buyerEmail: user.email,
        items: orderItems,
        subtotal,
        commissionFee,
        total,
        paymentMethod,
        paymentDetails: paymentMethod === 'Credit Card' 
          ? (selectedCardId === 'new_card' ? 'Bank Card (Processed)' : 'Saved Card')
          : `${paymentMethod} (${momoPhone})`,
        status: 'paid',
        createdAt: Date.now(),
        receiptSmsText: receiptSms,
      };

      onCompleteOrder(newOrder, updatedCards);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Checkout</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleProcessPayment} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cart Summary List */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">
              Items to Purchase ({cart.length})
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-2.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.heroImage}
                      alt={item.product.title}
                      className="w-10 h-10 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.product.title}</h4>
                      <span className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} × {formatPrice(item.product.price, selectedCountry)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-900">
                    {formatPrice(item.product.price * item.quantity, selectedCountry)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtotal & 3% Maintenance Commission Information */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-bold text-neutral-900">{formatPrice(subtotal, selectedCountry)}</span>
            </div>

            {isEligible && (
              <div className="flex items-center justify-between text-amber-800 text-[11px]">
                <span>App Payout & Maintenance (3% on &gt;K200):</span>
                <span>Included in merchant settlement (-K{commissionFee} ZMW)</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm font-extrabold text-neutral-900 border-t border-amber-200 pt-1.5">
              <span>Total Due:</span>
              <span className="text-base text-amber-800 font-black">{formatPrice(total, selectedCountry)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Select Payment Method *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Airtel Money', 'MTN MoMo', 'Zamtel Kwacha', 'Credit Card'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    paymentMethod === method
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Money Details */}
          {paymentMethod !== 'Credit Card' ? (
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                <Smartphone className="w-4 h-4 text-amber-700" />
                <span>{paymentMethod} Direct Billing</span>
              </div>
              <div className="relative">
                <span className="text-xs font-semibold text-neutral-500 block mb-1">Subscriber Mobile Number:</span>
                <input
                  type="tel"
                  required
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="+260977123456"
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-hidden focus:border-amber-500 font-bold"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                A secure USSD payment prompt will be pushed directly to your handset.
              </p>
            </div>
          ) : (
            /* Bank Credit Cards Module (Stores up to 5 cards) */
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Saved Bank Cards ({savedCards.length}/5)</span>
                </span>
              </div>

              {/* Saved Cards List */}
              {savedCards.length > 0 && (
                <div className="space-y-2">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCardId(card.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedCardId === card.id
                          ? 'border-amber-600 bg-amber-50/80 ring-1 ring-amber-400'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-neutral-500" />
                        <div>
                          <span className="text-xs font-bold text-neutral-900 block">{card.cardNumber}</span>
                          <span className="text-[10px] text-neutral-500">{card.cardHolder} • Exp: {card.expiry}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800">{card.cardType}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 'Use another Credit card' tab / button */}
              <button
                type="button"
                onClick={() => setSelectedCardId('new_card')}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedCardId === 'new_card'
                    ? 'border-amber-600 bg-amber-50 text-amber-900'
                    : 'border-dashed border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use Another Credit Card</span>
              </button>

              {/* New Card Input Form if selected */}
              {selectedCardId === 'new_card' && (
                <div className="space-y-2 pt-2 border-t border-neutral-200 animate-in fade-in">
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4242 •••• •••• 4242)"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newCardExpiry}
                      onChange={(e) => setNewCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-[11px] text-neutral-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCardForFuture}
                      onChange={(e) => setSaveCardForFuture(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Save card for future 1-click purchases (up to 5 cards)</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Place Order & Pay Button */}
          <div className="pt-2">
            <button
              id="checkout-submit-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay {formatPrice(total, selectedCountry)}</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Real-time Mobile Money PIN Confirmation Prompt Modal */}
        {showMomoPrompt && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-neutral-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">{paymentMethod} Handset Push</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your mobile money PIN to authorize transfer of <strong>K{total.toLocaleString()} ZMW</strong>.
                </p>
              </div>

              <input
                type="password"
                maxLength={6}
                autoFocus
                value={momoPin}
                onChange={(e) => setMomoPin(e.target.value)}
                placeholder="Enter 4 or 5 Digit PIN"
                className="w-full text-center tracking-widest text-lg font-bold py-2.5 px-3 bg-neutral-100 border-2 border-neutral-300 rounded-xl focus:outline-hidden focus:border-amber-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMomoPrompt(false)}
                  className="w-1/2 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMomoPinConfirm}
                  className="w-1/2 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Authorize PIN
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
