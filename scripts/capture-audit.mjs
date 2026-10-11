/* eslint-disable no-console */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://127.0.0.1:8765';
const OUT = path.resolve('./.pw-out/audit');
fs.mkdirSync(OUT, { recursive: true });

// SPA has all routes in index.html via client-side routing — every URL returns index.html.

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/lab', name: 'lab' },
  { path: '/computer', name: 'computer' },
  { path: '/timeline', name: 'timeline' },
  { path: '/course-map', name: 'course-map' },
  { path: '/universe-computer', name: 'universe-computer' },
  { path: '/videos', name: 'videos' },
  { path: '/team', name: 'team' },
  { path: '/gallery', name: 'gallery' },
  { path: '/glossary', name: 'glossary' },
  { path: '/delight', name: 'delight' },
  { path: '/credits', name: 'credits' },
];

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

const THEMES = ['paper', 'crt'];

async function setThemeAndReducedMotion(context, theme, reducedMotion) {
  await context.addInitScript((opts) => {
    // Theme: 'paper' => light; 'crt' => dark.
    localStorage.setItem(
      'qubi-preferences',
      JSON.stringify({
        state: { theme: opts.theme === 'paper' ? 'light' : 'dark' },
        version: 0,
      }),
    );
    if (opts.reducedMotion) {
      // The actual media query controls reduced motion; we also force the store.
      localStorage.setItem(
        'qubi-preferences',
        JSON.stringify({
          state: { theme: opts.theme === 'paper' ? 'light' : 'dark' },
          version: 0,
        }),
      );
    }
  }, { theme, reducedMotion });
}

async function captureScreenshots(page, route, viewport, theme, reducedMotion) {
  // Use reduced-motion: emulate via context.
  const url = BASE + route.path;
  console.log(`→ ${route.name} @ ${viewport.name} ${theme}${reducedMotion ? ' (rm)' : ''}`);
  await page.goto(url, { waitUntil: 'load' });
  // Dismiss loading screen and start-here tour
  await page.waitForTimeout(2200); // boot ~1.5s + tour ~1.6s
  try {
    const closeBtn = page.locator('button[aria-label="Close tour"]');
    if (await closeBtn.isVisible({ timeout: 1000 })) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  } catch {}
  await page.waitForTimeout(500);
  const filename = `${route.name}-${viewport.name}-${theme}${reducedMotion ? '-rm' : ''}.png`;
  await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
  // Also a fullpage shot at desktop & mobile for the most important routes
  if (viewport.name === 'desktop' && !reducedMotion && ['home', 'lab', 'computer', 'timeline', 'team'].includes(route.name)) {
    await page.screenshot({ path: path.join(OUT, `${route.name}-${viewport.name}-${theme}-full.png`), fullPage: true });
  }
}

async function runAxe(page, route, viewport, theme) {
  const url = BASE + route.path;
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  try {
    const closeBtn = page.locator('button[aria-label="Close tour"]');
    if (await closeBtn.isVisible({ timeout: 1000 })) await closeBtn.click();
  } catch {}
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return {
    route: route.name,
    viewport: viewport.name,
    theme,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.length,
      examples: v.nodes.slice(0, 3).map((n) => n.target),
    })),
  };
}

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const axeResults = [];
  try {
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        const reducedMotion = false;
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
        });
        await setThemeAndReducedMotion(context, theme, reducedMotion);
        const page = await context.newPage();
        for (const route of ROUTES) {
          try {
            await captureScreenshots(page, route, viewport, theme, reducedMotion);
          } catch (e) {
            console.error(`! ${route.name} ${theme} ${viewport.name}: ${e.message}`);
          }
        }
        await context.close();

        // Reduced-motion run for desktop CRT only (small extra cost)
        if (viewport.name === 'desktop' && theme === 'crt') {
          const ctxRm = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
            reducedMotion: 'reduce',
          });
          await setThemeAndReducedMotion(ctxRm, theme, true);
          const pageRm = await ctxRm.newPage();
          for (const route of ROUTES) {
            try {
              await captureScreenshots(pageRm, route, viewport, theme, true);
            } catch (e) {
              console.error(`! rm ${route.name}: ${e.message}`);
            }
          }
          await ctxRm.close();
        }

        // Axe: do this on desktop only
        if (viewport.name === 'desktop') {
          const ctxAxe = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
          });
          await setThemeAndReducedMotion(ctxAxe, theme, false);
          const pageAxe = await ctxAxe.newPage();
          for (const route of ROUTES) {
            try {
              axeResults.push(await runAxe(pageAxe, route, viewport, theme));
            } catch (e) {
              console.error(`! axe ${route.name}: ${e.message}`);
            }
          }
          await ctxAxe.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'axe-results.json'), JSON.stringify(axeResults, null, 2));
  console.log(`Axe found violations in ${axeResults.filter((r) => r.violations.length > 0).length} route/vp combos.`);
})();