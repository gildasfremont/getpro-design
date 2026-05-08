import { chromium, devices } from 'playwright';

const [, , url, out] = process.argv;
if (!url || !out) {
  console.error('usage: screenshot.mjs <url> <out.png>');
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 12'] });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(500);

// fullPage screenshots stitch chunks as they scroll, racing lazy images.
// Set the viewport to the entire document height so everything renders in
// one frame, then take a regular (non-stitched) screenshot.
const docHeight = await page.evaluate(() => {
  // Strip lazy loading and force eager so once we resize, all <img> fetch.
  for (const img of document.querySelectorAll('img')) img.loading = 'eager';
  return document.documentElement.scrollHeight;
});
await page.setViewportSize({ width: 390, height: docHeight });
await page.waitForLoadState('networkidle');
// Wait for every image to decode at the new layout.
await page.evaluate(async () => {
  await Promise.all([...document.images].map(img => {
    if (img.complete && img.naturalWidth > 0) return null;
    return new Promise(res => {
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }));
});
await page.waitForTimeout(300);

await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('ok', out);
