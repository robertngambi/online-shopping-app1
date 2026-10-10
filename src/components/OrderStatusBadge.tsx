import React from 'react';
import { Package, Truck, CheckCircle2, Clock, Check, ChevronRight } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showPulse?: boolean;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
  showPulse = true,
  className = '',
}) => {
  const normalizedStatus = (status || 'Preparing').trim();

  // Determine badge styling based on dynamic status
  let badgeStyle = {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    pulseRing: 'bg-amber-400',
    icon: Package,
    label: 'Preparing',
    description: 'Merchant is packing your items',
  };

  if (normalizedStatus.toLowerCase() === 'in transit' || normalizedStatus.toLowerCase() === 'intransit' || normalizedStatus.toLowerCase() === 'transit') {
    badgeStyle = {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
      dot: 'bg-blue-500',
      pulseRing: 'bg-blue-400',
      icon: Truck,
      label: 'In Transit',
      description: 'Dispatched & en route to destination',
    };
  } else if (normalizedStatus.toLowerCase() === 'delivered' || normalizedStatus.toLowerCase() === 'completed' || normalizedStatus.toLowerCase() === 'confirmed_received') {
    badgeStyle = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      dot: 'bg-emerald-500',
      pulseRing: 'bg-emerald-400',
      icon: CheckCircle2,
      label: 'Delivered',
      description: 'Successfully received by buyer',
    };
  } else if (normalizedStatus.toLowerCase() === 'paid' || normalizedStatus.toLowerCase() === 'pending') {
    badgeStyle = {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      dot: 'bg-orange-500',
      pulseRing: 'bg-orange-400',
      icon: Clock,
      label: 'Preparing',
      description: 'Payment confirmed, preparing package',
    };
  }

  const Icon = badgeStyle.icon;

  // Sizing definitions
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 font-bold rounded-md',
    sm: 'px-2.5 py-1 text-xs gap-1.5 font-bold rounded-full',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-2 font-bold rounded-full',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5 font-extrabold rounded-2xl shadow-2xs',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isLiveActive = badgeStyle.label === 'Preparing' || badgeStyle.label === 'In Transit';

  return (
    <span
      className={`inline-flex items-center border transition-all ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${sizeClasses[size]} ${className}`}
      title={badgeStyle.description}
    >
      {/* Optional Animated Pulse Dot for live stages */}
      {showPulse && isLiveActive && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeStyle.pulseRing} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeStyle.dot}`} />
        </span>
      )}

      {showIcon && <Icon className={`${iconSizes[size]} flex-shrink-0`} />}
      <span className="whitespace-nowrap tracking-wide">{badgeStyle.label}</span>
    </span>
  );
};

interface OrderProgressTrackerProps {
  currentStatus: OrderStatus | string;
  onAdvanceStatus?: (nextStatus: OrderStatus) => void;
  isMerchant?: boolean;
}

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({
  currentStatus,
  onAdvanceStatus,
  isMerchant = false,
}) => {
  const norm = (currentStatus || 'Preparing').toLowerCase();
  
  let currentStep = 1; // 1: Preparing, 2: In Transit, 3: Delivered
  if (norm.includes('transit')) {
    currentStep = 2;
  } else if (norm.includes('deliver') || norm.includes('complet')) {
    currentStep = 3;
  }

  const steps = [
    { step: 1, label: 'Preparing', icon: Package, key: 'Preparing' as OrderStatus, note: 'Packing goods' },
    { step: 2, label: 'In Transit', icon: Truck, key: 'In Transit' as OrderStatus, note: 'On the way' },
    { step: 3, label: 'Delivered', icon: CheckCircle2, key: 'Delivered' as OrderStatus, note: 'Received' },
  ];

  const getNextStatus = (): OrderStatus | null => {
    if (currentStep === 1) return 'In Transit';
    if (currentStep === 2) return 'Delivered';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="w-full bg-neutral-50 rounded-2xl p-3 sm:p-4 border border-neutral-200/80 space-y-3">
      {/* Step Tracker Bars */}
      <div className="relative flex items-center justify-between">
        {/* Connecting Background Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
        
        {/* Connecting Active Fill Line */}
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 z-0 transition-all duration-500"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 3rem)'
          }}
        />

        {steps.map((st) => {
          const isDone = currentStep > st.step;
          const isCurrent = currentStep === st.step;
          const Icon = st.icon;

          let stepCircleStyle = 'bg-neutral-200 text-neutral-400 border-neutral-300';
          let textColor = 'text-neutral-400';

          if (isDone) {
            stepCircleStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
            textColor = 'text-emerald-800 font-bold';
          } else if (isCurrent) {
            if (st.step === 1) {
              stepCircleStyle = 'bg-amber-600 text-white border-amber-600 shadow-md ring-4 ring-amber-100';
              textColor = 'text-amber-800 font-extrabold';
            } else if (st.step === 2) {
              stepCircleStyle = 'bg-blue-600 text-white border-blue-600 shadow-md ring-4 ring-blue-100';
              textColor = 'text-blue-800 font-extrabold';
            } else {
              stepCircleStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-4 ring-emerald-100';
              textColor = 'text-emerald-800 font-extrabold';
            }
          }

          return (
            <div key={st.step} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all ${stepCircleStyle}`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1.5 whitespace-nowrap text-center ${textColor}`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Status Progression Actions */}
      {onAdvanceStatus && (
        <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-500">
            Current stage:{' '}
            <strong className="text-neutral-800">
              {currentStep === 1 ? 'Packing order at shop' : currentStep === 2 ? 'Delivery vehicle en route' : 'Order complete'}
            </strong>
          </span>

          {nextStatus && (
            <button
              onClick={() => onAdvanceStatus(nextStatus)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all active:scale-95 shadow-xs ${
                nextStatus === 'In Transit'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>Mark as {nextStatus}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 3 && (
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fulfilled & Received</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
