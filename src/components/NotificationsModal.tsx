import React from 'react';
import { 
  X, 
  Bell, 
  Flame, 
  DollarSign, 
  ShoppingBag, 
  Megaphone, 
  Info, 
  CheckCheck,
  Trash2,
  Clock
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200 overflow-hidden">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Notifications</h2>
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

      <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col overflow-hidden">
        {/* Actions bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-neutral-50 border-b border-neutral-200 text-xs flex-shrink-0">
          <button
            onClick={onMarkAllAsRead}
            className="text-amber-800 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
          <button
            onClick={onClearNotifications}
            className="text-neutral-500 hover:text-red-600 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 divide-y divide-neutral-100">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <Bell className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <h3 className="text-sm font-bold text-neutral-600">No Notifications</h3>
              <p className="text-xs text-neutral-400 mt-1">You are all caught up with latest store alerts and discount updates.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const timeStr = new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={n.id}
                  className="py-3.5 px-3 flex items-start gap-3.5 transition-colors hover:bg-neutral-50/80 rounded-xl"
                >
                  <div className="p-2 rounded-xl bg-neutral-100 text-amber-700 flex-shrink-0 mt-0.5">
                    {n.type === 'promotion' ? (
                      <Flame className="w-4 h-4 text-red-600" />
                    ) : n.type === 'commission' ? (
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    ) : n.type === 'order' ? (
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                        )}
                        <h4 className={`text-sm truncate ${!n.read ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                          {n.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1 flex-shrink-0 ml-2 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{timeStr}</span>
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
