import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import { formatPrice } from '../lib/utils';

export default function CartPage() {
  const { cart, cartTotal, cartCount, updateCartQuantity, removeFromCart } = useStore();

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-2">Shopping Bag</h1>
          <p className="text-sm text-neutral-500 mb-8">
            {cartCount === 0
              ? 'Your bag is empty'
              : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your bag`}
          </p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20 md:py-32 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <ShoppingBag size={28} strokeWidth={1.5} className="text-neutral-400" />
            </div>
            <h2 className="text-xl font-light mb-3">Your bag is empty</h2>
            <p className="text-sm text-neutral-500 mb-8 max-w-md">
              Discover our curated collection of timeless pieces designed for the modern wardrobe.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border-t border-neutral-200">
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="py-6 border-b border-neutral-200 grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-4 md:gap-6"
                    >
                      {/* Product Image */}
                      <Link to={`/product/${item.product.id}`} className="aspect-[3/4] bg-neutral-100 overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <Link
                              to={`/product/${item.product.id}`}
                              className="text-sm font-medium hover:opacity-60 transition-opacity"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-neutral-500 mt-1">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                            aria-label="Remove item"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-neutral-500 mb-4">
                          <span className="border border-neutral-200 px-2 py-1">{item.size}</span>
                          <span className="border border-neutral-200 px-2 py-1">{item.color}</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-neutral-200">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                              }
                              className="p-2 hover:bg-neutral-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                              }
                              className="p-2 hover:bg-neutral-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-24 lg:h-fit"
            >
              <div className="bg-neutral-50 p-6 md:p-8">
                <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-lg font-medium">{formatPrice(cartTotal)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>

                <Link
                  to="/shop"
                  className="flex items-center justify-center w-full py-4 text-xs font-medium tracking-[0.15em] uppercase text-neutral-600 hover:text-neutral-900 transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3 text-xs text-neutral-500">
                <Package size={16} strokeWidth={1.5} />
                <span>Free worldwide shipping on all orders</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
