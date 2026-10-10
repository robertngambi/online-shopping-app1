import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Shop, 
  Product, 
  CartItem, 
  Order, 
  Advertisement, 
  AppNotification, 
  ChatMessage, 
  ActiveTab, 
  AppTheme,
  CreditCard as CardType,
  OrderStatus
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_SHOPS, 
  INITIAL_PRODUCTS, 
  INITIAL_ADS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { FooterNav } from './components/FooterNav';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SubscribeModal } from './components/SubscribeModal';
import { OpenShopModal } from './components/OpenShopModal';
import { MyShopPortal } from './components/MyShopPortal';
import { AddProductModal } from './components/AddProductModal';
import { AddPromotionModal } from './components/AddPromotionModal';
import { AdvertisementsModal } from './components/AdvertisementsModal';
import { AdPopup } from './components/AdPopup';
import { AdProfileModal } from './components/AdProfileModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ChatDrawer } from './components/ChatDrawer';
import { ProfileModal } from './components/ProfileModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AboutAppModal } from './components/AboutAppModal';
import { AppearanceModal } from './components/AppearanceModal';
import { CartModal } from './components/CartModal';
import { NotificationsModal } from './components/NotificationsModal';
import { CurrencySelector } from './components/CurrencySelector';
import { OrderHistoryCard, UnifiedOrder } from './components/OrderHistoryCard';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { COUNTRIES, BUSINESS_CATEGORIES } from './data/countries';
import { formatPrice } from './utils/helpers';
import { 
  Sparkles, 
  Flame, 
  Store, 
  Clock, 
  Grid, 
  Layers,
  Search,
  Filter, 
  ShoppingBag, 
  Tag, 
  Megaphone, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Zap,
  Phone,
  MessageSquare,
  Package,
  Building2,
  ArrowRight,
  Globe,
  Coins,
  X
} from 'lucide-react';

