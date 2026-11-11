import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import QubiCompanion from '@/components/QubiCompanion';
import QuantumIntro from '@/components/QuantumIntro';
import GuidedTour from '@/components/GuidedTour';
import { useStore } from '@/store/useStore';

export default function Layout({ children }: { children: ReactNode }) {
  const theme = useStore((state) => state.theme);
  const reduceMotion = useStore((state) => state.reduceMotion);
  const setReduceMotion = useStore((state) => state.setReduceMotion);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [setReduceMotion]);

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash, reduceMotion]);

  return (
    <div className="site-atmosphere bureau-site min-h-screen bg-canvas text-ink">
      <a href="#main" className="bureau-skip-link">Skip to main content</a>
      <Nav />
      <main id="main" tabIndex={-1} className="bureau-main">{children}</main>
      <Footer />
      <QubiCompanion />
      <GuidedTour />
      <QuantumIntro />
    </div>
  );
}
