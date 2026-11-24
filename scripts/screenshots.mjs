// Usage: npm run build && npm start (in another shell), then: node scripts/screenshots.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const out = new URL("../docs/screenshots/", import.meta.url).pathname;
const targets = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
];

// CHROME_PATH lets you reuse any local Chromium; otherwise run `npx playwright install chromium`.
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
for (const t of targets) {
  const ctx = await browser.newContext({
    viewport: { width: t.width, height: t.height },
    deviceScaleFactor: t.mobile ? 2 : 1,
    isMobile: !!t.mobile,
    hasTouch: !!t.mobile,
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}${t.name}-hero.png` });
  // Scroll through the page so every once-only reveal fires.
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= h; y += Math.round(t.height * 0.5)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}${t.name}-full.png`, fullPage: true });
  await ctx.close();
  console.log("saved", t.name);
}
await browser.close();
