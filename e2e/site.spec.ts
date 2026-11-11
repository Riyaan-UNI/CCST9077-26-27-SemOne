import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openAppPage(page: import('@playwright/test').Page, path: string) {
  await page.addInitScript(() => {
    sessionStorage.setItem('qubi-intro-seen', 'true');
  });
  await page.goto(path);
}

test.describe('Public Registry and routes', () => {
  const routes: Array<[string, RegExp]> = [
    ['/', /Quantum Lost-and-Found Bureau/i],
    ['/cases', /Three limits/i],
    ['/cases/measurement', /answer that changes/i],
    ['/cases/entanglement', /distant results/i],
    ['/cases/no-cloning', /original that cannot be duplicated/i],
    ['/ledger', /Compare what each case/i],
    ['/videos', /video records/i],
    ['/lab', /Run the maths yourself/i],
    ['/computer', /Build your own quantum circuits/i],
    ['/timeline', /From Bits to Qubits/i],
    ['/course-map', /Course Map/i],
    ['/universe-computer', /The Universe as a Quantum Computer/i],
    ['/delight', /Play, test, explore/i],
    ['/team', /Four students/i],
    ['/gallery', /Plates from the quantum world/i],
    ['/glossary', /Glossary/i],
    ['/credits', /Sources, tools, and authorship/i],
    ['/about', /A case archive/i],
  ];

  for (const [path, heading] of routes) {
    test(`${path} renders its primary heading`, async ({ page }) => {
      await openAppPage(page, path);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    });
  }

  test('first-time visitors can measure Qubi and begin the guided route', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByRole('heading', { name: 'Welcome to the Quantum Realm' })).toBeVisible();
    await page.getByRole('button', { name: 'Meet Qubi' }).click();
    await page.getByLabel('Measure Qubi').click();
    await page.getByRole('button', { name: 'Start the guided tour' }).click();
    await expect(page.getByRole('heading', { name: 'Public Registry' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Quantum Lost-and-Found Bureau/i);
    await expect(page.getByRole('heading', { name: 'The video records' })).toBeVisible();
    await expect(page.locator('#home-title')).toHaveClass(/guided-tour-target/);
    await expect(page.locator('.tour-companion')).toBeVisible();

    const order = await page.evaluate(() => {
      const landing = document.querySelector('.registry-landing');
      const videoSection = document.querySelector('#videos');
      return Boolean(landing && videoSection && (landing.compareDocumentPosition(videoSection) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    expect(order).toBe(true);

    await page.getByRole('button', { name: 'Next place' }).click();
    await expect(page).toHaveURL(/\/cases$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Three limits/i);
    await expect(page.locator('.record-register')).toHaveClass(/guided-tour-target/);

    const remainingStops: Array<[RegExp, string, RegExp]> = [
      [/Measurement case/, '.case-step-panel', /\/cases\/measurement$/],
      [/Entanglement case/, '.case-step-panel', /\/cases\/entanglement$/],
      [/No-cloning case/, '.case-step-panel', /\/cases\/no-cloning$/],
      [/Video Records/, '#the-magic-box', /\/videos$/],
      [/Evidence Ledger/, '.ledger-table', /\/ledger$/],
      [/Reference Lab/, '.lab-console', /\/lab$/],
      [/Computer Desk/, 'main h1', /\/computer$/],
      [/Universe Computer/, 'main h1', /\/universe-computer$/],
      [/Quick Checks/, 'main h1', /\/delight$/],
      [/Course Timeline/, 'main h1', /\/timeline$/],
      [/Lecture Map/, 'main h1', /\/course-map$/],
      [/Diagram Archive/, 'main h1', /\/gallery$/],
      [/Term Index/, 'main h1', /\/glossary$/],
      [/Meet the Team/, 'main h1', /\/team$/],
      [/About the Bureau/, 'main h1', /\/about$/],
      [/Sources and Credits/, 'main h1', /\/credits$/],
    ];
    for (const [stop, target, route] of remainingStops) {
      await page.getByRole('button', { name: 'Next place' }).click();
      await expect(page).toHaveURL(route);
      await expect(page.getByRole('heading', { name: stop })).toBeVisible();
      await expect(page.locator(target)).toHaveClass(/guided-tour-target/);
      await expect(page.locator('.tour-companion')).toBeVisible();
    }
    await page.getByRole('button', { name: 'Finish tour' }).click();
    await expect(page.locator('.guided-tour')).toHaveCount(0);
  });

  test('welcome intro starts in a new tab and can be replayed from the mobile menu', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 640, height: 800 } });
    try {
      const firstVisit = await context.newPage();
      await firstVisit.goto('/');
      await expect(firstVisit.getByRole('heading', { name: 'Welcome to the Quantum Realm' })).toBeVisible();
      await firstVisit.getByRole('button', { name: 'Explore on my own' }).click();
      await firstVisit.getByRole('button', { name: 'Open site menu' }).click();
      await firstVisit.getByRole('button', { name: /Replay the opening/i }).click();
      await expect(firstVisit.getByRole('heading', { name: 'Welcome to the Quantum Realm' })).toBeVisible();

      const newVisit = await context.newPage();
      await newVisit.goto('/');
      await expect(newVisit.getByRole('heading', { name: 'Welcome to the Quantum Realm' })).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test('theme switch changes to light mode and back', async ({ page }) => {
    await openAppPage(page, '/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(page.locator('html')).toHaveClass(/light/);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('About explains the site structure and where interactive data lives', async ({ page }) => {
    await openAppPage(page, '/about');
    await expect(page.getByRole('heading', { name: 'How this site is made' })).toBeVisible();
    await expect(page.getByText(/your case notes stay on this device/i)).toBeVisible();
  });

  test('video thumbnail opens a click-to-load, nonmodal player', async ({ page }) => {
    await openAppPage(page, '/videos');
    await page.getByRole('button', { name: 'Play episode 1: The Magic Box' }).click();

    const player = page.getByRole('dialog', { name: 'The Magic Box' });
    await expect(player).toHaveAttribute('aria-modal', 'false');
    await expect(player.locator('iframe')).toHaveAttribute('src', /ZNNB-lHQsfI\?autoplay=1/);
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expect(player).toBeVisible();
    await page.getByRole('button', { name: 'Close video player' }).click();
    await expect(player).not.toBeVisible();
  });

  test('measurement test responds to basis and repeated shots', async ({ page }) => {
    await openAppPage(page, '/cases/measurement');
    await page.getByLabel('Two possible results across repeated trials').check();
    await page.getByRole('button', { name: /Save prediction/i }).click();
    await page.getByRole('button', { name: 'Measure once' }).click();
    await expect(page.getByRole('status')).toContainText(/1 total Z-basis measurements/);
    await page.getByRole('button', { name: 'Run 12 shots' }).click();
    await expect(page.getByRole('list', { name: '13 measurement outcomes' }).locator('li')).toHaveCount(13);
    await page.getByLabel(/Read in X basis/).check();
    await page.getByRole('button', { name: 'Measure once' }).click();
    await expect(page.getByRole('status')).toContainText(/1 total X-basis measurements/);
    await expect(page.getByRole('heading', { name: 'What the case supports' })).toBeVisible();

    await page.getByRole('link', { name: /Add to case conference/i }).click();
    await expect(page.getByRole('table')).toContainText('Two possible results across repeated trials');
    await expect(page.getByRole('table')).toContainText(/1 total X-basis measurements/);
  });

  test('no-cloning case distinguishes known preparation from arbitrary unknown states', async ({ page }) => {
    await openAppPage(page, '/cases/no-cloning');
    await page.getByLabel('No universal perfect copier for arbitrary unknown states').check();
    await page.getByRole('button', { name: /Save prediction/i }).click();
    await page.getByLabel(/Repeat a known preparation/).check();
    await page.getByRole('button', { name: 'Run copier' }).click();
    await expect(page.getByRole('status')).toContainText(/preparer who knows the state \|\+⟩ can prepare/);
    await page.getByLabel(/Test one universal copier/).check();
    await page.getByRole('button', { name: 'Run copier' }).click();
    await expect(page.getByRole('status')).toContainText(/by linearity/);
    await expect(page.getByRole('status')).toContainText(/\|00⟩ \+ \|11⟩/);
    await expect(page.getByText(/does not claim/i)).toBeVisible();
  });

  test('entanglement challenge compares player strategies and individual rounds', async ({ page }) => {
    await openAppPage(page, '/cases/entanglement');
    await page.getByLabel('No, correlations do not make a controllable message channel').check();
    await page.getByRole('button', { name: /Save prediction/i }).click();
    await page.getByRole('button', { name: 'Play 12 rounds' }).click();
    await expect(page.locator('.chsh-rounds li')).toHaveCount(12);
    await expect(page.getByRole('status')).toContainText(/latest 12 rounds/i);
    await page.getByLabel(/Shared classical rule/).check();
    await page.getByRole('button', { name: 'Play one round' }).click();
    await expect(page.locator('.chsh-rounds li')).toHaveCount(13);
    await expect(page.getByText(/does not send a controllable signal/i)).toBeVisible();
  });

  test('short-height mobile navigation scrolls and closes after a selection', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 320 });
    await openAppPage(page, '/');
    await page.getByRole('button', { name: 'Open site menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Public register' });
    await expect(menu).toBeVisible();
    const scrollArea = page.getByRole('navigation', { name: 'Site menu' });
    const dimensions = await scrollArea.evaluate((element) => ({
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
      overflowY: getComputedStyle(element).overflowY,
    }));
    expect(dimensions.overflowY).toBe('auto');
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
    await scrollArea.hover();
    await page.mouse.wheel(0, 500);
    await expect.poll(() => scrollArea.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await menu.getByRole('link', { name: /Evidence Ledger/i }).click();
    await expect(menu).not.toBeVisible();
    await expect(page).toHaveURL(/\/ledger$/);
  });

  test('team shows four members and only the selected record expands', async ({ page }) => {
    await openAppPage(page, '/team');
    await expect(page.getByRole('heading', { name: 'Four students. Qubi on the desk.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cynthia (Sun Siyan)' })).toBeVisible();
    const grid = page.getByTestId('team-member-grid');
    await expect(grid.locator(':scope > article')).toHaveCount(4);
    await page.getByRole('button', { name: /Cynthia \(Sun Siyan\)/ }).click();
    await expect(page.getByText(/unknown quantum state cannot be copied perfectly/i)).toBeVisible();
    await expect(grid.locator('button[aria-expanded="true"]')).toHaveCount(1);
    await page.getByRole('button', { name: /Patan Mohammed Riyaan/ }).click();
    await expect(grid.locator('button[aria-expanded="true"]')).toHaveCount(1);
  });

  test('the lab still measures a Bell pair as |00⟩ or |11⟩', async ({ page }) => {
    await openAppPage(page, '/lab');
    await page.getByRole('button', { name: 'Bell pair', exact: true }).click();
    for (let i = 0; i < 8; i++) {
      await page.getByRole('button', { name: 'Measure', exact: true }).click();
      const badge = page.getByText(/collapsed →/);
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/\|(00|11)⟩/);
    }
  });

  test('unknown routes recover to the Public Registry', async ({ page }) => {
    await openAppPage(page, '/definitely-not-a-page');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/not in the register/i);
    await page.getByRole('main').getByRole('link', { name: 'Public Registry', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Quantum Lost-and-Found Bureau/i);
  });
});

test.describe('accessibility smoke checks', () => {
  for (const path of ['/', '/cases/measurement', '/cases/entanglement', '/cases/no-cloning', '/ledger', '/videos', '/team', '/lab', '/about', '/credits']) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      await openAppPage(page, path);
      await page.waitForTimeout(300);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
      expect(blocking.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length }))).toEqual([]);
    });
  }
});