export default function App() {
  // Global LocalStorage or Initial State
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('eastern_store_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('eastern_store_shops');
    return saved ? JSON.parse(saved) : INITIAL_SHOPS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eastern_store_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [ads, setAds] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('eastern_store_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('eastern_store_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eastern_store_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('eastern_store_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('eastern_store_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // App Settings
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('eastern_store_theme') as AppTheme) || 'brown';
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('Zambia');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Modals & Panels State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isOpenShopModalOpen, setIsOpenShopModalOpen] = useState(false);
  const [isMyShopOpen, setIsMyShopOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [isAdsHubOpen, setIsAdsHubOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isAboutAppOpen, setIsAboutAppOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Selected entities for modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [promoTargetProduct, setPromoTargetProduct] = useState<Product | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [activeChatShop, setActiveChatShop] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [expandedShopId, setExpandedShopId] = useState<string | null>(null);
  const [checkoutCartItems, setCheckoutCartItems] = useState<CartItem[]>([]);

  // Random 5-Minute Ad Display Popup & Ad Profile
  const [popupAd, setPopupAd] = useState<Advertisement | null>(null);
  const [viewingAdProfile, setViewingAdProfile] = useState<Advertisement | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('eastern_store_user', JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem('eastern_store_shops', JSON.stringify(shops));
  }, [shops]);
  useEffect(() => {
    localStorage.setItem('eastern_store_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('eastern_store_ads', JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem('eastern_store_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('eastern_store_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem('eastern_store_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('eastern_store_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('eastern_store_theme', currentTheme);
  }, [currentTheme]);

  // Requirement: Random Ad Popup every 5 minutes
  useEffect(() => {
    const activeAdsList = ads.filter(a => a.status === 'active' && a.expiresAt > Date.now());
    if (activeAdsList.length === 0) return;

    // Initial popup after 20 seconds for preview, then every 5 minutes (300,000 ms)
    const initialTimer = setTimeout(() => {
      const randomAd = activeAdsList[Math.floor(Math.random() * activeAdsList.length)];
      setPopupAd(randomAd);
    }, 18000);

    const recurringInterval = setInterval(() => {
      const currentActive = ads.filter(a => a.status === 'active' && a.expiresAt > Date.now());
      if (currentActive.length > 0) {
        const randomAd = currentActive[Math.floor(Math.random() * currentActive.length)];
        setPopupAd(randomAd);
      }
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
    };
  }, [ads]);

  // Check and update expired promotions
  const handlePromotionExpired = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId && p.promotion) {
        return {
          ...p,
          price: p.originalPrice,
          promotion: undefined,
        };
      }
      return p;
    }));
  };

  // Add Notification Helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addNotification({
      title: 'Item Added to Cart',
      message: `"${product.title}" was added to your shopping cart.`,
      type: 'order',
      linkTab: 'about_me',
    });
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    setCart([{ product, quantity }]);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // User & Shop Registration
  const handleSaveUser = (userData: Partial<User>) => {
    setUser(prev => ({
      ...prev,
      ...userData,
    }));
    addNotification({
      title: 'Profile Updated',
      message: 'Your Eastern Online Store subscriber profile has been saved successfully.',
      type: 'system',
    });
  };

  const handleRegisterShop = (shopData: Omit<Shop, 'id' | 'shopNumber' | 'totalSales' | 'commissionPaid' | 'createdAt'>) => {
    const nextShopNumber = 1000 + shops.length + 1;
    const newShopId = `shop_${nextShopNumber}`;

    const newShop: Shop = {
      ...shopData,
      id: newShopId,
      shopNumber: nextShopNumber,
      totalSales: 0,
      commissionPaid: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setShops(prev => [newShop, ...prev]);

    // Update user to be shop owner
    setUser(prev => ({
      ...prev,
      isShopOwner: true,
      shopId: newShopId,
    }));

    addNotification({
      title: '🎉 Shop Account Activated!',
      message: `Congratulations! "${newShop.shopName}" (Shop #${newShop.shopNumber}) is now open for business.`,
      type: 'system',
    });

    setIsMyShopOpen(true);
  };

  const handleUpdateShop = (shopUpdates: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === userShop.id ? { ...s, ...shopUpdates } : s));
  };

  // Product Add / Edit / Delete Handlers
  const handleSaveProduct = (prodData: Partial<Product>) => {
    if (prodData.id) {
      // Edit existing product
      setProducts(prev => prev.map(p => p.id === prodData.id ? { ...p, ...prodData } as Product : p));
      addNotification({
        title: 'Product Updated',
        message: `Product "${prodData.title}" details were modified.`,
        type: 'system',
      });
    } else {
      // Add new product
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        shopId: prodData.shopId || user.shopId || 'shop_1001',
        shopName: prodData.shopName || 'Eastern Prime Groceries',
        shopPhone: prodData.shopPhone || user.phone,
        title: prodData.title || 'New Product',
        description: prodData.description || '',
        category: prodData.category || BUSINESS_CATEGORIES[0],
        price: prodData.price || 100,
        originalPrice: prodData.price || 100,
        currency: 'ZMW',
        heroImage: prodData.heroImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
        galleryImages: prodData.galleryImages || [],
        stock: prodData.stock || 10,
        createdAt: Date.now(),
      };
      setProducts(prev => [newProd, ...prev]);

      addNotification({
        title: '📦 New Product Listed',
        message: `"${newProd.title}" was added to marketplace catalogue.`,
        type: 'system',
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setSelectedProduct(null);
    addNotification({
      title: 'Product Deleted',
      message: 'The selected product was removed from your store inventory.',
      type: 'system',
    });
  };

  // Apply Discount Promotion Handler
  const handleApplyPromotion = (productId: string, discountAmount: number, hours: number) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const newPrice = Math.max(0, target.originalPrice - discountAmount);
    const discountPercent = Math.round((discountAmount / target.originalPrice) * 100);
    const expiresAt = Date.now() + (hours * 3600 * 1000);

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: newPrice,
          promotion: {
            discountAmount,
            discountPercent,
            originalPrice: p.originalPrice,
            expiresAt,
            initialHours: hours,
          },
        };
      }
      return p;
    }));

    // Broadcast notification to all subscribers
    addNotification({
      title: `🔥 Hot ${discountPercent}% OFF Flash Deal!`,
      message: `${target.shopName} discounted "${target.title}" by K${discountAmount} ZMW for the next ${hours} hours!`,
      type: 'promotion',
      linkTab: 'all',
    });
  };

  // Complete Order & Commission Calculation
  const handleCompleteOrder = (order: Order, updatedUserCards?: CardType[]) => {
    const orderWithStatus: Order = {
      ...order,
      deliveryStatus: 'Preparing',
      trackingNumber: order.trackingNumber || `TRK-ZMW-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setOrders(prev => [orderWithStatus, ...prev]);
    setCart([]);
    setLatestOrder(orderWithStatus);

    // If cards were updated
    if (updatedUserCards) {
      setUser(prev => ({
        ...prev,
        savedCards: updatedUserCards,
      }));
    }

    // Add to user previous shoppings
    const newPrevShopping = {
      id: `prev_${Date.now()}`,
      orderNumber: order.orderNumber,
      shopName: order.shopName,
      date: new Date().toISOString().split('T')[0] + ' (Today)',
      itemCount: order.items.reduce((s, i) => s + i.quantity, 0),
      totalAmount: order.total,
      status: 'Preparing' as const,
      deliveryStatus: 'Preparing' as const,
      trackingNumber: orderWithStatus.trackingNumber,
    };

    setUser(prev => ({
      ...prev,
      previousShoppings: [newPrevShopping, ...(prev.previousShoppings || [])],
    }));

    // Update shop metrics & commission
    setShops(prev => prev.map(s => {
      if (s.id === order.shopId) {
        return {
          ...s,
          totalSales: s.totalSales + order.total,
          commissionPaid: s.commissionPaid + order.commissionFee,
        };
      }
      return s;
    }));

    // Notify Buyer
    addNotification({
      title: `📦 Order #${order.orderNumber} Placed & Preparing`,
      message: `Your payment of ${formatPrice(order.total, selectedCountry)} was processed. Merchant is packaging your items. SMS receipt dispatched to ${order.buyerPhone}.`,
      type: 'order',
      linkTab: 'about_me',
    });

    // If commission fee deducted (> K200 ZMW), notify shop owner
    if (order.commissionFee > 0) {
      addNotification({
        title: 'App Maintenance Fee Deduction',
        message: `Order #${order.orderNumber} payout note: K${order.commissionFee} ZMW (3.0%) deducted as platform maintenance fee from K${order.total} ZMW sellout.`,
        type: 'commission',
      });
    }
  };

  // Dynamic Status Update Handler for Orders
  const handleUpdateOrderStatus = (orderNumber: string, nextStatus: OrderStatus) => {
    // Update active orders state
    setOrders(prev => prev.map(o => {
      if (o.orderNumber === orderNumber) {
        return {
          ...o,
          deliveryStatus: nextStatus,
          status: nextStatus === 'Delivered' ? 'confirmed_received' : o.status,
          confirmedReceivedAt: nextStatus === 'Delivered' ? Date.now() : o.confirmedReceivedAt,
        };
      }
      return o;
    }));

    // Update user's previous shopping log
    setUser(prev => ({
      ...prev,
      previousShoppings: (prev.previousShoppings || []).map(p => {
        if (p.orderNumber === orderNumber) {
          return {
            ...p,
            status: nextStatus,
            deliveryStatus: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }),
    }));

    // Generate dynamic broadcast notification
    const icon = nextStatus === 'Preparing' ? '📦' : nextStatus === 'In Transit' ? '🚚' : '✅';
    const statusNote = nextStatus === 'Preparing' 
      ? `Merchant is packing your ordered goods at the store.` 
      : nextStatus === 'In Transit' 
      ? `Courier has dispatched your package and is en route.` 
      : `Package successfully delivered and received!`;

    addNotification({
      title: `${icon} Order #${orderNumber} is ${nextStatus}`,
      message: statusNote,
      type: 'order',
      linkTab: 'about_me',
    });
  };

  // Delete Order Record Handler
  const handleDeleteOrderRecord = (id: string, orderNumber: string) => {
    setOrders(prev => prev.filter(o => o.orderNumber !== orderNumber && o.id !== id));
    setUser(prev => ({
      ...prev,
      previousShoppings: (prev.previousShoppings || []).filter(p => p.orderNumber !== orderNumber && p.id !== id),
    }));
  };

  // Order Stage Updates (Packaged, In transit, Reached destination, Confirm Received)
  const handleUpdateOrderStage = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, ...updates };
        if (updates.isReachedDestination && !o.isReachedDestination) {
          addNotification({
            title: `📍 Order #${o.orderNumber} Reached Destination`,
            message: `Your package from ${o.shopName} has arrived at destination. Please confirm receipt in the cart delivery tab.`,
            type: 'order',
          });
        }
        if (updates.isConfirmedReceived && !o.isConfirmedReceived) {
          addNotification({
            title: `✅ Order #${o.orderNumber} Received Confirmed`,
            message: `You confirmed receipt of your order from ${o.shopName}. Thank you for shopping on Eastern Store!`,
            type: 'order',
          });
        }
        return updated;
      }
      return o;
    }));
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    addNotification({
      title: 'Order Record Deleted',
      message: 'The delivery record has been removed from your list.',
      type: 'order',
    });
  };

  // Build Unified Orders List for History Log with dynamic status
  const unifiedOrders: UnifiedOrder[] = useMemo(() => {
    const list: UnifiedOrder[] = [];
    const seenOrderNumbers = new Set<string>();

    // 1. Session Orders
    orders.forEach((ord) => {
      const status: OrderStatus = ord.deliveryStatus || (ord.status === 'confirmed_received' ? 'Delivered' : 'Preparing');
      seenOrderNumbers.add(ord.orderNumber);
      list.push({
        id: ord.id,
        orderNumber: ord.orderNumber,
        shopId: ord.shopId,
        shopName: ord.shopName,
        shopPhone: ord.shopPhone,
        date: new Date(ord.createdAt).toISOString().split('T')[0] + ' (Today)',
        itemCount: ord.items.reduce((s, i) => s + i.quantity, 0),
        items: ord.items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
        totalAmount: ord.total,
        paymentMethod: ord.paymentMethod,
        buyerFullName: ord.buyerFullName,
        buyerPhone: ord.buyerPhone,
        status: status,
        deliveryStatus: status,
        trackingNumber: ord.trackingNumber || `TRK-ZMW-${ord.orderNumber.replace(/[^0-9]/g, '').slice(-5)}`,
        rawOrder: ord,
      });
    });

    // 2. User Previous Shoppings (historic)
    (user.previousShoppings || []).forEach((prev) => {
      if (!seenOrderNumbers.has(prev.orderNumber)) {
        seenOrderNumbers.add(prev.orderNumber);
        const status: OrderStatus = prev.deliveryStatus || prev.status || 'Preparing';
        list.push({
          id: prev.id,
          orderNumber: prev.orderNumber,
          shopName: prev.shopName,
          date: prev.date,
          itemCount: prev.itemCount,
          totalAmount: prev.totalAmount,
          status: status,
          deliveryStatus: status,
          trackingNumber: prev.trackingNumber || `TRK-ZMW-${prev.orderNumber.replace(/[^0-9]/g, '').slice(-5)}`,
        });
      }
    });

    return list;
  }, [orders, user.previousShoppings]);

  // Filtered Orders History based on dynamic status pill tab
  const filteredOrderHistory = useMemo(() => {
    if (orderStatusFilter === 'all') return unifiedOrders;
    return unifiedOrders.filter(o => o.deliveryStatus === orderStatusFilter || o.status === orderStatusFilter);
  }, [unifiedOrders, orderStatusFilter]);

  // Chat Handlers
  const handleOpenChat = (shopId: string, shopName: string, shopPhone: string) => {
    setActiveChatShop({ id: shopId, name: shopName, phone: shopPhone });
  };

  const handleSendMessage = (text: string, replyTo?: ChatMessage) => {
    if (!activeChatShop) return;
    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      conversationId: `${activeChatShop.id}_${user.id}`,
      senderId: user.id,
      senderName: user.fullName,
      recipientId: activeChatShop.id,
      text,
      timestamp: Date.now(),
      isLiked: false,
      replyToId: replyTo?.id,
      replyToText: replyTo?.text,
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated merchant automatic friendly response
    setTimeout(() => {
      const merchantReplies = [
        `Hello ${user.fullName.split(' ')[0]}! Thank you for messaging ${activeChatShop.name}. We have this item in stock and deliver anywhere in Zambia within 24 hours.`,
        `Hi! Yes, all our prices in Zambian Kwacha (ZMW) are current and we accept Airtel Money, MTN MoMo, Zamtel, and Bank Cards.`,
        `Thanks for reaching out! Let me know if you would like me to reserve units for you or arrange bulk dispatch.`
      ];
      const replyText = merchantReplies[Math.floor(Math.random() * merchantReplies.length)];

      const autoReply: ChatMessage = {
        id: `chat_${Date.now() + 1}`,
        conversationId: `${activeChatShop.id}_${user.id}`,
        senderId: activeChatShop.id,
        senderName: activeChatShop.name,
        recipientId: user.id,
        text: replyText,
        timestamp: Date.now(),
        isLiked: false,
      };
      setChatMessages(prev => [...prev, autoReply]);
    }, 1500);
  };

  const handleLikeMessage = (messageId: string) => {
    setChatMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, isLiked: !m.isLiked } : m
    ));
  };

  // Advertisement Handlers
  const handleCreateAd = (adData: Omit<Advertisement, 'id' | 'createdAt' | 'expiresAt' | 'views'>) => {
    const pkgDays = adData.packageType === '1w' ? 7 : adData.packageType === '2w' ? 14 : adData.packageType === '1m' ? 30 : 60;
    const newAd: Advertisement = {
      ...adData,
      id: `ad_${Date.now()}`,
      createdAt: Date.now(),
      expiresAt: Date.now() + (pkgDays * 24 * 3600 * 1000),
      views: 0,
    };

    setAds(prev => [newAd, ...prev]);

    addNotification({
      title: '📢 Advertisement Broadcast Active',
      message: `Your ad "${newAd.title}" is now broadcasting across Eastern Online Store for ${newAd.packageLabel}.`,
      type: 'ad',
    });
  };

  const handleActivateAd = (adId: string, packageType: any, packageCost: number, paymentMethod: any) => {
    const pkgDays = packageType === '1w' ? 7 : packageType === '2w' ? 14 : packageType === '1m' ? 30 : 60;
    setAds(prev => prev.map(a => {
      if (a.id === adId) {
        return {
          ...a,
          packageType,
          packageCost,
          packageLabel: `K${packageCost} - ${packageType}`,
          paymentMethod,
          status: 'active',
          expiresAt: Date.now() + (pkgDays * 24 * 3600 * 1000),
        };
      }
      return a;
    }));

    addNotification({
      title: 'Ad Re-activated',
      message: `Advertisement renewed for ${pkgDays} days.`,
      type: 'ad',
    });
  };

  const handleDeleteAd = (adId: string) => {
    setAds(prev => prev.filter(a => a.id !== adId));
  };

  // Filtered Products for Tabs
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Tab filter
    if (activeTab === 'recent') {
      // Recent products added within 72 hours
      const cutoff72h = Date.now() - (72 * 3600 * 1000);
      list = list.filter(p => p.createdAt >= cutoff72h);
    } else if (activeTab === 'promotions') {
      // Active promotional items with countdown
      list = list.filter(p => p.promotion && p.promotion.expiresAt > Date.now());
    }

    // Category filter
    if (selectedCategory !== 'All' && activeTab === 'all') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter (searches across product title, description, category, shopName, and price)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.price.toString().includes(q)
      );
    }

    return list;
  }, [products, activeTab, selectedCategory, searchQuery]);

  // Filtered Shops (searches across shop name, owner, category, caption, address, phone, shop number)
  const filteredShops = useMemo(() => {
    let list = [...shops];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.shopName.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.caption.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.shopNumber.toString().includes(q)
      );
    }
    return list;
  }, [shops, searchQuery]);

  // Categories Directory (listing all shop categories present with shops and products)
  const categoriesDirectory = useMemo(() => {
    const presentCategoriesSet = new Set<string>();
    
    // Add all categories from registered shops
    shops.forEach(s => {
      if (s.category && s.category.trim()) {
        presentCategoriesSet.add(s.category.trim());
      }
    });
    
    // Also include all standard business categories
    BUSINESS_CATEGORIES.forEach(c => presentCategoriesSet.add(c));

    const allCategoriesList = Array.from(presentCategoriesSet);

    let detailed = allCategoriesList.map(categoryName => {
      const categoryShops = shops.filter(s => s.category.toLowerCase() === categoryName.toLowerCase());
      const categoryProducts = products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
      return {
        name: categoryName,
        shops: categoryShops,
        shopsCount: categoryShops.length,
        productsCount: categoryProducts.length,
        hasShops: categoryShops.length > 0,
      };
    });

    // If search query is present, filter categories by name, shops or products
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      detailed = detailed.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.shops.some(s => 
          s.shopName.toLowerCase().includes(q) || 
          s.ownerName.toLowerCase().includes(q) || 
          s.caption.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q)
        ) ||
        products.some(p => p.category.toLowerCase() === c.name.toLowerCase() && (
          p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        ))
      );
    }

    // Sort: categories with active shops first, then alphabetical
    return detailed.sort((a, b) => {
      if (a.hasShops && !b.hasShops) return -1;
      if (!a.hasShops && b.hasShops) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [shops, products, searchQuery]);

  const recentCount = useMemo(() => {
    const cutoff72h = Date.now() - (72 * 3600 * 1000);
    return products.filter(p => p.createdAt >= cutoff72h).length;
  }, [products]);

  const activePromoCount = useMemo(() => {
    return products.filter(p => p.promotion && p.promotion.expiresAt > Date.now()).length;
  }, [products]);

  // Active current user's shop
  const userShop = shops.find(s => s.id === user.shopId) || shops[0];

  return (
    <div className={`min-h-screen pb-24 font-['Century_Gothic',sans-serif] antialiased bg-[#FDFBF7] text-neutral-900 transition-colors duration-300 theme-${currentTheme}`}>
      
      {/* Top Main Navigation Header */}
      <Header
        user={user}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShopModal={() => setIsOpenShopModalOpen(true)}
        onOpenMyShop={() => setIsMyShopOpen(true)}
        notifications={notifications}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentTheme={currentTheme}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Global App Search Banner (searches across products, shops, categories, and marketplace data) */}
        {searchQuery.trim() && (
          <div className="p-4 bg-white rounded-2xl border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-neutral-900">
                  Search results for: <span className="text-amber-700">"{searchQuery}"</span>
                </p>
                <p className="text-[11px] text-neutral-500">
                  Found {filteredProducts.length} matching products, {filteredShops.length} shops, and {categoriesDirectory.length} category sectors
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                  activeTab === 'all' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Products ({filteredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                  activeTab === 'categories' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Categories ({categoriesDirectory.length})
              </button>
              <button
                onClick={() => setActiveTab('shops')}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
                  activeTab === 'shops' ? 'bg-amber-600 text-white shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Shops ({filteredShops.length})
              </button>
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 ml-1 transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Promotional Flash Deals Banner (if on All or Recent tab) */}
        {(activeTab === 'all' || activeTab === 'recent') && activePromoCount > 0 && !searchQuery && (
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 rounded-3xl p-5 sm:p-7 text-white shadow-md border border-red-300">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Live Per-Second Flash Deals</span>
                  </span>
                  <span className="text-xs text-rose-200 font-bold">
                    {activePromoCount} Active Discount Promos
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Limited-Time Merchant Discounts with Live Countdown
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl">
                  Discounts automatically revert to standard prices once the countdown timer expires. Order now with instant mobile money!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdsHubOpen(true)}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-2xl backdrop-blur-xs transition-all flex items-center gap-1.5"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Business Ads Hub</span>
                </button>
                <button
                  onClick={() => setIsOpenShopModalOpen(true)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Store className="w-4 h-4" />
                  <span>Open Shop</span>
                </button>
              </div>
            </div>

            {/* Decorative Background Shapes */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute left-1/2 -top-12 w-32 h-32 rounded-full bg-amber-400/20 pointer-events-none" />
          </div>
        )}

        {/* TAB 1: ALL PRODUCTS */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {/* Header / Filter status */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {selectedCategory === 'All' ? 'Marketplace Catalogue' : selectedCategory}
                </h3>
                <p className="text-xs text-neutral-500">
                  Showing {filteredProducts.length} certified products from Zambian merchants
                </p>
              </div>

              {/* Quick ad popup test button */}
              <button
                onClick={() => {
                  const active = ads.filter(a => a.status === 'active');
                  if (active.length > 0) {
                    setPopupAd(active[Math.floor(Math.random() * active.length)]);
                  }
                }}
                className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                title="Preview a 5-minute random sponsored ad popup"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview Ad Popup</span>
              </button>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                <h4 className="text-base font-bold text-neutral-800">No products found</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different category from above.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    user={user}
                    selectedCountry={selectedCountry}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onBuyNow={(p) => handleBuyNow(p, 1)}
                    onEditProduct={(p) => {
                      setEditingProduct(p);
                      setIsAddProductOpen(true);
                    }}
                    onDeleteProduct={handleDeleteProduct}
                    onAddPromotion={(p) => {
                      setPromoTargetProduct(p);
                      setIsAddPromotionOpen(true);
                    }}
                    onOpenChat={(shopId, shopName, shopPhone) => handleOpenChat(shopId, shopName, shopPhone)}
                    onPromotionExpired={handlePromotionExpired}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB: SHOP CATEGORIES DIRECTORY */}
        {activeTab === 'categories' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            
            {/* Categories Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Shop Categories
                </h3>
                <p className="text-xs text-neutral-500">
                  Click any category name to view registered shops ({categoriesDirectory.length} categories)
                </p>
              </div>
            </div>

            {/* Categories Listing as Buttons (No borders outline, no background fill, no arrow) */}
            {categoriesDirectory.length === 0 ? (
              <div className="text-center py-16 p-8 space-y-3">
                <Layers className="w-12 h-12 text-neutral-300 mx-auto" />
                <h4 className="text-base font-bold text-neutral-800">No matching categories found</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search query to see all available shop categories.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {categoriesDirectory.map((catGroup) => {
                  const isExpanded = expandedCategory === catGroup.name;
                  return (
                    <div key={catGroup.name} className="py-0.5">
                      {/* Category Name Button */}
                      <button
                        id={`category-btn-${catGroup.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => setExpandedCategory(isExpanded ? null : catGroup.name)}
                        className="w-full py-3 px-1 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                            catGroup.shopsCount > 0 ? 'bg-amber-600' : 'bg-neutral-300'
                          }`} />
                          <span className={`text-sm sm:text-base font-bold tracking-tight truncate transition-colors ${
                            isExpanded ? 'text-amber-700 font-extrabold' : 'text-neutral-800 group-hover:text-amber-700'
                          }`}>
                            {catGroup.name}
                          </span>
                        </div>

                        {/* Right Side: Number of shops in this category (No arrow) */}
                        <div className="flex items-center flex-shrink-0">
                          <span className={`text-xs font-bold transition-colors ${
                            catGroup.shopsCount > 0 ? 'text-amber-800 font-bold' : 'text-neutral-400 font-medium'
                          }`}>
                            {catGroup.shopsCount} {catGroup.shopsCount === 1 ? 'Shop' : 'Shops'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded: Shows shops in that category */}
                      {isExpanded && (
                        <div className="pb-4 pt-1 px-1 space-y-3 animate-in fade-in duration-200">
                          {catGroup.shops.length > 0 ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs text-neutral-600 px-0.5">
                                <span className="font-semibold text-neutral-700">
                                  Shops in {catGroup.name} ({catGroup.shops.length})
                                </span>
                                {catGroup.productsCount > 0 && (
                                  <button
                                    onClick={() => {
                                      setSelectedCategory(catGroup.name);
                                      setActiveTab('all');
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Browse {catGroup.productsCount} items in catalogue</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {catGroup.shops.map((shop) => {
                                  const shopProds = products.filter(p => p.shopId === shop.id);
                                  return (
                                    <div
                                      key={shop.id}
                                      className="bg-white rounded-2xl border border-neutral-200/90 p-4 transition-all duration-200 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs"
                                    >
                                      <div className="flex items-start gap-3">
                                        <img
                                          src={shop.logo}
                                          alt={shop.shopName}
                                          className="w-14 h-14 rounded-xl object-cover border border-neutral-200 flex-shrink-0 shadow-2xs"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-md">
                                              Shop #{shop.shopNumber}
                                            </span>
                                            <span className="text-xs text-neutral-400 font-medium truncate">
                                              by {shop.ownerName}
                                            </span>
                                          </div>
                                          <h5 className="text-sm font-bold text-neutral-900 truncate mt-0.5">
                                            {shop.shopName}
                                          </h5>
                                          <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5 leading-snug">
                                            {shop.caption}
                                          </p>
                                          <p className="text-[10.5px] text-neutral-500 mt-1 truncate">
                                            📍 {shop.address}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Shop products preview */}
                                      {shopProds.length > 0 && (
                                        <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-neutral-100 pt-2">
                                          <span className="text-[9px] text-neutral-400 font-bold uppercase flex-shrink-0">
                                            Items ({shopProds.length}):
                                          </span>
                                          {shopProds.slice(0, 3).map((p) => (
                                            <div
                                              key={p.id}
                                              onClick={() => setSelectedProduct(p)}
                                              className="w-9 h-9 rounded-lg overflow-hidden border border-neutral-200 cursor-pointer flex-shrink-0 hover:scale-105 transition-all"
                                              title={p.title}
                                            >
                                              <img src={p.heroImage} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                          ))}
                                          {shopProds.length > 3 && (
                                            <span className="text-[10px] text-amber-700 font-bold px-1.5 py-0.5 bg-amber-50 rounded-lg">
                                              +{shopProds.length - 3} more
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Shop action buttons */}
                                      <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5 gap-2">
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={`tel:${shop.phone}`}
                                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                                            title="Call merchant"
                                          >
                                            <Phone className="w-3.5 h-3.5" />
                                          </a>
                                          <button
                                            onClick={() => handleOpenChat(shop.id, shop.shopName, shop.phone)}
                                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                          >
                                            <MessageSquare className="w-3 h-3" />
                                            <span>Chat</span>
                                          </button>
                                        </div>

                                        <button
                                          onClick={() => {
                                            setSelectedCategory(catGroup.name);
                                            setActiveTab('all');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>Browse Shop</span>
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="py-2.5 px-1 text-left">
                              <p className="text-xs text-neutral-500 italic">
                                No shops currently registered under {catGroup.name}.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECENT ARRIVALS (72 HOURS) */}
        {activeTab === 'recent' && (
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-yellow-700 rounded-3xl text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Recent Product Listings (Within 72 Hours)</h3>
                  <p className="text-xs text-amber-200">
                    Fresh stock added by local merchants in the last 3 days
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-white text-amber-950 rounded-full shadow-2xs">
                {filteredProducts.length} Fresh Items
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  user={user}
                  selectedCountry={selectedCountry}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                  onEditProduct={(p) => {
                    setEditingProduct(p);
                    setIsAddProductOpen(true);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                  onAddPromotion={(p) => {
                    setPromoTargetProduct(p);
                    setIsAddPromotionOpen(true);
                  }}
                  onOpenChat={(shopId, shopName, shopPhone) => handleOpenChat(shopId, shopName, shopPhone)}
                  onPromotionExpired={handlePromotionExpired}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROMOTIONS (LIVE FLASH DEALS) */}
        {activeTab === 'promotions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 rounded-3xl text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Promotions & Flash Deals</h3>
                  <p className="text-xs text-rose-200">
                    Live promotional discounts with real-time countdown timer
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 bg-white text-rose-950 rounded-full shadow-2xs">
                {filteredProducts.length} Active {filteredProducts.length === 1 ? 'Promotion' : 'Promotions'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
                <Flame className="w-12 h-12 text-neutral-300 mx-auto" />
                <h4 className="text-base font-bold text-neutral-800">No active promotions right now</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  {user.isShopOwner
                    ? 'Boost your shop sales by launching a promotion with a countdown timer from your shop or product card!'
                    : 'Check back soon or browse our full catalogue for the latest deals and products.'}
                </p>
                {user.isShopOwner ? (
                  <button
                    onClick={() => setIsMyShopOpen(true)}
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Manage My Shop Promotions
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('all')}
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Browse All Products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    user={user}
                    selectedCountry={selectedCountry}
                    onSelectProduct={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onBuyNow={(p) => handleBuyNow(p, 1)}
                    onEditProduct={(p) => {
                      setEditingProduct(p);
                      setIsAddProductOpen(true);
                    }}
                    onDeleteProduct={handleDeleteProduct}
                    onAddPromotion={(p) => {
                      setPromoTargetProduct(p);
                      setIsAddPromotionOpen(true);
                    }}
                    onOpenChat={(shopId, shopName, shopPhone) => handleOpenChat(shopId, shopName, shopPhone)}
                    onPromotionExpired={handlePromotionExpired}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VERIFIED SHOPS DIRECTORY */}
        {activeTab === 'shops' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Verified Merchant Directory</h3>
                <p className="text-xs text-neutral-500">
                  Tap any shop button to view its available product profiles and catalogue ({filteredShops.length} stores)
                </p>
              </div>
            </div>

            {filteredShops.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
                <Store className="w-12 h-12 text-neutral-300 mx-auto" />
                <h4 className="text-base font-bold text-neutral-800">No shops found</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your search query to see all registered merchant storefronts.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredShops.map((shop) => {
                  const shopProds = products.filter(p => p.shopId === shop.id);
                  const isExpanded = expandedShopId === shop.id;

                  return (
                    <div
                      key={shop.id}
                      className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Active Shop Button (Only Shop name in bold + Brief business description in small font) */}
                      <button
                        id={`shop-btn-${shop.id}`}
                        onClick={() => setExpandedShopId(isExpanded ? null : shop.id)}
                        className="w-full text-left p-5 flex flex-col justify-between transition-colors hover:bg-amber-50/20 cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            {/* Shop Name in Bold */}
                            <h4 className="text-base font-bold text-neutral-900 leading-snug truncate">
                              {shop.shopName}
                            </h4>
                            
                            {/* Brief Description in Small Font */}
                            <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                              {shop.caption || `Certified merchant offering quality goods and prompt delivery in ${shop.category}.`}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                              {shopProds.length} Items
                            </span>
                            <span className="text-xs text-neutral-400 font-bold">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-amber-800 font-bold pt-1 border-t border-neutral-100">
                          <span>{shop.category}</span>
                          <span className="underline text-[11px]">
                            {isExpanded ? 'Close Products' : 'Open Product Profiles'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Shop's Available Product Profiles */}
                      {isExpanded && (
                        <div className="bg-neutral-50/90 p-4 border-t border-neutral-200 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                              {shop.shopName} — Available Products ({shopProds.length})
                            </h5>
                          </div>

                          {shopProds.length === 0 ? (
                            <p className="text-xs text-neutral-400 py-3 text-center">
                              No products listed yet in this shop.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {shopProds.map((prod) => (
                                <div
                                  key={prod.id}
                                  onClick={() => setSelectedProduct(prod)}
                                  className="bg-white p-2.5 rounded-2xl border border-neutral-200 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                                >
                                  <img
                                    src={prod.heroImage}
                                    alt={prod.title}
                                    className="w-14 h-14 rounded-xl object-cover border border-neutral-100 flex-shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h6 className="text-xs font-bold text-neutral-900 truncate">
                                      {prod.title}
                                    </h6>
                                    <p className="text-xs font-black text-amber-900 mt-0.5">
                                      {formatPrice(prod.price, selectedCountry)}
                                    </p>
                                    <span className="text-[10px] text-blue-600 font-semibold block">
                                      Tap to view details & buy
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ABOUT ME (MY PROFILE & MERCHANT PORTAL) */}
        {activeTab === 'about_me' && (
          <div className="space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-900">{user.fullName}</h3>
                    {user.isShopOwner && (
                      <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full border border-amber-300">
                        Merchant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">@{user.username} • {user.country}</p>
                  <p className="text-xs text-neutral-600 mt-0.5">{user.phone} • {user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
                {user.isShopOwner ? (
                  <button
                    onClick={() => setIsMyShopOpen(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>My Shop</span>
                  </button>
                ) : (
                  <button
                    id="profile-open-shop-main-btn"
                    onClick={() => setIsOpenShopModalOpen(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    <span>Open Shop</span>
                  </button>
                )}
              </div>
            </div>

            {/* Merchant Status Banner in My Profile (For non-owners) */}
            {!user.isShopOwner && (
              <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-amber-600/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-amber-300" />
                      <span>Merchant Registration</span>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Open Your Verified Shop on Eastern Online Store
                  </h3>
                  <p className="text-xs text-amber-100/90 max-w-xl">
                    Register your business, upload products with up to 5 photos, run live per-second discount deals, and start accepting instant mobile money payments today.
                  </p>
                </div>

                <button
                  id="profile-open-shop-banner-btn"
                  onClick={() => setIsOpenShopModalOpen(true)}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 flex-shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Shop Now</span>
                </button>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Cart Items Pending</span>
                <div className="text-xl font-bold text-neutral-900 mt-1">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Saved Bank Cards</span>
                <div className="text-xl font-bold text-neutral-900 mt-1">
                  {user.savedCards?.length || 0}/5 Cards
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Active Ads</span>
                <div className="text-xl font-bold text-amber-700 mt-1">
                  {ads.filter(a => a.creatorId === user.id && a.status === 'active').length} Live
                </div>
              </div>
            </div>

            {/* UPDATE CURRENCY SECTION */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Select Currency</h3>
                    <p className="text-xs text-neutral-500">
                      Click the box below to expand optional currencies for automatic price conversion
                    </p>
                  </div>
                </div>
              </div>

              {/* Single Select Box that stretches out once clicked */}
              <CurrencySelector
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
                variant="card"
              />
            </div>

          </div>
        )}

      </main>

      {/* Floating Bottom Navigation */}
      <FooterNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        pendingCount={cart.length}
        recentCount={recentCount}
        promotionsCount={activePromoCount}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        onOpenSettings={() => setIsEditProfileOpen(true)}
        onOpenAboutApp={() => setIsAboutAppOpen(true)}
        onOpenAdsHub={() => setIsAdsHubOpen(true)}
        onOpenOpenShop={() => setIsOpenShopModalOpen(true)}
        onOpenMyShop={() => setIsMyShopOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        user={user}
        currentTheme={currentTheme}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          user={user}
          selectedCountry={selectedCountry}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenChat={(shopId, shopName, shopPhone) => handleOpenChat(shopId, shopName, shopPhone)}
          onEditProduct={(p) => {
            setEditingProduct(p);
            setSelectedProduct(null);
            setIsAddProductOpen(true);
          }}
          onDeleteProduct={handleDeleteProduct}
          onAddPromotion={(p) => {
            setPromoTargetProduct(p);
            setSelectedProduct(null);
            setIsAddPromotionOpen(true);
          }}
        />
      )}

      {/* Initial / Edit Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSaveUser={handleSaveUser}
        currentUser={user}
      />

      {/* Open Shop Modal */}
      <OpenShopModal
        isOpen={isOpenShopModalOpen}
        onClose={() => setIsOpenShopModalOpen(false)}
        user={user}
        onRegisterShop={handleRegisterShop}
      />

      {/* My Shop Portal (Security Password Protected) */}
      <MyShopPortal
        isOpen={isMyShopOpen}
        onClose={() => setIsMyShopOpen(false)}
        shop={userShop}
        products={products}
        user={user}
        selectedCountry={selectedCountry}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        onOpenAddPromotion={(prod) => {
          setPromoTargetProduct(prod || null);
          setIsAddPromotionOpen(true);
        }}
        onEditProduct={(p) => {
          setEditingProduct(p);
          setIsAddProductOpen(true);
        }}
        onDeleteProduct={handleDeleteProduct}
        onAddNotification={addNotification}
        onUpdateShop={handleUpdateShop}
      />

      {/* Add / Edit Product Modal (1 Caption + 4 Gallery Photos) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        shop={userShop}
        onSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Add Discount Promotion Modal */}
      <AddPromotionModal
        isOpen={isAddPromotionOpen}
        onClose={() => {
          setIsAddPromotionOpen(false);
          setPromoTargetProduct(null);
        }}
        shop={userShop}
        products={products}
        selectedProduct={promoTargetProduct}
        onApplyPromotion={handleApplyPromotion}
      />

      {/* Advertisements Hub Modal (Packages K5, K8, K15, K24, Colors, Media) */}
      <AdvertisementsModal
        isOpen={isAdsHubOpen}
        onClose={() => setIsAdsHubOpen(false)}
        user={user}
        ads={ads}
        onCreateAd={handleCreateAd}
        onActivateAd={handleActivateAd}
        onDeleteAd={handleDeleteAd}
        onViewAdProfile={(ad) => setViewingAdProfile(ad)}
      />

      {/* 5-Minute Random Ad Popup with Disabled-for-3s X Button */}
      {popupAd && (
        <AdPopup
          ad={popupAd}
          onClose={() => setPopupAd(null)}
          onOpenForMore={(ad) => {
            setPopupAd(null);
            setViewingAdProfile(ad);
          }}
        />
      )}

      {/* Ad Profile Modal (Dull black text, Bold Contact buttons) */}
      <AdProfileModal
        isOpen={!!viewingAdProfile}
        onClose={() => setViewingAdProfile(null)}
        ad={viewingAdProfile}
      />

      {/* Cart Modal with Tabbed (Pending Payment vs Waiting Delivery) */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        orders={orders}
        user={user}
        selectedCountry={selectedCountry}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={(selectedItems) => {
          setCheckoutCartItems(selectedItems);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onUpdateOrderStage={handleUpdateOrderStage}
        onDeleteOrder={handleDeleteOrder}
        onOpenChat={(shopId, shopName, shopPhone) => handleOpenChat(shopId, shopName, shopPhone)}
      />

      {/* Checkout Modal (Sequence Order 001-1001-0001, Mobile Money, Saved Credit Cards) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutCartItems([]);
        }}
        cart={checkoutCartItems.length > 0 ? checkoutCartItems : cart}
        user={user}
        shops={shops}
        selectedCountry={selectedCountry}
        onCompleteOrder={(order, updatedUserCards) => {
          handleCompleteOrder(order, updatedUserCards);
          setCheckoutCartItems([]);
        }}
      />

      {/* Official SMS Quote Receipt Modal */}
      <ReceiptModal
        isOpen={!!latestOrder}
        onClose={() => setLatestOrder(null)}
        order={latestOrder}
      />

      {/* End-to-End Encrypted Chat Drawer */}
      {activeChatShop && (
        <ChatDrawer
          isOpen={!!activeChatShop}
          onClose={() => setActiveChatShop(null)}
          shopId={activeChatShop.id}
          shopName={activeChatShop.name}
          shopPhone={activeChatShop.phone}
          currentUser={user}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onLikeMessage={handleLikeMessage}
        />
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        selectedCountry={selectedCountry}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenMyShop={() => setIsMyShopOpen(true)}
        onOpenOpenShop={() => setIsOpenShopModalOpen(true)}
        onDeletePreviousShopping={(id) => {
          setUser(u => ({
            ...u,
            previousShoppings: u.previousShoppings.filter(p => p.id !== id),
          }));
        }}
        onDeleteCard={(cardId) => {
          setUser(u => ({
            ...u,
            savedCards: u.savedCards.filter(c => c.id !== cardId),
          }));
        }}
        onAddCard={(newCard) => {
          setUser(u => ({
            ...u,
            savedCards: [...u.savedCards, { ...newCard, id: `card_${Date.now()}` }],
          }));
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSaveProfile={handleSaveUser}
      />

      {/* About App Modal (v1.0.0, Company Rules & Regulations) */}
      <AboutAppModal
        isOpen={isAboutAppOpen}
        onClose={() => setIsAboutAppOpen(false)}
      />

      {/* Appearance & Themes Modal */}
      <AppearanceModal
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(theme) => setCurrentTheme(theme)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onClearNotifications={() => setNotifications([])}
      />

    </div>
  );
}
