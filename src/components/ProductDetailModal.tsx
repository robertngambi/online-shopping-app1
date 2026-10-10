import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ShoppingBag, 
  Zap, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Share2, 
  Check, 
  Tag,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';
import { Product, User } from '../types';
import { formatPrice, formatTimeRemaining } from '../utils/helpers';

interface ProductDetailModalProps {
  product: Product;
  user: User;
  selectedCountry: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onOpenChat: (shopId: string, shopName: string, shopPhone: string) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onAddPromotion?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  user,
  selectedCountry,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenChat,
  onEditProduct,
  onDeleteProduct,
  onAddPromotion,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const allImages = [
    product.heroImage,
    ...(product.galleryImages.filter(img => img !== product.heroImage))
  ];

  const isOwner = user.isShopOwner && user.shopId === product.shopId;

  // Countdown timer
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (product.promotion && product.promotion.expiresAt) {
      return formatTimeRemaining(product.promotion.expiresAt);
    }
    return null;
  });

  useEffect(() => {
    if (!product.promotion || !product.promotion.expiresAt) return;
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(product.promotion!.expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [product.promotion]);

  const hasPromo = product.promotion && timeRemaining && !timeRemaining.isExpired;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Floating Controls Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex-shrink-0">
              {product.category}
            </span>
            <span className="text-xs font-bold text-neutral-800 truncate">
              {product.shopName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isOwner && (
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shadow-xs cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            )}
            <button
              id="product-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 shadow-xs cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Owner Dropdown menu */}
          {showOptions && isOwner && (
            <div className="absolute right-4 top-12 w-44 bg-white rounded-xl shadow-xl border border-neutral-200 py-1 z-40">
              {onAddPromotion && (
                <button
                  onClick={() => {
                    onAddPromotion(product);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Add Promotion</span>
                </button>
              )}
              {onEditProduct && (
                <button
                  onClick={() => {
                    onEditProduct(product);
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>
              )}
              {onDeleteProduct && (
                <button
                  onClick={() => {
                    if (confirm(`Delete "${product.title}"?`)) {
                      onDeleteProduct(product.id);
                      onClose();
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Content Container (Images + All Details) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Image Gallery Carousel Section */}
          <div className="bg-neutral-900/5 rounded-2xl p-3 border border-neutral-200/80">
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full rounded-xl overflow-hidden bg-white shadow-xs">
              <img
                src={allImages[activeImageIndex] || product.heroImage}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Gallery Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-xs text-neutral-800 hover:bg-white shadow-sm transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-xs text-neutral-800 hover:bg-white shadow-sm transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {hasPromo && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-soft-pulse">
                  {product.promotion!.discountPercent}% OFF LIVE
                </div>
              )}
            </div>

            {/* Thumbnails row (1 caption + gallery photos) */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-400/50 scale-102' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-amber-700/85 text-white text-[8px] font-bold text-center">
                      Cover
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price Section */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
              {product.title}
            </h2>

            {/* Price & Countdown Card */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/90 space-y-2">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                    {formatPrice(product.price, selectedCountry)}
                  </span>
                  {hasPromo && (
                    <span className="ml-2 text-sm sm:text-base text-neutral-400 line-through">
                      {formatPrice(product.originalPrice, selectedCountry)}
                    </span>
                  )}
                </div>

                {hasPromo && timeRemaining && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-600 bg-red-100/80 border border-red-300 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-red-600 animate-spin" />
                    <span>{timeRemaining.formatted} remaining</span>
                  </div>
                )}
              </div>

              {hasPromo && (
                <div className="text-xs font-bold text-red-600">
                  Discount: -K{product.promotion!.discountAmount} ZMW off standard retail price!
                </div>
              )}
            </div>
          </div>

          {/* Blue Contact & Chat Buttons */}
          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {product.shopName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{product.shopName}</p>
                <p className="text-[11px] text-blue-700 font-medium">Merchant Support & Inquiries</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${product.shopPhone}`}
                className="flex-1 sm:flex-none py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title={`Call ${product.shopPhone}`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact ({product.shopPhone})</span>
              </a>

              <button
                id="product-chat-btn"
                onClick={() => {
                  onOpenChat(product.shopId, product.shopName, product.shopPhone);
                  onClose();
                }}
                className="flex-1 sm:flex-none py-2 px-3.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Product Description
            </h4>
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
              {product.description}
            </p>
          </div>

          {/* Stock & Quantity Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock ({product.stock} units available)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-600">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & RED Buy Now Button */}
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                id="modal-add-to-cart-btn"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="py-3.5 px-4 bg-neutral-100 hover:bg-amber-50 text-neutral-900 hover:text-amber-900 font-bold text-sm rounded-2xl border border-neutral-300 hover:border-amber-400 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                id="modal-buy-now-btn"
                onClick={() => {
                  onBuyNow(product, quantity);
                  onClose();
                }}
                className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Merchant Protection
              </span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-neutral-700 cursor-pointer">
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share Item'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
