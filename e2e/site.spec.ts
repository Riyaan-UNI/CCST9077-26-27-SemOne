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

  test('reports an actionable error instead of a blank screen if the bundle fails', async ({
    page,
  }) => {
    // Block the app entry point so React never mounts — this is what a wrong
    // deploy base path looks like to a visitor.
    await page.route('**/main.tsx*', (route) => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const error = page.locator('#boot-error');
    await expect(error).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/could not start the app/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /reload/i })).toBeVisible();

    // And it must not be a silent void: the page still says something.
    const text = (await page.locator('body').innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
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

  test('home opens on the landing page with dark mode and a direct path to videos', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('qubi-preferences'));
    await page.goto('/');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/What if the universe/);
    await expect(
      page.getByRole('heading', { name: 'The Quantum Revolution, in four videos' }),
    ).toBeVisible();
    const order = await page.evaluate(() => {
      const hero = document.querySelector('main header');
      const videoSection = document.querySelector('#videos');
      return Boolean(hero && videoSection && hero.compareDocumentPosition(videoSection) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);
    await page.getByRole('link', { name: /Watch the videos/ }).click();
    await expect(page).toHaveURL(/#videos$/);
    await page.waitForTimeout(1800);
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('thumbnail opens an autoplaying, nonmodal player while the page remains interactive', async ({
    page,
  }) => {
    await page.goto('/videos');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Play episode 1: The Magic Box' }).click();

    const player = page.getByRole('dialog', { name: 'The Magic Box' });
    await expect(player).toHaveAttribute('aria-modal', 'false');
    await expect(player.locator('iframe')).toHaveAttribute(
      'src',
      /ZNNB-lHQsfI\?autoplay=1/,
    );

    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveClass(/light/);
    await expect(player).toBeVisible();
    await page.getByRole('button', { name: 'Close video player' }).click();
    await expect(player).not.toBeVisible();
  });

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

test.describe('team page', () => {
  test('shows four members and adapts its grid across screen sizes', async ({ page }) => {
    await page.goto('/team');
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Four humans, one robot' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cynthia (Sun Siyan)' })).toBeVisible();

    const grid = page.getByTestId('team-member-grid');
    await expect(grid.locator(':scope > div')).toHaveCount(4);

    for (const [width, expectedColumns] of [
      [375, 1],
      [768, 2],
      [1280, 4],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      const columns = await grid.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
      );
      expect(columns).toBe(expectedColumns);

      const pageWidth = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      );
      expect(pageWidth).toBe(true);
    }

    await page.getByRole('button', { name: /Cynthia \(Sun Siyan\)/ }).click();
    await expect(page.getByText(/unknown quantum state cannot be copied perfectly/i)).toBeVisible();
    await expect(grid.locator('button[aria-expanded="true"]')).toHaveCount(1);
    await expect(grid.locator('button[aria-expanded="false"]')).toHaveCount(3);

    await page.getByRole('button', { name: /Patan Mohammed Riyaan/ }).click();
    await expect(grid.locator('button[aria-expanded="true"]')).toHaveCount(1);
    await expect(grid.locator('button[aria-expanded="false"]')).toHaveCount(3);
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
