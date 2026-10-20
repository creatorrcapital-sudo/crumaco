// QA: screenshots every section at 390, 768 and 1440px into /qa, and checks
// for horizontal scroll, orphaned single words in headings, and images
// rendered at a different aspect ratio than their box allows (stretching).
//
// Usage: QA_URL=http://localhost:3000 node scripts/qa-screenshots.mjs

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.QA_URL ?? "http://localhost:3000";
const OUT = path.resolve(import.meta.dirname, "../qa");
const WIDTHS = [390, 768, 1440];
const SECTIONS = ["top", "proof", "founder", "credentials", "results", "problem", "method", "baseline", "lab", "readings", "who-we-help", "programmes", "founders-programme", "faq", "begin"];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const width of WIDTHS) {
  const height = width === 390 ? 844 : width === 768 ? 1024 : 900;
  // Reduced motion: everything is in its final state, so shots are deterministic.
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (err) => problems.push(`[${width}] page error: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[${width}] console error: ${msg.text()}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Wait until above-the-fold images have decoded before the first shot.
  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((img) => img.getBoundingClientRect().top < window.innerHeight && img.offsetParent !== null)
        .map((img) => img.decode().catch(() => {})),
    ),
  );

  // First screen, as a visitor sees it (nav over the hero).
  await page.screenshot({ path: path.join(OUT, `${width}-00-first-screen.png`) });

  // Load every lazy image before measuring.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");

  // Scrolled state: solid nav and (on mobile) the sticky bar.
  await page.evaluate(() => window.scrollTo(0, document.getElementById("problem").offsetTop + 200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${width}-00-scrolled-ui.png`) });

  const checks = await page.evaluate(() => {
    const out = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth) out.push(`horizontal scroll: ${doc.scrollWidth} > ${doc.clientWidth}`);

    // Elements poking out past the viewport edge.
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (style.position === "fixed" || r.width === 0 || style.visibility === "hidden") continue;
      if (r.right > doc.clientWidth + 1 && !el.closest("[aria-hidden='true'],.sr-only,[class*='-left-[9999px]']")) {
        out.push(`overflows right: <${el.tagName.toLowerCase()} class="${(el.className?.baseVal ?? el.className).toString().slice(0, 60)}"> right=${Math.round(r.right)}`);
        break;
      }
    }

    // Orphans: a heading whose last line holds a single word.
    for (const h of document.querySelectorAll("h1, h2, h3, .display")) {
      if (h.offsetParent === null) continue;
      const words = [];
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const re = /\S+/g;
        let m;
        while ((m = re.exec(node.textContent))) {
          const range = document.createRange();
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const rect = range.getBoundingClientRect();
          if (rect.width) words.push({ w: m[0], top: Math.round(rect.top) });
        }
      }
      // Leading numbers ("04") are labels, not words. Two- and three-word
      // headings breaking 2+1 (e.g. "Human performance, / engineered.") are
      // deliberate display breaks, so only longer headings are checked.
      const realWords = words.filter((w) => !/^\d+$/.test(w.w));
      const lines = [...new Set(words.map((w) => w.top))];
      if (lines.length > 1 && realWords.length >= 4) {
        const last = words.filter((w) => w.top === lines[lines.length - 1]);
        // Blocks deliberately split one sentence per line are fine.
        const blockLines = h.querySelectorAll(":scope > span.block").length;
        if (last.length === 1 && !blockLines) out.push(`orphan in heading: "${h.textContent.trim().slice(0, 50)}" → "${last[0].w}"`);
      }
    }

    // Images: object-fit must be cover/contain (never stretched) and loaded.
    for (const img of document.querySelectorAll("img")) {
      if (img.offsetParent === null) continue;
      const fit = getComputedStyle(img).objectFit;
      const r = img.getBoundingClientRect();
      if (!img.complete || img.naturalWidth === 0) out.push(`image not loaded: ${img.currentSrc || img.src}`);
      if (fit === "fill" && img.naturalWidth) {
        const ratioBox = r.width / r.height;
        const ratioImg = img.naturalWidth / img.naturalHeight;
        if (Math.abs(ratioBox - ratioImg) / ratioImg > 0.02) out.push(`stretched image: ${img.currentSrc}`);
      }
      if (!img.hasAttribute("alt")) out.push(`image missing alt: ${img.src}`);
    }
    return out;
  });
  for (const c of checks) problems.push(`[${width}] ${c}`);

  // Section screenshots, without the fixed UI drawn over them.
  await page.addStyleTag({ content: "header.fixed, .fixed.bottom-0, a.fixed, .pl { visibility: hidden !important; }" });
  for (const [i, id] of SECTIONS.entries()) {
    const loc = page.locator(`#${id}`);
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await loc.screenshot({ path: path.join(OUT, `${width}-${String(i + 1).padStart(2, "0")}-${id}.png`) });
  }
  await page.locator("footer").screenshot({ path: path.join(OUT, `${width}-16-footer.png`) });
  await context.close();
}

// With motion on, animations start offset (e.g. sideways parallax): the page
// must still never be wider than the screen at any scroll position.
for (const width of [390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.body.scrollHeight);
  let worst = 0;
  for (let y = 0; y < total; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(80);
    worst = Math.max(worst, await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  if (worst > 0) problems.push(`[${width}, motion on] horizontal overflow of ${worst}px while scrolling`);
  await context.close();
}

await browser.close();
console.log(problems.length ? `Problems found:\n${[...new Set(problems)].join("\n")}` : "No layout problems found.");
console.log(`Screenshots in ${OUT}`);
process.exitCode = problems.length ? 1 : 0;
