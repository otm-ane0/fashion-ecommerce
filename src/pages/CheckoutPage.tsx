import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Shield, Truck, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

const steps = ['Information', 'Shipping', 'Payment'];

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  shipping: 'standard' | 'express';
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  nameOnCard: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, isLoggedIn, user, clearCart } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    postalCode: '',
    phone: '',
    shipping: 'standard',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nameOnCard: '',
  });

  const shippingCost = formData.shipping === 'express' ? 15 : 0;
  const total = cartTotal + shippingCost;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/cart');
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setOrderComplete(true);
    setIsProcessing(false);
  };

  if (cart.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <PageTransition>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
              <Check size={32} strokeWidth={2} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-4">Thank You</h1>
            <p className="text-neutral-600 mb-2">Your order has been placed successfully.</p>
            <p className="text-sm text-neutral-500 mb-8">
              Order confirmation sent to {formData.email}
            </p>
            <div className="bg-neutral-50 p-6 mb-8 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Order Number</span>
                <span className="font-medium">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">Checkout</h1>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-12">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                  index < currentStep
                    ? 'bg-neutral-900 text-white'
                    : index === currentStep
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-400'
                )}
              >
                {index < currentStep ? <Check size={14} strokeWidth={2} /> : index + 1}
              </div>
              <span
                className={cn(
                  'ml-2 text-xs font-medium hidden sm:block',
                  index <= currentStep ? 'text-neutral-900' : 'text-neutral-400'
                )}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 md:w-16 h-px mx-4',
                    index < currentStep ? 'bg-neutral-900' : 'bg-neutral-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left: Forms */}
          <div>
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Contact Information</h2>
                  {!isLoggedIn && (
                    <p className="text-sm text-neutral-600 mb-4">
                      Already have an account?{' '}
                      <Link to="/login" className="underline hover:text-neutral-900 transition-colors">
                        Log in
                      </Link>
                    </p>
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm mt-4"
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => updateField('apartment', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm mt-4"
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={formData.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Phone (for delivery updates)"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm mt-4"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Shipping Method</h2>
                <div className="space-y-4">
                  <label
                    className={cn(
                      'flex items-center justify-between p-4 border cursor-pointer transition-colors',
                      formData.shipping === 'standard'
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shipping === 'standard'}
                        onChange={() => updateField('shipping', 'standard')}
                        className="w-4 h-4 accent-neutral-900"
                      />
                      <div>
                        <p className="text-sm font-medium">Standard Shipping</p>
                        <p className="text-xs text-neutral-500">5-7 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">Free</span>
                  </label>

                  <label
                    className={cn(
                      'flex items-center justify-between p-4 border cursor-pointer transition-colors',
                      formData.shipping === 'express'
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.shipping === 'express'}
                        onChange={() => updateField('shipping', 'express')}
                        className="w-4 h-4 accent-neutral-900"
                      />
                      <div>
                        <p className="text-sm font-medium">Express Shipping</p>
                        <p className="text-xs text-neutral-500">2-3 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(15)}</span>
                  </label>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Payment</h2>
                <div className="bg-neutral-50 p-4 mb-6 flex items-center gap-3">
                  <Shield size={18} strokeWidth={1.5} className="text-neutral-600" />
                  <span className="text-xs text-neutral-600">
                    Your payment is secured with industry-standard encryption
                  </span>
                </div>

                <div className="border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={20} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Credit Card</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Card number"
                    value={formData.cardNumber}
                    onChange={(e) => updateField('cardNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm mb-4"
                  />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={formData.expiryDate}
                      onChange={(e) => updateField('expiryDate', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={formData.cvc}
                      onChange={(e) => updateField('cvc', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={formData.nameOnCard}
                    onChange={(e) => updateField('nameOnCard', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-neutral-200 text-sm font-medium hover:border-neutral-900 transition-colors"
              >
                {currentStep === 0 ? 'Back to Cart' : 'Back'}
              </button>
              {currentStep < 2 ? (
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                </button>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-neutral-50 p-6 md:p-8 lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax</span>
                <span>Calculated</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-lg font-medium">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-neutral-200 text-xs text-neutral-500">
              <Truck size={16} strokeWidth={1.5} />
              <span>Free shipping on orders over $200</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
