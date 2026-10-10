import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Clock, 
  Tag, 
  DollarSign, 
  Percent, 
  Check, 
  AlertCircle,
  Bell
} from 'lucide-react';
import { Product, Shop } from '../types';

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  products: Product[];
  selectedProduct?: Product | null;
  onApplyPromotion: (productId: string, discountAmount: number, hours: number) => void;
}

export const AddPromotionModal: React.FC<AddPromotionModalProps> = ({
  isOpen,
  onClose,
  shop,
  products,
  selectedProduct,
  onApplyPromotion,
}) => {
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const [chosenProductId, setChosenProductId] = useState<string>(
    selectedProduct?.id || (shopProducts.length > 0 ? shopProducts[0].id : '')
  );
  const [discountAmount, setDiscountAmount] = useState<string>('30');
  const [hours, setHours] = useState<string>('6'); // Default 6 hours
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentChosenProduct = shopProducts.find(p => p.id === chosenProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!chosenProductId) {
      setError('Please select a product from your shop inventory.');
      return;
    }

    const parsedDiscount = parseFloat(discountAmount);
    const parsedHours = parseFloat(hours);

    if (isNaN(parsedDiscount) || parsedDiscount <= 0) {
      setError('Please enter a valid positive discount amount in ZMW.');
      return;
    }

    if (currentChosenProduct && parsedDiscount >= currentChosenProduct.originalPrice) {
      setError(`Discount cannot exceed or equal the original product price of K${currentChosenProduct.originalPrice} ZMW.`);
      return;
    }

    if (isNaN(parsedHours) || parsedHours <= 0) {
      setError('Please enter duration in hours (e.g. 2, 6, 12, 24).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onApplyPromotion(chosenProductId, parsedDiscount, parsedHours);
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  const calcNewPrice = currentChosenProduct
    ? Math.max(0, currentChosenProduct.originalPrice - (parseFloat(discountAmount) || 0))
    : 0;

  const calcPercent = currentChosenProduct && currentChosenProduct.originalPrice > 0
    ? Math.round(((parseFloat(discountAmount) || 0) / currentChosenProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Add Promotion</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Select Shop Product to Discount *
            </label>
            {shopProducts.length === 0 ? (
              <p className="text-xs text-red-500">No products available in your shop. Please add a product first.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {shopProducts.map((p) => {
                  const isSelected = p.id === chosenProductId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setChosenProductId(p.id)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/70 ring-2 ring-red-400/40 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.heroImage}
                          alt={p.title}
                          className="w-11 h-11 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{p.title}</h4>
                          <span className="text-xs font-semibold text-neutral-500">
                            Current Price: K{p.originalPrice} ZMW
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-neutral-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Discount Amount Box & Set Time in Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                'Discount Amount' Box (ZMW) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">K</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full pl-8 pr-14 py-2.5 text-base font-extrabold text-red-600 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">ZMW</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Enter Number of Hours *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 1, 2, 3, 6, 12, 24"
                  className="w-full pl-9 pr-14 py-2.5 text-base font-bold text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-red-500 focus:outline-hidden"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">Hours</span>
              </div>
            </div>
          </div>

          {/* Live Discount Calculation Summary */}
          {currentChosenProduct && (
            <div className="p-3.5 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200/80 space-y-2">
              <div className="text-xs font-bold text-neutral-700">Promotion Preview:</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Original Price:</span>
                <span className="font-semibold line-through text-neutral-500">K{currentChosenProduct.originalPrice} ZMW</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-700 font-bold">Subtracted Discount:</span>
                <span className="font-extrabold text-red-600">-K{discountAmount || 0} ZMW ({calcPercent}% OFF)</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-red-200 pt-1.5">
                <span className="font-bold text-neutral-900">New Displayed Price:</span>
                <span className="font-extrabold text-base text-emerald-800">K{calcNewPrice.toFixed(2)} ZMW</span>
              </div>
            </div>
          )}

          {/* Broadcast Notification Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              All app users will instantly receive a broadcast notification alerting them to this discount deal.
            </span>
          </div>

          {/* Confirm Promotion Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || shopProducts.length === 0}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm Promotion</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
