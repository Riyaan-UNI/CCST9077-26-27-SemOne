/** Throwaway: reproduce what a visitor actually sees on the live site. */
import { chromium } from 'playwright';

const URL = 'https://riyaan-uni.github.io/CCST9077-26-27-SemOne/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleMsgs = [];
const failed = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`${m.type()}: ${m.text()}`);
});
page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText}  ${r.url()}`));
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(`HTTP ${r.status()}  ${r.url()}`);
});

await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
console.log('loaded, waiting 11s (past the 8s splash safety net)…');
await page.waitForTimeout(11000);

const state = await page.evaluate(() => ({
  bootStillPresent: !!document.getElementById('boot'),
  bootVisible: (() => {
    const b = document.getElementById('boot');
    return b ? getComputedStyle(b).opacity !== '0' : false;
  })(),
  rootChildren: document.getElementById('root')?.childElementCount ?? -1,
  bodyText: (document.body.innerText || '').trim().slice(0, 120),
  bg: getComputedStyle(document.body).backgroundColor,
}));

console.log('\n--- final page state ---');
console.log(JSON.stringify(state, null, 2));

console.log('\n--- failed requests / bad statuses ---');
console.log(failed.length ? failed.join('\n') : 'none');

console.log('\n--- console errors/warnings ---');
console.log(consoleMsgs.length ? consoleMsgs.slice(0, 10).join('\n') : 'none');

await page.screenshot({ path: 'live.png' });
await browser.close();
