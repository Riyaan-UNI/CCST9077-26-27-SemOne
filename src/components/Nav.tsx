import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Eye, EyeOff, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { nav, site } from '@/data/site';
import { useStore } from '@/store/useStore';
import { useProgression } from '@/features/progression/ProgressionProvider';

export default function Nav() {
  const { theme, toggleTheme, reduceMotion } = useStore();
  const startTour = useStore((state) => state.startTour);
  const replayIntro = useStore((state) => state.replayIntro);
  const location = useLocation();
  const { progress, dispatch } = useProgression();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) => href === '/'
    ? location.pathname === '/'
    : location.pathname === href || (href === '/cases' && location.pathname.startsWith('/cases/'));

  const links = (mobile = false) => nav.map((item) => (
    <li key={item.href}>
      <Link
        to={item.href}
        onClick={() => mobile && setOpen(false)}
        aria-current={isCurrent(item.href) ? 'page' : undefined}
        className={mobile ? 'bureau-mobile-link' : `bureau-nav-link${isCurrent(item.href) ? ' is-current' : ''}`}
      >
        {item.label}
        {mobile && <span aria-hidden="true">↗</span>}
      </Link>
    </li>
  ));

  return (
    <>
      <header className="bureau-header">
        <nav className="bureau-nav" aria-label="Primary">
          <Link to="/" className="bureau-brand" aria-label={`${site.title} — Public Registry`}>
            <span className="bureau-seal" aria-hidden="true">Q</span>
            <span><strong>Quantum Lost-and-Found Bureau</strong><small>CCST9077 / public archive</small></span>
          </Link>

          <ul className="bureau-nav-links">{links()}</ul>

          <div className="bureau-nav-controls">
            <button
              type="button"
              className="bureau-icon-button observer-toggle"
              aria-pressed={progress.observerMode}
              aria-label={progress.observerMode ? 'Turn Observer Mode off' : 'Turn Observer Mode on'}
              title="Observer Mode: read without game progression"
              onClick={() => dispatch({ type: 'setObserverMode', value: !progress.observerMode })}
            >
              {progress.observerMode ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
              <span className="observer-toggle-label">Observer</span>
            </button>
            <button
              type="button"
              className="bureau-icon-button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button type="button" className="bureau-icon-button bureau-menu-trigger" aria-label="Open site menu">
                  <Menu size={20} aria-hidden="true" />
                </button>
              </Dialog.Trigger>
              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div
                        className="bureau-menu-overlay"
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.16 }}
                      />
                    </Dialog.Overlay>
                    <Dialog.Content asChild>
                      <motion.aside
                        className="bureau-mobile-menu"
                        initial={reduceMotion ? false : { x: '100%' }}
                        animate={{ x: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30 }}
                      >
                        <div className="bureau-mobile-menu-head">
                          <div><Dialog.Title>Public register</Dialog.Title><Dialog.Description>Choose a bureau file or reference section.</Dialog.Description></div>
                          <Dialog.Close asChild><button type="button" className="bureau-icon-button" aria-label="Close site menu"><X size={19} aria-hidden="true" /></button></Dialog.Close>
                        </div>
                        <nav className="bureau-mobile-menu-scroll" aria-label="Site menu" tabIndex={0}>
                          <ul>{links(true)}</ul>
                          <div className="bureau-menu-guides" aria-label="Visitor guides">
                            <Link to="/#site-index" onClick={() => setOpen(false)} className="bureau-mobile-link">Explore all pages <span aria-hidden="true">↗</span></Link>
                            <button type="button" className="bureau-mobile-link" onClick={() => { setOpen(false); startTour(); }}>Take Qubi’s guided tour <span aria-hidden="true">↗</span></button>
                            <button type="button" className="bureau-mobile-link" onClick={() => { setOpen(false); replayIntro(); }}>Replay the opening <span aria-hidden="true">↗</span></button>
                          </div>
                          <p className="bureau-mobile-menu-note">Qubi is keeping the files in order.</p>
                        </nav>
                      </motion.aside>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </nav>
        <div className="bureau-header-rule" aria-hidden="true"><span /></div>
      </header>
    </>
  );
}
