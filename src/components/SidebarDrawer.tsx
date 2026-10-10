import React from 'react';
import { 
  X, 
  Grid, 
  Clock, 
  Layers,
  Store, 
  UserCheck, 
  Palette, 
  Settings, 
  Info, 
  Megaphone, 
  PlusCircle, 
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame
} from 'lucide-react';
import { ActiveTab, User, AppTheme } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAppearance: () => void;
  onOpenSettings: () => void;
  onOpenAboutApp: () => void;
  onOpenAdsHub: () => void;
  onOpenOpenShop: () => void;
  onOpenMyShop: () => void;
  onOpenProfile: () => void;
  user: User;
  currentTheme: AppTheme;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  onOpenAppearance,
  onOpenSettings,
  onOpenAboutApp,
  onOpenAdsHub,
  onOpenOpenShop,
  onOpenMyShop,
  onOpenProfile,
  user,
  currentTheme,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'all' as ActiveTab,
      label: 'All Products',
      icon: Grid,
      action: () => {
        onChangeTab('all');
        onClose();
      },
    },
    {
      id: 'categories' as ActiveTab,
      label: 'Shop Categories',
      icon: Layers,
      action: () => {
        onChangeTab('categories');
        onClose();
      },
    },
    {
      id: 'recent' as ActiveTab,
      label: 'Recent Arrivals',
      icon: Clock,
      action: () => {
        onChangeTab('recent');
        onClose();
      },
    },
    {
      id: 'promotions' as ActiveTab,
      label: 'Promotions',
      icon: Flame,
      action: () => {
        onChangeTab('promotions');
        onClose();
      },
    },
    {
      id: 'shops' as ActiveTab,
      label: 'Verified Shops',
      icon: Store,
      action: () => {
        onChangeTab('shops');
        onClose();
      },
    },
    {
      id: 'about_me' as ActiveTab,
      label: 'About Me',
      icon: UserCheck,
      action: () => {
        onChangeTab('about_me');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 leading-none">
                  Eastern Online Store
                </h2>
                <span className="text-[11px] text-amber-700 font-semibold">
                  v1.0.0 Release
                </span>
              </div>
            </div>
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Middle Nav Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          
          <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/10 text-amber-900 font-bold'
                    : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'text-amber-600' : 'text-neutral-500'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}

          <div className="my-2 border-t border-neutral-200/60" />

          <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Business & Services
          </div>

          {/* Advertisements hub button (No 5+ badge, no smaller subtitle) */}
          <button
            id="sidebar-ads-hub-btn"
            onClick={() => {
              onOpenAdsHub();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-amber-50/50 hover:text-amber-900 transition-all font-medium cursor-pointer"
          >
            <Megaphone className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold">Advertisements & Ads</span>
          </button>

          {/* Open Shop Button */}
          <button
            id="sidebar-open-shop-btn"
            onClick={() => {
              onOpenOpenShop();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white active:scale-98 transition-all font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-white" />
            <span className="text-sm font-bold flex-1">Open Shop</span>
            <ChevronRight className="w-4 h-4 text-amber-200" />
          </button>

          {/* Shop Owner Portal if already a merchant */}
          {user.isShopOwner && (
            <button
              id="sidebar-my-shop-btn"
              onClick={() => {
                onOpenMyShop();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all font-bold cursor-pointer"
            >
              <Store className="w-5 h-5 text-amber-700" />
              <span className="text-sm flex-1">My Shop Dashboard</span>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </button>
          )}

          <div className="my-2 border-t border-neutral-200/60" />

          <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Customization & Info
          </div>

          {/* Profile tab button */}
          <button
            id="sidebar-profile-menu-btn"
            onClick={() => {
              onOpenProfile();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-neutral-100 transition-all font-medium cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-neutral-500" />
            <span className="text-sm font-semibold">User Profile</span>
          </button>

          {/* Appearance tab */}
          <button
            id="sidebar-appearance-btn"
            onClick={() => {
              onOpenAppearance();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-neutral-100 transition-all font-medium cursor-pointer"
          >
            <Palette className="w-5 h-5 text-neutral-500" />
            <span className="text-sm font-semibold flex-1">Appearance</span>
            <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          {/* Settings tab */}
          <button
            id="sidebar-settings-btn"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-neutral-100 transition-all font-medium cursor-pointer"
          >
            <Settings className="w-5 h-5 text-neutral-500" />
            <span className="text-sm font-semibold">Settings</span>
          </button>

          {/* About App tab */}
          <button
            id="sidebar-about-app-btn"
            onClick={() => {
              onOpenAboutApp();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-neutral-100 transition-all font-medium cursor-pointer"
          >
            <Info className="w-5 h-5 text-neutral-500" />
            <span className="text-sm font-semibold">About App</span>
          </button>

        </div>

        {/* Bottom Footer Info */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted • Mobile Money Protected</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            © 2026 Eastern Online Store • Zambia
          </p>
        </div>

      </div>
    </div>
  );
};
