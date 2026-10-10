import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Package, 
  Tag, 
  Check, 
  Trash2, 
  AlertCircle,
  Plus,
  FolderOpen
} from 'lucide-react';
import { Product, Shop } from '../types';
import { BUSINESS_CATEGORIES } from '../data/countries';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onSaveProduct: (productData: Partial<Product>) => void;
  editingProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  shop,
  onSaveProduct,
  editingProduct,
}) => {
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [category, setCategory] = useState(editingProduct?.category || shop.category || BUSINESS_CATEGORIES[0]);
  const [price, setPrice] = useState(editingProduct ? editingProduct.price.toString() : '');
  const [stock, setStock] = useState(editingProduct ? editingProduct.stock.toString() : '10');
  
  // 1 Caption cover picture + up to 4 more gallery photos (max 5 images total)
  const [heroImage, setHeroImage] = useState(editingProduct?.heroImage || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    editingProduct?.galleryImages || (editingProduct?.heroImage ? [editingProduct.heroImage] : [])
  );

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDeviceFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (galleryImages.length + files.length > 5) {
      setError('You can add up to 5 photos maximum (1 caption + 4 gallery photos).');
    }

    const availableSlots = Math.max(0, 5 - galleryImages.length);
    const filesToProcess = files.slice(0, availableSlots);

    filesToProcess.forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setGalleryImages(prev => {
            if (prev.length >= 5 || prev.includes(result)) return prev;
            const updated = [...prev, result];
            if (!heroImage) setHeroImage(result);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomPhoto = () => {
    if (!customImageUrl.trim()) return;
    if (galleryImages.length >= 5) {
      setError('Maximum 5 photos allowed.');
      return;
    }
    setGalleryImages([...galleryImages, customImageUrl.trim()]);
    if (!heroImage) setHeroImage(customImageUrl.trim());
    setCustomImageUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    if (heroImage === galleryImages[index]) {
      setHeroImage(updated[0] || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    if (!title.trim() || !description.trim() || isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please fill in valid title, description, and price (ZMW).');
      return;
    }

    if (galleryImages.length === 0) {
      setError('Please add at least 1 caption photo for the product.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSaveProduct({
        id: editingProduct?.id,
        shopId: shop.id,
        shopName: shop.shopName,
        shopPhone: shop.phone,
        title: title.trim(),
        description: description.trim(),
        category,
        price: parsedPrice,
        originalPrice: editingProduct?.originalPrice || parsedPrice,
        currency: 'ZMW',
        heroImage: heroImage || galleryImages[0],
        galleryImages: galleryImages.length > 0 ? galleryImages : [heroImage],
        stock: isNaN(parsedStock) ? 10 : parsedStock,
        createdAt: editingProduct?.createdAt || Date.now(),
      });
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 to-amber-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo Management Wireframe */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Product Photos ({galleryImages.length}/5 Total: 1 Caption + 4 Gallery) *
              </label>
              <span className="text-[11px] text-amber-700 font-semibold">
                Click any thumbnail to set as Caption Cover
              </span>
            </div>

            {/* Current Attached Photos */}
            <div className="grid grid-cols-5 gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              {galleryImages.map((img, idx) => {
                const isCaptionCover = heroImage === img;
                return (
                  <div
                    key={idx}
                    onClick={() => setHeroImage(img)}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isCaptionCover ? 'border-amber-600 ring-2 ring-amber-400' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt={`Product photo ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    
                    {isCaptionCover && (
                      <span className="absolute top-1 left-1 bg-amber-600 text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-md shadow-xs">
                        CAPTION
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(idx);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Empty placeholder slots */}
              {Array.from({ length: Math.max(0, 5 - galleryImages.length) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 text-center p-1 bg-white"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-300 mb-1" />
                  <span className="text-[9px]">Photo {galleryImages.length + i + 1}</span>
                </div>
              ))}
            </div>

            {/* Hidden device file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleDeviceFiles}
            />

            {/* Device File Browser Actions with Open files button */}
            <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-amber-950 block">
                  Select Product Photos from Device
                </span>
                <span className="text-[11px] text-amber-800">
                  Upload up to 5 photos (first photo acts as main catalog caption)
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Open files</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-100 active:scale-95 text-neutral-800 text-xs font-semibold rounded-xl border border-neutral-300 shadow-2xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Browse Device</span>
                </button>
              </div>
            </div>

            {/* Custom URL or Direct Paste */}
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste external image URL (PNG, JPG, WebP)..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomPhoto}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-xl"
              >
                + Add URL
              </button>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pure Organic Miombo Wild Honey (1 Litre)"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden font-medium"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Available Stock Units *
              </label>
              <input
                type="number"
                min="1"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Price (ZMW) */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Retail Price (in Zambian Kwacha ZMW) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">K</span>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="160.00"
                className="w-full pl-8 pr-16 py-2 text-sm font-bold text-neutral-900 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">ZMW</span>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Product Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe product ingredients, dimensions, warranty, quality grade, and delivery instructions..."
              className="w-full p-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
