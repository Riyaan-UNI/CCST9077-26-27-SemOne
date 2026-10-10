import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Fade-and-rise on first scroll into view. Respects reduced-motion. */
export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduceMotion = useStore((s) => s.reduceMotion);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
