import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  Clock, 
  ShoppingBag, 
  Zap, 
  Flame, 
  Edit3, 
  Trash2, 
  Tag, 
  Phone, 
  MessageSquare,
  Eye,
  Check
} from 'lucide-react';
import { Product, User } from '../types';
import { formatPrice, formatTimeRemaining } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  user: User;
  selectedCountry: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onAddPromotion?: (product: Product) => void;
  onOpenChat?: (shopId: string, shopName: string, shopPhone: string) => void;
  onPromotionExpired?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  user,
  selectedCountry,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onEditProduct,
  onDeleteProduct,
  onAddPromotion,
  onOpenChat,
  onPromotionExpired,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const isOwner = user.isShopOwner && user.shopId === product.shopId;

  // Live timer ticking every second
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (product.promotion && product.promotion.expiresAt) {
      return formatTimeRemaining(product.promotion.expiresAt);
    }
    return null;
  });

  useEffect(() => {
    if (!product.promotion || !product.promotion.expiresAt) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(product.promotion!.expiresAt);
      setTimeRemaining(remaining);

      if (remaining.isExpired) {
        if (onPromotionExpired) {
          onPromotionExpired(product.id);
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product.promotion, product.id, onPromotionExpired]);

  const hasActivePromo = product.promotion && timeRemaining && !timeRemaining.isExpired;

  // 72-hour recent check
  const isRecent = Date.now() - product.createdAt < 72 * 3600 * 1000;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-neutral-200/90 hover:border-amber-400/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top Image Container */}
      <div 
        className="relative aspect-[4/3] sm:aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.heroImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasActivePromo && (
            <div className="flex items-center gap-1 bg-red-600 text-white text-xs sm:text-[10px] font-extrabold px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full shadow-md uppercase tracking-wider animate-soft-pulse">
              <Flame className="w-3.5 h-3.5 sm:w-3 sm:h-3 fill-white" />
              <span>{product.promotion!.discountPercent}% OFF</span>
            </div>
          )}
          {isRecent && !hasActivePromo && (
            <div className="bg-amber-600 text-white text-xs sm:text-[10px] font-bold px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full shadow-md">
              Recent
            </div>
          )}
        </div>

        {/* 3-dots Menu Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            id={`product-card-menu-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 sm:p-1.5 rounded-full bg-white/95 backdrop-blur-xs text-neutral-700 hover:text-black hover:bg-white shadow-md border border-neutral-200/60 transition-all"
            aria-label="Product options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div 
              className="absolute right-0 mt-1 w-52 sm:w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-30 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onSelectProduct(product);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3.5 py-2.5 sm:py-2 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5 font-medium"
              >
                <Eye className="w-4 h-4 text-neutral-500" />
                <span>View Full Details</span>
              </button>

              {onOpenChat && (
                <button
                  onClick={() => {
                    onOpenChat(product.shopId, product.shopName, product.shopPhone);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 sm:py-2 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Merchant</span>
                </button>
              )}

              {isOwner ? (
                <>
                  <div className="border-t border-neutral-100 my-1" />
                  <div className="px-3.5 py-1 text-[10px] font-bold text-neutral-400 uppercase">
                    Owner Actions
                  </div>

                  {onAddPromotion && (
                    <button
                      onClick={() => {
                        onAddPromotion(product);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 sm:py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 font-semibold"
                    >
                      <Tag className="w-4 h-4 text-amber-600" />
                      <span>Add Promotion</span>
                    </button>
                  )}

                  {onEditProduct && (
                    <button
                      onClick={() => {
                        onEditProduct(product);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 sm:py-2 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2.5 font-medium"
                    >
                      <Edit3 className="w-4 h-4 text-neutral-500" />
                      <span>Edit Product</span>
                    </button>
                  )}

                  {onDeleteProduct && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${product.title}"?`)) {
                          onDeleteProduct(product.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 sm:py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Product</span>
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Gallery count indicator */}
        {product.galleryImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md">
            1/{product.galleryImages.length} Photos
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Name & Category */}
          <div className="flex items-center justify-between text-xs sm:text-[11px] text-neutral-500 font-medium mb-1">
            <span className="truncate max-w-[200px] sm:max-w-[130px] text-amber-800 font-semibold">{product.shopName}</span>
            <span className="text-neutral-400 font-medium">{product.category}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-base sm:text-sm font-bold text-neutral-900 leading-snug line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors"
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing & Promotion Live Timer Section */}
        <div className="mt-3.5 sm:mt-3 pt-3 sm:pt-2.5 border-t border-neutral-100">
          
          {/* Price Container */}
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <span className="text-lg sm:text-base font-extrabold text-neutral-900">
                {formatPrice(product.price, selectedCountry)}
              </span>
              {hasActivePromo && (
                <span className="ml-2 sm:ml-1.5 text-sm sm:text-xs text-neutral-400 line-through">
                  {formatPrice(product.originalPrice, selectedCountry)}
                </span>
              )}
            </div>

            {/* Live Ticking Countdown on Right Side */}
            {hasActivePromo && timeRemaining && (
              <div 
                className="flex items-center gap-1.5 sm:gap-1 text-xs sm:text-[11px] font-mono font-bold text-red-600 bg-red-50 border border-red-200/80 px-2 py-0.5 sm:px-1.5 rounded-md"
                title="Promotion Time Remaining"
              >
                <Clock className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-red-500 animate-spin" />
                <span>{timeRemaining.formatted}</span>
              </div>
            )}
          </div>

          {/* Discount amount in small font in RED on the bottom */}
          {hasActivePromo && (
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs sm:text-[11px] font-bold text-red-600">
                Save -K{product.promotion!.discountAmount} ZMW ({product.promotion!.discountPercent}% off)
              </span>
              <span className="text-[11px] sm:text-[10px] text-neutral-400">
                Live countdown
              </span>
            </div>
          )}

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="mt-3.5 sm:mt-3 grid grid-cols-2 gap-2.5 sm:gap-2">
            <button
              id={`product-add-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-full py-2.5 sm:py-1.5 px-3 sm:px-2 bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-900 text-xs font-bold rounded-xl border border-neutral-200 hover:border-amber-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              id={`product-buy-now-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
              }}
              className="w-full py-2.5 sm:py-1.5 px-3 sm:px-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 sm:gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
