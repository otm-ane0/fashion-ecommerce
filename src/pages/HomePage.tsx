import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import PageTransition from '../components/PageTransition';
import ProductCard from '../components/ProductCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function HomePage() {
  const { products } = useStore();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920"
            alt="Hero"
            className="w-full h-full object-cover object-[50%_30%]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-6"
          >
            Spring / Summer Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide max-w-3xl leading-tight mb-8"
          >
            The Art of Simplicity
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 text-xs font-medium tracking-[0.2em] uppercase hover:bg-neutral-100 transition-colors duration-300"
            >
              Explore Collection
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="flex flex-col items-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-xs font-medium tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Curated Selection
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-light text-center tracking-wide">
            Featured Products
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Editorial Banner */}
      <section className="relative bg-neutral-100">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[60vh] md:h-[80vh] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
              alt="Collection"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center px-8 md:px-20 py-16 md:py-0"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-neutral-500 mb-6">
              Timeless Design
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide leading-tight mb-8">
              Crafted for the Modern Individual
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-10 max-w-md">
              Our pieces are designed to transcend fleeting trends. Each garment is crafted with intention,
              using premium materials that feel as good as they look.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase border-b border-neutral-900 pb-1 w-fit hover:opacity-60 transition-opacity"
            >
              Discover More
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="flex flex-col items-center mb-16"
        >
          <motion.p variants={fadeInUp} className="text-xs font-medium tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Just Landed
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-light text-center tracking-wide mb-4">
            New Arrivals
          </motion.h2>
          <motion.div variants={fadeInUp}>
            <Link
              to="/shop?new=true"
              className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5"
            >
              View All
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {newArrivals.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </PageTransition>
  );
}
