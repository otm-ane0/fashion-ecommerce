import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const categories = [
  { label: 'All', value: '' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Accessories', value: 'accessories' },
];

const colorFilters = [
  { name: 'Black', hex: '#171717' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Burgundy', hex: '#800020' },
];

const sizeFilters = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export default function ShopPage() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const showNew = searchParams.get('new') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';
  const selectedColors = searchParams.getAll('color');
  const selectedSizes = searchParams.getAll('size');
  const priceMin = searchParams.get('min') || '';
  const priceMax = searchParams.get('max') || '';

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const toggleArrayParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll(key);
    if (current.includes(value)) {
      next.delete(key);
      current.filter((v) => v !== value).forEach((v) => next.append(key, v));
    } else {
      next.append(key, value);
    }
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (showNew) {
      result = result.filter((p) => p.newArrival);
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    }

    if (priceMin) {
      result = result.filter((p) => p.price >= Number(priceMin));
    }
    if (priceMax) {
      result = result.filter((p) => p.price <= Number(priceMax));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, category, showNew, selectedColors, selectedSizes, priceMin, priceMax, sortBy]);

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    category || searchQuery || showNew || selectedColors.length > 0 || selectedSizes.length > 0 || priceMin || priceMax;

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateParam('category', cat.value)}
              className={cn(
                'block text-sm transition-colors',
                category === cat.value ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-900'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Price</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => updateParam('min', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 outline-none focus:border-neutral-900 transition-colors"
          />
          <span className="text-neutral-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => updateParam('max', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-200 outline-none focus:border-neutral-900 transition-colors"
          />
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colorFilters.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleArrayParam('color', color.name)}
              className={cn(
                'w-6 h-6 rounded-full border-2 transition-all duration-200',
                selectedColors.includes(color.name)
                  ? 'border-neutral-900 scale-110'
                  : 'border-transparent hover:scale-105'
              )}
              style={{ backgroundColor: color.hex, outline: color.name === 'White' ? '1px solid #e5e5e5' : 'none' }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-semibold tracking-widest uppercase mb-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizeFilters.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayParam('size', size)}
              className={cn(
                'min-w-[40px] px-2.5 py-1.5 text-xs border transition-all duration-200',
                selectedSizes.includes(size)
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs font-medium tracking-widest uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide">
              {searchQuery ? `Search: "${searchQuery}"` : showNew ? 'New Arrivals' : category ? categories.find((c) => c.value === category)?.label : 'All Products'}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-sm font-medium"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filter
            </button>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                Sort by: {sortOptions.find((s) => s.value === sortBy)?.label}
                <ChevronDown size={14} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg z-20 min-w-[200px]"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateParam('sort', option.value);
                          setSortOpen(false);
                        }}
                        className={cn(
                          'block w-full text-left px-4 py-3 text-sm transition-colors',
                          sortBy === option.value ? 'bg-neutral-50 font-medium' : 'hover:bg-neutral-50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <FilterContent />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <motion.div
              layout
              className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <p className="text-lg text-neutral-500 mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium tracking-widest uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-white z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
