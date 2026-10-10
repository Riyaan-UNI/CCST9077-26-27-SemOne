import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';

/** Standard page transition wrapper used by every route. */
export default function Page({ children }: { children: ReactNode }) {
  const reduceMotion = useStore((s) => s.reduceMotion);

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
