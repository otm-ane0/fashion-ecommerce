import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlist, isLoggedIn } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'New Arrivals', path: '/shop?new=true' },
    { name: 'Women', path: '/shop?category=women' },
    { name: 'Men', path: '/shop?category=men' },
    { name: 'Accessories', path: '/shop?category=accessories' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-fashion',
          isScrolled || searchOpen || mobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2 hover:opacity-60 transition-opacity"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-[13px] font-medium tracking-wide uppercase text-neutral-800 hover:text-neutral-500 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-semibold tracking-[0.2em] uppercase text-neutral-950 hover:opacity-70 transition-opacity"
            >
              Maison
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link
                to={isLoggedIn ? '/account' : '/login'}
                className="hidden md:flex p-2 hover:opacity-60 transition-opacity"
                aria-label="Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link
                to="/account#wishlist"
                className="hidden md:flex relative p-2 hover:opacity-60 transition-opacity"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative p-2 hover:opacity-60 transition-opacity"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neutral-900 text-white text-[10px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden border-t border-neutral-100 bg-white"
            >
              <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6">
                <form onSubmit={handleSearch} className="flex items-center gap-4">
                  <Search size={20} strokeWidth={1.5} className="text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-lg outline-none placeholder:text-neutral-300 bg-transparent"
                    autoFocus
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden border-t border-neutral-100 bg-white"
            >
              <nav className="flex flex-col px-6 py-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-medium tracking-wide uppercase text-neutral-800 hover:text-neutral-500 transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-neutral-100 pt-4 mt-2 flex flex-col gap-4">
                  <Link to={isLoggedIn ? '/account' : '/login'} className="flex items-center gap-3 text-sm text-neutral-800">
                    <User size={18} strokeWidth={1.5} /> Account
                  </Link>
                  <Link to="/account#wishlist" className="flex items-center gap-3 text-sm text-neutral-800">
                    <Heart size={18} strokeWidth={1.5} /> Wishlist ({wishlist.length})
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1">
              <Link to="/" className="text-xl font-semibold tracking-[0.2em] uppercase text-white block mb-6">
                Maison
              </Link>
              <p className="text-sm leading-relaxed">
                A curated selection of timeless pieces for the modern wardrobe. Designed for longevity, not seasons.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-6">Shop</h4>
              <ul className="space-y-3">
                {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/shop${item === 'New Arrivals' ? '?new=true' : item === 'Sale' ? '?sale=true' : `?category=${item.toLowerCase()}`}`}
                      className="text-sm hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-6">Help</h4>
              <ul className="space-y-3">
                {['Shipping & Returns', 'Size Guide', 'Care Instructions', 'Contact Us', 'FAQ'].map((item) => (
                  <li key={item}>
                    <span className="text-sm hover:text-white transition-colors duration-300 cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Subscribe for early access to new collections and exclusive offers.</p>
              <div className="flex border-b border-neutral-700 pb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-neutral-600 text-white"
                />
                <button className="text-xs uppercase tracking-widest text-white hover:text-neutral-300 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Maison. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
