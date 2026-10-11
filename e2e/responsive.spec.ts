import { expect, test } from '@playwright/test';

/* ------------------------------------------------------------------ *
 * Responsiveness audit — every route at every breakpoint.
 *
 * Screenshots all pages at mobile/tablet/desktop widths.
 * Checks that no horizontal scrollbars appear (content overflow).
 * ------------------------------------------------------------------ */

const VIEWPORTS = [
  { name: 'mobile-sm', width: 320, height: 568 },
  { name: 'mobile-md', width: 375, height: 667 },
  { name: 'mobile-lg', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/lab', name: 'lab' },
  { path: '/computer', name: 'computer' },
  { path: '/timeline', name: 'timeline' },
  { path: '/course-map', name: 'course-map' },
  { path: '/universe-computer', name: 'universe-computer' },
  { path: '/delight', name: 'delight' },
  { path: '/team', name: 'team' },
  { path: '/videos', name: 'videos' },
  { path: '/gallery', name: 'gallery' },
  { path: '/glossary', name: 'glossary' },
  { path: '/credits', name: 'credits' },
] as const;

async function hasHorizontalScrollbar(page: any): Promise<boolean> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth;
  });
}

async function dismissStartHere(page: any): Promise<void> {
  // The StartHere tour auto-opens after ~1.6s for first-time visitors.
  // Wait for it, then click the close button.
  const closeBtn = page.locator('button[aria-label="Close tour"]');
  try {
    await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await closeBtn.click();
    await page.waitForTimeout(300);
  } catch {
    // Dialog didn't appear — already dismissed or blocked
  }
}

async function getOverflowElements(page: any): Promise<string[]> {
  return page.evaluate(() => {
    const offenders: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let el: Element | null;
    while ((el = walker.nextNode() as Element)) {
      const rect = el.getBoundingClientRect();
      const vpWidth = window.innerWidth;
      if (rect.right > vpWidth + 2 || rect.left < -2) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
          ? `.${el.className.split(' ')[0]}`
          : '';
        offenders.push(`${tag}${id}${cls}`);
      }
    }
    return offenders;
  });
}

test.describe('responsive overflow check', () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.name} @ ${vp.name} (${vp.width}x${vp.height}) has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path);
        await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

        // Wait for lazy routes to load
        await page.waitForTimeout(1200);

        const hasOverflow = await hasHorizontalScrollbar(page);
        if (hasOverflow) {
          const offenders = await getOverflowElements(page);
          console.log(`Overflow elements on ${route.name} @ ${vp.name}:`, offenders.slice(0, 20));
        }
        expect(hasOverflow, `Horizontal overflow detected on ${route.path} at ${vp.width}x${vp.height}`).toBe(false);
      });
    }
  }
});

test.describe('responsive screenshots', () => {
  // Snapshots of key pages at key breakpoints for visual regression
  for (const vp of VIEWPORTS) {
    test(`screenshot home @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `.pw-out/responsive/${vp.name}-home.png`, fullPage: false });
    });
  }

  for (const vp of VIEWPORTS) {
    test(`screenshot lab @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/lab');
      await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `.pw-out/responsive/${vp.name}-lab.png`, fullPage: false });
    });
  }

  for (const vp of VIEWPORTS) {
    test(`screenshot delight @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/delight');
      await expect(page.locator('#boot')).toHaveCount(0, { timeout: 25_000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `.pw-out/responsive/${vp.name}-delight.png`, fullPage: false });
    });
  }
});

test.describe('mobile nav interaction', () => {
  test('mobile menu opens and is scrollable', async ({ page }) => {
    // Use a short viewport to force the menu to scroll
    await page.setViewportSize({ width: 375, height: 500 });
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
    await dismissStartHere(page);

    const menuBtn = page.locator('button[aria-label="Open menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Radix Dialog content panel (slide-in nav)
    const panel = page.locator('.fixed.inset-y-0.right-0');
    await expect(panel).toBeVisible();

    // Verify the menu panel itself is scrollable on short viewports
    const isScrollable = await panel.evaluate((el: HTMLElement) => {
      return el.scrollHeight > el.clientHeight || getComputedStyle(el).overflowY === 'auto';
    });
    expect(isScrollable).toBe(true);

    // Close via first link
    await panel.locator('a').first().click();
    await expect(panel).not.toBeVisible();
  });

  test('desktop nav shows all links inline', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    const navLinks = page.locator('nav[aria-label="Primary"] ul li a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(8);

    // All links should be visible (not in hamburger)
    for (let i = 0; i < count; i++) {
      await expect(navLinks.nth(i)).toBeVisible();
    }
  });
});

test.describe('twenty questions grid on mobile', () => {
  test('8x8 grid fits within 320px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/delight');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
    await dismissStartHere(page);

    // Navigate to the 20 Questions tab
    await page.getByRole('tab', { name: /20 Questions/i }).click();
    await page.waitForTimeout(500);

    const hasOverflow = await hasHorizontalScrollbar(page);
    expect(hasOverflow).toBe(false);

    // Grid container should not overflow viewport
    const gridContainer = page.locator('div').filter({ has: page.locator('button') }).filter({ hasText: /New game/ }).first();
    const box = await gridContainer.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(320);
  });
});
