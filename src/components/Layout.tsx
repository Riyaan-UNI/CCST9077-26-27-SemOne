import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import QubiCompanion from '@/components/QubiCompanion';
import { useStore } from '@/store/useStore';

export default function Layout({ children }: { children: ReactNode }) {
  const theme = useStore((s) => s.theme);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const setReduceMotion = useStore((s) => s.setReduceMotion);
  const location = useLocation();
  const [booted, setBooted] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('qubi-booted') === '1',
  );

  /* Apply the theme class to <html> so tokens flip globally. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
  }, [theme]);

  /* Track the OS reduced-motion preference. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setReduceMotion]);

  /* Optional smooth scrolling, off for reduced motion. */
  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.95 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduceMotion]);

  /* Start each route at the top (unless a hash target was requested). */
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash, reduceMotion]);

  return (
    <div className="relative min-h-screen bg-canvas">
      <a
        href="#main"
        className="sr-only-focusable focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-neon focus:px-4 focus:py-2 focus:text-neon-ink"
      >
        Skip to content
      </a>

      {!booted && !reduceMotion && (
        <LoadingScreen
          onDone={() => {
            sessionStorage.setItem('qubi-booted', '1');
            setBooted(true);
          }}
        />
      )}

      <Nav />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
      <QubiCompanion />
    </div>
  );
}
