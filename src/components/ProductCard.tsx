import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const image = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
          <motion.img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {product.newArrival && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5">
              New
            </span>
          )}
          {product.bestseller && !product.newArrival && (
            <span className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-neutral-900 truncate hover:opacity-60 transition-opacity">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-neutral-500 mt-1">{formatPrice(product.price)}</p>
          <div className="flex gap-1.5 mt-2">
            {product.colors.map((color) => (
              <div
                key={color.name}
                className="w-3 h-3 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 transition-all duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-neutral-400 hover:text-neutral-900'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} strokeWidth={1.5} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
