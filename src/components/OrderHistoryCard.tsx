import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  MessageSquare, 
  Package, 
  Truck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CreditCard, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Order, PreviousShopping, OrderStatus } from '../types';
import { OrderStatusBadge, OrderProgressTracker } from './OrderStatusBadge';
import { formatPrice } from '../utils/helpers';

export interface UnifiedOrder {
  id: string;
  orderNumber: string;
  shopId?: string;
  shopName: string;
  shopPhone?: string;
  date: string;
  itemCount: number;
  items?: { title: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod?: string;
  buyerPhone?: string;
  buyerFullName?: string;
  status: OrderStatus;
  deliveryStatus: OrderStatus;
  trackingNumber?: string;
  rawOrder?: Order;
}

interface OrderHistoryCardProps {
  order: UnifiedOrder;
  selectedCountry: string;
  onViewReceipt?: (order: Order) => void;
  onOpenChat?: (shopId: string, shopName: string, shopPhone: string) => void;
  onDeleteOrder: (id: string, orderNumber: string) => void;
  onUpdateStatus: (orderNumber: string, nextStatus: OrderStatus) => void;
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
  order,
  selectedCountry,
  onViewReceipt,
  onOpenChat,
  onDeleteOrder,
  onUpdateStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentStatus: OrderStatus = order.deliveryStatus || order.status || 'Preparing';

  const handleAdvance = (next: OrderStatus) => {
    onUpdateStatus(order.orderNumber, next);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      
      {/* Main Order Header & Summary Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        
        {/* Left Side: Order Identifiers & Dynamic Badge */}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              #{order.orderNumber}
            </span>
            <span className="text-sm font-bold text-neutral-900">{order.shopName}</span>
            
            {/* Dynamic Status Badge */}
            <OrderStatusBadge status={currentStatus} size="sm" showPulse={true} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{order.date}</span>
            </span>
            <span>•</span>
            <span>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</span>
            {order.paymentMethod && (
              <>
                <span>•</span>
                <span className="text-neutral-700 font-medium">{order.paymentMethod}</span>
              </>
            )}
            {order.trackingNumber && (
              <>
                <span>•</span>
                <span className="font-mono text-neutral-400">Waybill: {order.trackingNumber}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Total Price & Quick Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block sm:hidden">Total</span>
            <strong className="text-base sm:text-lg font-extrabold text-neutral-900">
              {formatPrice(order.totalAmount, selectedCountry)}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            {order.rawOrder && onViewReceipt && (
              <button
                onClick={() => onViewReceipt(order.rawOrder!)}
                className="p-2 sm:px-3 sm:py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-300/80 flex items-center gap-1.5 transition-all shadow-2xs"
                title="View SMS Receipt"
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Receipt</span>
              </button>
            )}

            {order.shopId && onOpenChat && (
              <button
                onClick={() => onOpenChat(order.shopId!, order.shopName, order.shopPhone || '+260977123456')}
                className="p-2 sm:px-3 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5 transition-all"
                title="Chat with Shop Merchant"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chat</span>
              </button>
            )}

            {/* Toggle Status Tracker & Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
              title="Toggle Live Tracking Timeline"
            >
              <span className="hidden md:inline">{isExpanded ? 'Hide Tracker' : 'Live Status'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Delete Record */}
            <button
              onClick={() => {
                if (confirm(`Remove order #${order.orderNumber} from your shopping history?`)) {
                  onDeleteOrder(order.id, order.orderNumber);
                }
              }}
              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Delete Order Record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Expanded Live Order Progress Tracker & Quick Actions */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-neutral-100 bg-neutral-50/50 space-y-4 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Live Order Journey & Dynamic Status Tracker</span>
            </span>
            <span className="text-[11px] text-neutral-500">
              Interactive Dispatch Simulator
            </span>
          </div>

          {/* 3-Stage Progress Timeline */}
          <OrderProgressTracker 
            currentStatus={currentStatus} 
            onAdvanceStatus={handleAdvance}
          />

          {/* Quick Manual Status Selector Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200/60">
            <span className="text-[11px] text-neutral-500 font-medium">
              Change status manually:
            </span>
            
            <div className="flex items-center gap-1.5">
              {(['Preparing', 'In Transit', 'Delivered'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(order.orderNumber, st)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    currentStatus === st
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items Breakdown if available */}
          {order.items && order.items.length > 0 && (
            <div className="p-3 bg-white rounded-2xl border border-neutral-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Ordered Items</span>
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
                  <span>{it.quantity}x {it.title}</span>
                  <span className="font-bold text-neutral-900">{formatPrice(it.price * it.quantity, selectedCountry)}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
