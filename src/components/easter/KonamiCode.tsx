import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '@/store/useStore';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Konami code easter egg. Typing the classic sequence activates
 * "Many-Worlds mode": Qubi spawns copies that glitch away with
 * a no-cloning joke.
 */
export default function KonamiCode() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const react = useStore((s) => s.react);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[progress];
      if (e.key === expected) {
        const next = progress + 1;
        if (next >= KONAMI.length) {
          setActive(true);
          setProgress(0);
          react('dizzy', 'Many-Worlds mode activated! ...wait, that violates the no-cloning theorem.');
        } else {
          setProgress(next);
        }
      } else {
        setProgress(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [progress, react]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => setActive(false), 4000);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
      >
        <div className="text-center">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-4xl tracking-widest text-neon text-glow"
          >
            MANY-WORLDS MODE
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-hand text-xl text-muted"
          >
            "Wait — if I can spawn copies, the no-cloning theorem is broken!"
          </motion.p>
          {/* glitchy Qubi copies */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
              }}
              animate={{
                opacity: [1, 0.5, 0],
                x: (i - 2) * 80,
                y: -40 - Math.random() * 60,
                scale: [1, 1.1, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.15,
                ease: 'easeOut',
              }}
              className="absolute left-1/2 top-1/2 font-mono text-6xl text-neon"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              Q
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
