import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end and accessibility checks.
 *
 * The dev server is started automatically; if one is already running on 5173 it
 * is reused. Run with:  npm run test:e2e
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  timeout: 45_000,
  /* Lazy routes cold-load Recharts and three.js through the dev server, so give
     assertions room to breathe instead of racing the transform. */
  expect: { timeout: 15_000 },
  /* Keep the dev server from being hammered by too many parallel cold starts. */
  workers: process.env.CI ? 2 : 4,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
