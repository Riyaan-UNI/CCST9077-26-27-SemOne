import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  /*
   * Deployment base.
   *   - Vercel / Netlify / any root-served host: leave unset ('/').
   *   - GitHub Pages project site (served from /<repo-name>/): the deploy
   *     workflow sets VITE_BASE=/<repo-name>/ so every asset URL is absolute
   *     and therefore correct at any route depth.
   */
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    strictPort: true,
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'charts';
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
