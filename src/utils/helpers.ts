import { Product, Order, Country } from '../types';
import { COUNTRIES } from '../data/countries';

// Sequence Order Number generator: 001 - {shopNumber} - {orderNumber}
// Example: 001-1001-0001
export function generateOrderNumber(shopNumber: number, orderIndex: number): string {
  const versionPart = '001';
  const shopPart = shopNumber.toString().padStart(4, '0');
  const orderPart = orderIndex.toString().padStart(4, '0');
  return `${versionPart}-${shopPart}-${orderPart}`;
}

// Format duration remaining
export function formatTimeRemaining(expiresAt: number): {
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const diff = expiresAt - Date.now();
  if (diff <= 0) {
    return { formatted: '00:00:00', hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return { formatted, hours, minutes, seconds, isExpired: false };
}

// Convert price from ZMW to selected country currency
export function formatPrice(
  amountInZMW: number,
  targetCountryName: string = 'Zambia',
  includeSymbol: boolean = true
): string {
  const country = COUNTRIES.find(c => c.name.toLowerCase() === targetCountryName.toLowerCase()) || COUNTRIES[0];
  const convertedAmount = amountInZMW / country.exchangeRateToZMW;
  
  const formattedNumber = convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: convertedAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (!includeSymbol) {
    return formattedNumber;
  }

  // If Zambia, format as K 160 or 160 ZMW
  if (country.currency === 'ZMW') {
    return `K${formattedNumber} ZMW`;
  }

  return `${country.symbol}${formattedNumber} (${country.currency})`;
}

// Calculate 3% commission on sales exceeding K200 ZMW
export function calculateCommission(saleAmountZMW: number): {
  isEligible: boolean;
  commissionFee: number;
  payoutToShop: number;
} {
  if (saleAmountZMW > 200) {
    const fee = Number((saleAmountZMW * 0.03).toFixed(2));
    return {
      isEligible: true,
      commissionFee: fee,
      payoutToShop: Number((saleAmountZMW - fee).toFixed(2)),
    };
  }
  return {
    isEligible: false,
    commissionFee: 0,
    payoutToShop: saleAmountZMW,
  };
}

// Prepare the SMS Quote Receipt as specified in prompt:
// "prepare a quote receipt which include the shop name, order number and a list of items purchased and the customer or buyers user name on the bottom, and send as sms to the buyer or customer phones number"
export function generateSmsQuoteReceipt(order: {
  shopName: string;
  orderNumber: string;
  items: { title: string; quantity: number; price: number }[];
  buyerUsername: string;
  buyerPhone: string;
  total: number;
  paymentMethod: string;
}): string {
  const dateStr = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const itemsList = order.items
    .map((item, idx) => `${idx + 1}. ${item.title} (x${item.quantity}) - K${(item.price * item.quantity).toLocaleString()} ZMW`)
    .join('\n');

  return `==============================
EASTERN ONLINE STORE | OFFICIAL RECEIPT
==============================
Shop: ${order.shopName}
Order Number: ${order.orderNumber}
Date: ${dateStr}
Payment: ${order.paymentMethod} (PAID)

ITEMS PURCHASED:
${itemsList}

TOTAL AMOUNT: K${order.total.toLocaleString()} ZMW
------------------------------
Customer Username: @${order.buyerUsername}
Buyer Mobile: ${order.buyerPhone}
Status: Confirmed & Dispatched

Thank you for supporting local businesses on Eastern Online Store!
Support: +260 977 123456
==============================`;
}

// Storage helpers
export function loadFromLocalStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`eastern_store_${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`eastern_store_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Preset photo assets for quick add product
export const PRESET_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609592424368-a46ce59ec4e3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
];
