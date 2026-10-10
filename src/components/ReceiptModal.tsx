import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  ShieldCheck,
  Store
} from 'lucide-react';
import { Order } from '../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface ReceiptModalProps {
  isOpen?: boolean;
  onClose: () => void;
  order: Order | null;
  selectedCountry?: string;
  onConfirmReceived?: (orderNumber: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen = true,
  onClose,
  order,
  selectedCountry,
  onConfirmReceived,
}) => {
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(order.receiptSmsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const deliveryStatus = order.deliveryStatus || (order.status === 'confirmed_received' ? 'Delivered' : 'Preparing');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 to-yellow-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Receipt (#{order.orderNumber})</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

          {/* Delivery & Order Status Row */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Shipment Status</span>
              <div className="text-xs font-bold text-neutral-800">
                {deliveryStatus === 'Preparing' ? 'Merchant Packing Goods' : deliveryStatus === 'In Transit' ? 'Courier Dispatched' : 'Package Delivered'}
              </div>
            </div>
            <OrderStatusBadge status={deliveryStatus} size="sm" />
          </div>
          
          {/* Formatted SMS Terminal Card */}
          <div className="p-4 bg-neutral-900 text-emerald-400 font-mono text-xs rounded-2xl shadow-inner border border-neutral-800 space-y-2 whitespace-pre-wrap leading-relaxed">
            {order.receiptSmsText}
          </div>

          {/* SMS Status Indicator */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-neutral-500 block text-[10px]">Recipient Handset SMS:</span>
                <strong className="text-neutral-900">{order.buyerPhone}</strong>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Dispatched
            </span>
          </div>

          {/* Confirm Goods Received Action if not yet delivered */}
          {deliveryStatus !== 'Delivered' && onConfirmReceived && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2">
              <div className="text-[11px] text-amber-900 font-medium">
                Received package from courier?
              </div>
              <button
                onClick={() => {
                  onConfirmReceived(order.orderNumber);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Delivery</span>
              </button>
            </div>
          )}

          {/* Actions: Copy, Resend SMS, Print */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Receipt' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleSimulateSms}
              className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              {smsSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{smsSent ? 'SMS Sent!' : 'Resend SMS'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

