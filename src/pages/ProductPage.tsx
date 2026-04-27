import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist } = useStore();

  const product = products.find((p) => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedImage(0);
      setQuantity(1);
      setAddedToCart(false);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <PageTransition>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-32 text-center">
          <h1 className="text-2xl font-light mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm font-medium tracking-widest uppercase underline underline-offset-4"
          >
            Back to Shop
          </button>
        </div>
      </PageTransition>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-neutral-500 mb-8 md:mb-12"
        >
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <ChevronRight size={12} strokeWidth={1.5} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-neutral-900 transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={12} strokeWidth={1.5} />
          <span className="text-neutral-900">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onLoad={() => setImageLoading(false)}
                  className={cn('w-full h-full object-cover', imageLoading && 'opacity-0')}
                />
              </AnimatePresence>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImageLoading(true);
                    setSelectedImage(idx);
                  }}
                  className={cn(
                    'relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-colors',
                    selectedImage === idx ? 'border-neutral-900' : 'border-transparent'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-2">
                  {product.subcategory}
                </p>
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">{product.name}</h1>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  'p-2 transition-colors',
                  wishlist.includes(product.id) ? 'text-red-500' : 'text-neutral-400 hover:text-neutral-900'
                )}
              >
                <Heart
                  size={22}
                  strokeWidth={1.5}
                  fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <p className="text-xl font-light mb-8">{formatPrice(product.price)}</p>

            <div className="space-y-8">
              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase">Color</span>
                  <span className="text-sm text-neutral-600">{selectedColor}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all duration-200 relative',
                        selectedColor === color.name ? 'border-neutral-900 scale-110' : 'border-transparent hover:scale-105'
                      )}
                      style={{
                        backgroundColor: color.hex,
                        outline: color.name === 'White' || color.name === 'Ivory' ? '1px solid #e5e5e5' : 'none',
                      }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full',
                              color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#F5F5DC' || color.hex === '#F7E7CE'
                                ? 'bg-neutral-900'
                                : 'bg-white'
                            )}
                          />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase">Size</span>
                  <button className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[48px] px-3 py-2.5 text-sm border transition-all duration-200',
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-3">
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.15em] uppercase transition-all duration-300',
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={16} strokeWidth={1.5} />
                        Added to Bag
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={16} strokeWidth={1.5} />
                        Add to Bag
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-10 pt-10 border-t border-neutral-200">
              <h3 className="text-xs font-semibold tracking-widest uppercase mb-4">Description</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details Accordion-ish */}
            <div className="mt-6 pt-6 border-t border-neutral-200 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Material</span>
                <span>Premium Quality</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span>Free worldwide</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
