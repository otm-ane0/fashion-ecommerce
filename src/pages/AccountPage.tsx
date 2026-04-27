import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Heart, User, LogOut, ChevronRight, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'details', label: 'Account Details', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, products, wishlist, cart } = useStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!mounted || !user) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-2">My Account</h1>
          <p className="text-sm text-neutral-500 mb-10">
            Welcome back, {user.firstName}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 text-sm transition-colors',
                        activeTab === tab.id
                          ? 'bg-neutral-100 text-neutral-900'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} strokeWidth={1.5} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight size={14} strokeWidth={1.5} className="opacity-50" />
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-medium mb-6">Order History</h2>
                {user.orders?.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div key={order.id} className="border border-neutral-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium">Order #{order.id}</p>
                            <p className="text-xs text-neutral-500 mt-1">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider bg-green-100 text-green-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-neutral-200">
                    <Package size={32} strokeWidth={1} className="text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-4">No orders yet</p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-medium mb-6">My Wishlist ({wishlistProducts.length})</h2>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-neutral-200">
                    <Heart size={32} strokeWidth={1} className="text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-4">Your wishlist is empty</p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity"
                    >
                      Explore Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'details' && (
              <div>
                <h2 className="text-lg font-medium mb-6">Account Details</h2>
                <div className="max-w-md space-y-5">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-2">Name</label>
                    <input
                      type="text"
                      value={`${user.firstName} ${user.lastName}`}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-200 bg-neutral-50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-2">Password</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="password"
                        value="********"
                        readOnly
                        className="flex-1 px-4 py-3 border border-neutral-200 bg-neutral-50 text-sm"
                      />
                      <button className="text-xs font-medium underline underline-offset-4 hover:opacity-60 transition-opacity">
                        Change
                      </button>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-neutral-900 text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">Saved Addresses</h2>
                  <button className="text-xs font-medium underline underline-offset-4 hover:opacity-60 transition-opacity">
                    Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-neutral-100">Default</span>
                    </div>
                    <p className="font-medium mb-1">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-neutral-600">123 Fashion Street</p>
                    <p className="text-sm text-neutral-600">Apt 4B</p>
                    <p className="text-sm text-neutral-600">New York, NY 10001</p>
                    <p className="text-sm text-neutral-600">United States</p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-neutral-100">
                      <button className="text-xs underline underline-offset-4 hover:opacity-60 transition-opacity">
                        Edit
                      </button>
                      <button className="text-xs underline underline-offset-4 hover:opacity-60 transition-opacity text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
