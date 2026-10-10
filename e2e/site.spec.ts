import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* ------------------------------------------------------------------ *
 * Boot sequence — regression tests for the splash screen.
 *
 * The original bug: the static #boot splash in index.html was never removed
 * when React mounted, so a full-screen z-9999 overlay covered the site
 * forever, and its progress bar escaped its frame.
 * ------------------------------------------------------------------ */

test.describe('boot sequence', () => {
  test('the splash hands off to the app and is removed from the DOM', async ({ page }) => {
    await page.goto('/');

    // Removed, not merely hidden — a lingering fixed overlay would still trap clicks.
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/quantum/i);
    await expect(page.getByRole('link', { name: /enter the lab/i })).toBeVisible();
  });

  test('nothing covers the viewport after boot', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    const covered = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      return el ? el.closest('#boot') !== null : false;
    });
    expect(covered).toBe(false);
  });

  test('the splash progress bar is clipped inside its frame', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    /* The splash markup is removed on boot but its stylesheet stays in <head>,
       so we can recreate the element to regression-test the containment CSS. */
    await page.evaluate(() => {
      const el = document.createElement('div');
      el.id = 'boot';
      el.innerHTML =
        '<div><div>initialising qubit&hellip;</div><div class="bar"><i></i></div></div>';
      document.body.appendChild(el);
    });

    const bar = page.locator('#boot .bar');
    await expect(bar).toBeVisible();

    // The frame must actually clip — this is the regression guard.
    await expect(bar).toHaveCSS('overflow', 'hidden');
    await expect(bar).toHaveCSS('box-sizing', 'border-box');

    // ...and the clip must be load-bearing: at the peak of the keyframes the
    // fill is carried completely out of the frame, so without clipping it
    // would be visible outside the box.
    const { fillWidth, frameWidth } = await page.evaluate(() => {
      const fill = document.querySelector('#boot .bar i') as HTMLElement;
      const frame = fill.parentElement as HTMLElement;
      return {
        fillWidth: fill.getBoundingClientRect().width,
        frameWidth: frame.clientWidth,
      };
    });

    // right edge at peak = translateX(250%) + its own width = 3.5 x fillWidth
    expect(fillWidth * 3.5).toBeGreaterThan(frameWidth);

    await page.evaluate(() => document.getElementById('boot')?.remove());
  });
});

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

test.describe('routes', () => {
  const routes: Array<[string, RegExp]> = [
    ['/', /quantum/i],
    ['/lab', /run the maths yourself/i],
    ['/gallery', /plates from the quantum world/i],
    ['/about', /quantum revolution/i],
  ];

  for (const [path, heading] of routes) {
    test(`${path} renders its heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    });
  }

  test('deep link /lab#chsh opens the CHSH tab', async ({ page }) => {
    await page.goto('/lab#chsh');
    await expect(page.getByRole('tab', { name: /chsh game/i })).toHaveAttribute(
      'data-state',
      'active',
    );
  });

  test('an unknown route shows the 404 page', async ({ page }) => {
    await page.goto('/definitely-not-a-page');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/does not exist/i);
  });
});

/* ------------------------------------------------------------------ *
 * The lab — proves the physics engine is wired up correctly in the UI
 * ------------------------------------------------------------------ */

test.describe('quantum lab', () => {
  test('measuring a Bell pair only ever collapses to |00> or |11>', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    await page.getByRole('button', { name: 'Bell pair', exact: true }).click();

    for (let i = 0; i < 8; i++) {
      await page.getByRole('button', { name: 'Measure', exact: true }).click();
      const badge = page.getByText(/collapsed →/);
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/\|(00|11)⟩/);
    }
  });

  test('the CHSH game converges above the classical ceiling', async ({ page }) => {
    await page.goto('/lab');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });

    await page.getByRole('tab', { name: /chsh game/i }).click();
    await page.getByRole('button', { name: /fast-forward/i }).click();

    // Quantum strategy should read ~85%, clearly above the 75% classical bound.
    const quantumRate = page.locator('text=/^8[0-9]\\.[0-9]%$/').first();
    await expect(quantumRate).toBeVisible({ timeout: 10_000 });
  });
});

/* ------------------------------------------------------------------ *
 * Accessibility
 * ------------------------------------------------------------------ */

test.describe('accessibility', () => {
  for (const path of ['/', '/lab', '/gallery', '/about']) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
      await page.waitForTimeout(1000);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );

      expect(
        blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      ).toEqual([]);
    });
  }
});
