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
            'control-surface grid h-11 w-11 place-items-center text-ink-soft transition',
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
  const { theme, sound, observerMode, reduceMotion, toggleTheme, toggleSound, toggleObserverMode } = useStore();
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/92 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:px-5">
        <div
          className={cn(
            'mx-auto max-w-7xl border-x transition-[background-color,border-color] duration-300',
            scrolled ? 'border-line-strong bg-canvas/95' : 'border-transparent bg-canvas/70',
          )}
        >
          <nav
            className="mx-auto flex min-h-[4.5rem] w-full items-center gap-3 px-3 sm:px-5"
            aria-label="Primary"
          >
            <Link to="/" className="group flex items-center gap-2.5">
              <span className="relative grid h-11 w-11 place-items-center border border-line-strong bg-elevated font-mono text-2xl leading-none text-neon">
                Q
                <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-cyan" aria-hidden="true" />
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block font-display text-[15px] font-bold tracking-tight">
                  Qubi's Quantum Playground
                </span>
                <span className="block text-xs text-muted">
                  {isHkuBrand ? `${site.course} · ${site.institution}` : site.course}
                </span>
              </span>
            </Link>

            <ul className="ml-auto hidden items-center gap-0.5 overflow-x-auto scrollbar-hidden lg:flex">
              {nav.map((item) => (
                <li key={item.href} className="shrink-0">
                  <Link
                    to={item.href}
                    className={cn(
                      'block whitespace-nowrap border-b-2 border-transparent px-2.5 py-2.5 text-[13px] text-ink-soft transition hover:border-cyan hover:text-ink focus-visible:text-neon',
                      location.pathname === item.href && 'border-neon text-neon',
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
                className="control-surface grid h-11 w-11 place-items-center text-ink-soft lg:hidden"
              >
                <Menu size={16} />
              </button>
            </div>
          </nav>
        </div>

        {/* scroll progress */}
        <motion.div
          style={{ scaleX: reduceMotion ? scrollYProgress : progress }}
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
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
                  className="fixed inset-0 z-[60] bg-canvas/55 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={reduceMotion ? false : { x: '100%' }}
                  animate={{ x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
                  className="fixed right-0 top-0 z-[61] flex h-dvh max-h-[100dvh] w-full max-w-sm flex-col overflow-hidden border-l-2 border-cyan bg-surface p-5 pt-[max(1.25rem,env(safe-area-inset-top))] shadow-lift sm:p-6"
                >
                  <div className="flex shrink-0 items-center justify-between">
                    <Dialog.Title className="font-display text-lg">Navigate</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="control-surface grid h-11 w-11 place-items-center text-ink-soft"
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="sr-only">
                    Site navigation links
                  </Dialog.Description>
                  <div
                    data-testid="mobile-menu-scroll"
                    role="region"
                    aria-label="Site navigation"
                    tabIndex={0}
                    data-lenis-prevent
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y pb-[max(1rem,env(safe-area-inset-bottom))]"
                  >
                    <ul className="mt-8 border-t border-line">
                      {nav.map((item, i) => (
                        <motion.li
                          key={item.href}
                          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={reduceMotion ? { duration: 0 } : { delay: 0.05 + i * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setOpen(false)}
                            className="flex min-h-14 items-center justify-between border-b border-line px-3 py-3 font-display text-xl text-ink transition hover:border-cyan hover:text-neon"
                          >
                            {item.label}
                            <span className="font-mono text-sm text-muted" aria-hidden="true">
                              ↗
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                    <p className="mt-10 pb-2 font-hand text-xl text-muted">
                      “{site.mascot.catchphrase}”
                    </p>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </Tooltip.Provider>
  );
}
