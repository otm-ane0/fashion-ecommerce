import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    agreeTerms: false,
  });

  if (isLoggedIn) {
    navigate('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isSignUp) {
      if (!formData.agreeTerms) {
        setError('Please agree to the terms and conditions');
        setIsLoading(false);
        return;
      }
      const success = login(formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setTimeout(() => navigate('/account'), 1500);
      }
    } else {
      const success = login(formData.email, formData.password);
      if (success) {
        setSuccess(true);
        const from = (location.state as any)?.from?.pathname || '/account';
        setTimeout(() => navigate(from), 1500);
      } else {
        setError('Invalid email or password');
      }
    }
    setIsLoading(false);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-3">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-neutral-500">
              {isSignUp
                ? 'Create an account to track orders and save your favorites'
                : 'Sign in to access your account and orders'}
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 p-6 text-center rounded"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={24} strokeWidth={2} className="text-green-600" />
              </div>
              <p className="text-green-800 font-medium">
                {isSignUp ? 'Account created successfully!' : 'Welcome back!'}
              </p>
              <p className="text-sm text-green-600 mt-1">Redirecting...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
                  />
                </motion.div>
              )}

              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  minLength={4}
                  className="w-full px-4 py-3 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>

              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeTerms}
                    onChange={(e) => updateField('agreeTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 accent-neutral-900"
                  />
                  <label htmlFor="terms" className="text-xs text-neutral-600 leading-relaxed">
                    I agree to the{' '}
                    <span className="underline cursor-pointer hover:text-neutral-900">Terms of Service</span> and{' '}
                    <span className="underline cursor-pointer hover:text-neutral-900">Privacy Policy</span>
                  </label>
                </motion.div>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-neutral-600 underline hover:text-neutral-900 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-neutral-900 text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-neutral-400">or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    className="text-neutral-900 underline underline-offset-2 hover:no-underline transition-all"
                  >
                    {isSignUp ? 'Sign in' : 'Create one'}
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs font-medium mb-1">Secure Checkout</p>
                <p className="text-[10px] text-neutral-500">SSL Encrypted</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Free Shipping</p>
                <p className="text-[10px] text-neutral-500">On orders over $200</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Easy Returns</p>
                <p className="text-[10px] text-neutral-500">Within 30 days</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
