import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Store, 
  ShoppingBag, 
  PlusCircle, 
  X 
} from 'lucide-react';
import { User, AppNotification, AppTheme } from '../types';

interface HeaderProps {
  user: User;
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenShopModal: () => void;
  onOpenMyShop: () => void;
  notifications: AppNotification[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTheme: AppTheme;
  onOpenAppearance: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSidebar,
  onOpenNotifications,
  onOpenProfile,
  onOpenShopModal,
  onOpenMyShop,
  notifications,
  searchQuery,
  onSearchChange,
  currentTheme,
  onOpenAppearance,
  cartCount,
  onOpenCart,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Hamburger Menu */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              id="header-hamburger-btn"
              onClick={onOpenSidebar}
              className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Center: Stretched Expanded Search Bar for all app data & information */}
          <div className="flex-1 mx-1 sm:mx-3 min-w-0">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products, shops, categories, services, data across app..."
                className="w-full pl-10 pr-9 py-2.5 bg-neutral-100/90 hover:bg-neutral-100 focus:bg-white text-xs sm:text-sm rounded-full border border-neutral-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-hidden transition-all duration-200 text-neutral-800 placeholder-neutral-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-200/60"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Shop Action + Cart + Notifications */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Shop Owner / Open Shop Quick Pill */}
            {user.isShopOwner ? (
              <button
                id="header-my-shop-btn"
                onClick={onOpenMyShop}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all"
              >
                <Store className="w-3.5 h-3.5" />
                <span>My Shop</span>
              </button>
            ) : (
              <button
                id="header-open-shop-btn"
                onClick={onOpenShopModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-full shadow-xs active:scale-95 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Shop</span>
              </button>
            )}

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 px-1 min-w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-soft-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications with red background badge */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 px-1 min-w-4 h-4 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-soft-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
