import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

/* Self-hosted fonts — Latin subsets only, so no third-party requests and no
   unused Cyrillic/Devanagari payload. */
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/baloo-2/latin-500.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/vt323/latin-400.css';
import '@fontsource/caveat/latin-500.css';

import './index.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

/* When the app is served from a sub-path (e.g. a GitHub Pages project site at
   /CCST9077-26-27-SemOne/), the router must know that prefix or every route
   would 404. BASE_URL is '/' unless VITE_BASE is set at build time. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

/* Hand off from the static splash in index.html to the React app.
   Without this the splash sits on top of everything forever. */
const boot = document.getElementById('boot');
if (boot) {
  boot.classList.add('boot--done');
  window.setTimeout(() => boot.remove(), 400);
}
