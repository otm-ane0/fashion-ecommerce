import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -16,
  },
};

const pageTransition = {
  ease: 'easeOut',
  duration: 0.35,
};

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition as any}
      className={className}
    >
      {children}
    </motion.div>
  );
}
