import { chromium, devices } from 'playwright';
import { mkdirSync } from 'fs';

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'] });
const page = await ctx.newPage();

mkdirSync('_audit/_tmp', { recursive: true });

// Test 1: solutions-profils scrolled, sticky bars should be visible
await page.goto('http://127.0.0.1:8765/solutions-profils.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
// Scroll down past the hero so view-tabs + categories-col + header all stick
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(300);
await page.screenshot({ path: '_audit/_tmp/profils-scrolled.png' });
console.log('profils-scrolled saved');

// Test 2: burger menu open
await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.click('.menu-toggle');
await page.waitForTimeout(300);
await page.screenshot({ path: '_audit/_tmp/burger-open.png' });
console.log('burger-open saved');

// Test 3: index scrolled, nav should remain at top
await page.evaluate(() => {
  document.querySelector('.menu-toggle').click();
  window.scrollTo(0, 1500);
});
await page.waitForTimeout(300);
await page.screenshot({ path: '_audit/_tmp/index-scrolled.png' });
console.log('index-scrolled saved');

await browser.close();
