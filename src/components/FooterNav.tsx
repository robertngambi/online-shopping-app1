import React from 'react';
import { Grid, Clock, Layers, Store, UserCheck, Flame } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingCount?: number;
  recentCount?: number;
  promotionsCount?: number;
}

export const FooterNav: React.FC<FooterNavProps> = ({
  activeTab,
  onChangeTab,
  pendingCount = 0,
  recentCount = 0,
  promotionsCount = 0,
}) => {
  const navItems = [
    {
      id: 'all' as ActiveTab,
      label: 'All',
      icon: Grid,
      badge: null,
    },
    {
      id: 'categories' as ActiveTab,
      label: 'Categories',
      icon: Layers,
      badge: null,
    },
    {
      id: 'recent' as ActiveTab,
      label: 'Recent',
      icon: Clock,
      badge: recentCount > 0 ? `${recentCount}` : null,
      sublabel: '72h',
    },
    {
      id: 'promotions' as ActiveTab,
      label: 'Promotions',
      icon: Flame,
      badge: promotionsCount > 0 ? `${promotionsCount}` : null,
    },
    {
      id: 'shops' as ActiveTab,
      label: 'Shops',
      icon: Store,
      badge: null,
    },
    {
      id: 'about_me' as ActiveTab,
      label: 'About me',
      icon: UserCheck,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-lg transition-colors duration-300">
      <div className="max-w-xl sm:max-w-3xl mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`footer-tab-${item.id}`}
                onClick={() => onChangeTab(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-amber-600 font-bold scale-105'
                    : 'text-neutral-500 hover:text-neutral-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 px-1 min-w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10.5px] sm:text-[11px] mt-1 tracking-tight flex items-center gap-1 whitespace-nowrap">
                  {item.label}
                  {item.sublabel && (
                    <span className="text-[8.5px] px-1 py-0.2 bg-amber-100 text-amber-800 rounded-full font-semibold">
                      {item.sublabel}
                    </span>
                  )}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-8 h-1 bg-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
