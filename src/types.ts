export interface Country {
  name: string;
  code: string;
  dialCode: string;
  currency: string;
  symbol: string;
  exchangeRateToZMW: number; // 1 Foreign = X ZMW
}

export interface CreditCard {
  id: string;
  cardNumber: string; // Masked or full for display
  cardHolder: string;
  expiry: string;
  cardType: 'Visa' | 'MasterCard' | 'American Express';
  isDefault?: boolean;
}

export type OrderStatus = 'Preparing' | 'In Transit' | 'Delivered' | 'Completed';

export interface PreviousShopping {
  id: string;
  orderNumber: string;
  shopName: string;
  date: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryStatus?: OrderStatus;
  trackingNumber?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  country: string;
  phone: string;
  avatar: string;
  isShopOwner: boolean;
  shopId?: string;
  savedCards: CreditCard[];
  previousShoppings: PreviousShopping[];
  createdAt: string;
  password?: string;
}

export interface Shop {
  id: string;
  shopNumber: number; // e.g. 1001, 1002
  ownerName: string;
  shopName: string;
  category: string;
  caption: string;
  address: string;
  phone: string;
  mobileProvider: 'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo' | 'Bank Transfer';
  bankCard?: string;
  merchantAccountName?: string;
  merchantAccountNumber?: string;
  payoutMethod?: 'mobile_money' | 'bank_card' | 'bank_account';
  securityPin: string;
  rating: number;
  totalSales: number;
  commissionPaid: number;
  logo: string;
  createdAt: string;
}

export interface ProductPromotion {
  discountAmount: number; // Amount in ZMW subtracted from price
  discountPercent: number;
  originalPrice: number;
  expiresAt: number; // Epoch timestamp
  initialHours: number;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  shopPhone: string;
  title: string;
  description: string;
  category: string;
  price: number; // Current active price
  originalPrice: number;
  currency: string;
  heroImage: string; // 1 Caption picture
  galleryImages: string[]; // Up to 4 more photos
  stock: number;
  createdAt: number; // Timestamp for 72-hour recent calculations
  promotion?: ProductPromotion;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  quantity: number;
  heroImage: string;
}

export interface Order {
  id: string;
  orderNumber: string; // Format: 001-1001-0001
  shopId: string;
  shopName: string;
  shopPhone: string;
  buyerId: string;
  buyerUsername: string;
  buyerFullName: string;
  buyerPhone: string;
  buyerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  commissionFee: number; // 3% if > 200 ZMW
  total: number;
  paymentMethod: 'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo' | 'Credit Card';
  paymentDetails: string;
  status: 'pending' | 'paid' | 'confirmed_received';
  deliveryStatus?: OrderStatus;
  isPackaged?: boolean;
  isInTransit?: boolean;
  isReachedDestination?: boolean;
  isConfirmedReceived?: boolean;
  trackingNumber?: string;
  createdAt: number;
  confirmedReceivedAt?: number;
  autoDisappearAt?: number; // 10 minutes after confirm received
  receiptSmsText: string;
}

export type AdBgTheme = 'orange' | 'green' | 'blue' | 'gray';
export type AdPackageType = '1w' | '2w' | '1m' | '2m';

export interface Advertisement {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  bgTheme: AdBgTheme;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  description: string; // <250 words
  phone: string;
  email?: string;
  packageType: AdPackageType;
  packageCost: number; // K5, K8, K15, K24
  packageLabel: string;
  paymentMethod: 'Airtel Money' | 'Zamtel Kwacha' | 'MTN MoMo';
  status: 'active' | 'expired';
  createdAt: number;
  expiresAt: number;
  views: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // shopId + '_' + userId
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: number;
  isLiked: boolean;
  replyToId?: string;
  replyToText?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'order' | 'commission' | 'ad' | 'system';
  timestamp: number;
  read: boolean;
  linkTab?: string;
}

export type AppTheme = 'brown' | 'green' | 'blue' | 'slate';
export type ActiveTab = 'all' | 'categories' | 'recent' | 'promotions' | 'shops' | 'about_me';
