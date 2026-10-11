import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Eye, EyeOff, Menu, Moon, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nav, site } from '@/data/site';
import { isHkuBrand } from '@/config';
import { useStore } from '@/store/useStore';

function IconButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active}
          className={cn(
            'grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition',
            'hover:border-line-strong hover:text-neon',
            active && 'border-line-strong text-neon',
          )}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={8}
          className="z-50 rounded-md border border-line bg-elevated px-3 py-1.5 text-sm text-ink shadow-lift"
        >
          {label}
          <Tooltip.Arrow className="fill-[var(--elevated)]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function Nav() {
  const { theme, sound, observerMode, toggleTheme, toggleSound, toggleObserverMode } = useStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Tooltip.Provider delayDuration={250}>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            'border-b transition-colors duration-300',
            scrolled ? 'border-line bg-canvas/80 backdrop-blur-xl' : 'border-transparent bg-transparent',
          )}
        >
          <nav
            className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-5"
            aria-label="Primary"
          >
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-line-strong bg-[#070b09] font-mono text-lg leading-none text-neon">
                Q
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block font-display text-[15px] font-bold tracking-tight">
                  {site.courseTitle}
                </span>
                <span className="block text-xs uppercase tracking-[0.16em] text-muted">
                  {isHkuBrand ? `${site.course} · ${site.institution}` : 'Group project'}
                </span>
              </span>
            </Link>

            <ul className="ml-auto hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-elevated hover:text-neon',
                      location.pathname === item.href && 'text-neon',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-auto flex items-center gap-2 lg:ml-3">
              <IconButton
                label={observerMode ? 'Observer mode on — the field collapses' : 'Observer mode off'}
                onClick={toggleObserverMode}
                active={observerMode}
              >
                {observerMode ? <Eye size={16} /> : <EyeOff size={16} />}
              </IconButton>
              <IconButton label={sound ? 'Sound on' : 'Sound off'} onClick={toggleSound} active={sound}>
                {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </IconButton>
              <IconButton
                label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </IconButton>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft lg:hidden"
              >
                <Menu size={16} />
              </button>
            </div>
          </nav>
        </div>

        {/* scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-neon"
          aria-hidden="true"
        />
      </header>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-canvas/90 backdrop-blur-xl"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  className="fixed inset-y-0 right-0 z-[61] w-full max-w-sm border-l border-line bg-surface p-6"
                >
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="font-display text-lg">Navigate</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft"
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="sr-only">
                    Site navigation links
                  </Dialog.Description>
                  <ul className="mt-8 space-y-1">
                    {nav.map((item, i) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                      >
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-4 py-3 font-display text-2xl text-ink transition hover:bg-elevated hover:text-neon"
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  <p className="mt-10 font-hand text-xl text-muted">“{site.mascot.catchphrase}”</p>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </Tooltip.Provider>
  );
}
