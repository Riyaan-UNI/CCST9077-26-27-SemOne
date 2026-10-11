import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from '@/components/Layout';
import RouteFallback from '@/components/RouteFallback';
import Home from '@/pages/Home';

/* Route-level code splitting keeps the first paint small. */
const Lab = lazy(() => import('@/pages/Lab'));
const Gallery = lazy(() => import('@/pages/GalleryPage'));
const Videos = lazy(() => import('@/pages/Videos'));
const Team = lazy(() => import('@/pages/Team'));
const Timeline = lazy(() => import('@/pages/Timeline'));
const CourseMap = lazy(() => import('@/pages/CourseMap'));
const Computer = lazy(() => import('@/pages/Computer'));
const UniverseComputer = lazy(() => import('@/pages/UniverseComputer'));
const Glossary = lazy(() => import('@/pages/Glossary'));
const Delight = lazy(() => import('@/pages/Delight'));
const Credits = lazy(() => import('@/pages/Credits'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/team" element={<Team />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/course-map" element={<CourseMap />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/computer" element={<Computer />} />
            <Route path="/universe-computer" element={<UniverseComputer />} />
            <Route path="/delight" element={<Delight />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}
