// QA: interactions and page-level checks — sticky bar rules, mobile menu,
// programme deep links, nav state, counters, WhatsApp links, JSON-LD, OG image,
// privacy page.
//
// Usage: QA_URL=http://localhost:3000 node scripts/qa-interactions.mjs

import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const results = [];
const check = (label, ok, extra = "") => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${label}${extra ? `  (${extra})` : ""}`);
  if (!ok) process.exitCode = 1;
};
const scrollTo = (page, selector, block = "start") =>
  page.evaluate(([s, b]) => document.querySelector(s).scrollIntoView({ block: b, behavior: "instant" }), [selector, block]);

// --- Mobile ---------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  const bar = page.locator("div.fixed.bottom-0");
  const barShown = async () => (await bar.getAttribute("aria-hidden")) === "false";

  check("[390] sticky bar hidden over the hero", !(await barShown()));
  await page.evaluate(() => window.scrollTo(0, document.getElementById("problem").offsetTop + 100));
  await page.waitForTimeout(500);
  check("[390] sticky bar shown after the hero", await barShown());
  await scrollTo(page, '#baseline a[data-cta="baseline"]', "center");
  await page.waitForTimeout(500);
  check("[390] sticky bar hides while another primary button is on screen", !(await barShown()));
  await scrollTo(page, "#begin");
  await page.waitForTimeout(500);
  check("[390] sticky bar hidden at the form", !(await barShown()));

  // Only one primary button visible at any scroll position.
  let maxPrimary = 0;
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < total; y += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
    const n = await page.evaluate(() =>
      [...document.querySelectorAll(".btn-primary")].filter((el) => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const hiddenBar = el.closest("[aria-hidden='true']");
        return !hiddenBar && style.display !== "none" && style.visibility !== "hidden" && r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
      }).length,
    );
    maxPrimary = Math.max(maxPrimary, n);
  }
  check("[390] never more than one primary button on screen", maxPrimary <= 1, `max ${maxPrimary}`);

  // Mobile menu: loads on demand, traps focus, Escape closes and returns focus.
  await page.evaluate(() => window.scrollTo(0, 0));
  const menuBtn = page.getByRole("button", { name: "Open menu" });
  await menuBtn.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ timeout: 5000 });
  check("[390] menu opens", await dialog.isVisible());
  check("[390] focus moves into the menu", await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]")));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("[390] Escape closes the menu", !(await dialog.isVisible().catch(() => false)));
  check("[390] focus returns to the menu button", await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Open menu"));
  await menuBtn.click();
  await dialog.waitFor();
  await dialog.getByRole("link", { name: /Lab/ }).click();
  await page.waitForTimeout(900);
  check("[390] menu link closes menu and goes to #lab", page.url().endsWith("#lab") && !(await dialog.isVisible().catch(() => false)));

  // Entry card opens the matching programme (accordion).
  await page.locator('#who-we-help a[data-programme="longevity"]').click();
  await page.waitForTimeout(700);
  const open = await page.locator('#programmes [data-state="open"] [data-slot="accordion-trigger"]').first().textContent();
  check("[390] 'Longevity' card opens Longevity System", open?.includes("Longevity System"), open?.trim());
  await ctx.close();
}

// --- Desktop --------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const headerCls = () => page.locator("header").first().getAttribute("class");
  check("[1440] nav transparent over the hero", (await headerCls()).includes("bg-transparent"));
  await page.waitForFunction(() => !!window.__lenis, null, { timeout: 5000 }).catch(() => {});
  check("[1440] smooth scrolling (Lenis) active on desktop", await page.evaluate(() => document.documentElement.classList.contains("lenis")));
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(1200);
  check("[1440] wheel scroll moves the page", (await page.evaluate(() => window.scrollY)) > 80);
  check("[1440] nav solid after 80px", (await headerCls()).includes("bg-carbon/90"));

  // Anchor links glide to their target and still update the URL.
  await page.evaluate(() => window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.locator('#top a[href="#method"]').click();
  await page.waitForTimeout(2200);
  const methodTop = await page.evaluate(() => Math.round(document.getElementById("method").getBoundingClientRect().top));
  check("[1440] nav link scrolls to its section (below the nav)", page.url().endsWith("#method") && methodTop >= 40 && methodTop <= 110, `top ${methodTop}px`);
  const curtainGone = await page
    .waitForFunction(
      () => {
        const s = getComputedStyle(document.querySelector(".pl"));
        return s.visibility === "hidden" || s.display === "none";
      },
      null,
      { timeout: 6000 },
    )
    .then(() => true)
    .catch(() => false);
  check("[1440] opening curtain ends and stops covering the page", curtainGone);
  check("[1440] floating WhatsApp visible", await page.locator('a[data-wa="floating"]').isVisible());

  await page.locator('#who-we-help a[data-programme="pain-reset"]').click();
  await page.waitForTimeout(700);
  const selected = await page.locator('#programmes [role=tab][aria-selected="true"]').textContent();
  check("[1440] 'Pain & Injury' card selects Pain Reset", selected?.includes("Pain Reset"), selected?.trim());
  await page.locator('#programmes [role=tab][aria-selected="true"]').focus();
  await page.keyboard.press("ArrowDown");
  const afterKey = await page.locator('#programmes [role=tab][aria-selected="true"]').textContent();
  check("[1440] arrow keys move between programme tabs", afterKey?.includes("Body Transformation"), afterKey?.trim());

  // Counters animate from 0 and land on the configured value. (Reloading in
  // the same tab also checks the opening plays only once per session.)
  await page.goto(BASE, { waitUntil: "networkidle" });
  check("[1440] preloader plays again on reload", await page.evaluate(() => getComputedStyle(document.querySelector(".pl")).display === "block"));
  check("[1440] credentials list: doctorate + 7 rows", (await page.locator("#credentials ul > li.grid").count()) === 7 && (await page.locator("#credentials").getByText("Parker College of Chiropractic").isVisible()));
  check("[1440] specialist certifications listed (7)", (await page.locator("#credentials li.py-5").count()) === 7);
  check("[1440] tally reads 11 certifications", await page.locator("#credentials").getByText("11 certifications").isVisible());
  const first = page.locator("[data-count-to]").first();
  check("[1440] counter starts at 0 before it is seen", (await first.textContent()) === "0.00");
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  check("[1440] counter lands on 2.45", (await first.textContent()) === "2.45");
  check("[1440] 'Illustrative sample readings' label visible", await page.getByText("Illustrative sample readings").isVisible());
  check("[1440] report caption visible", await page.getByText("Illustrative example. Individual results vary.").isVisible());

  // WhatsApp links.
  const waHrefs = await page.$$eval("a[data-wa]", (els) => els.map((e) => e.getAttribute("href")));
  check("[1440] WhatsApp links use wa.me with the booking message", waHrefs.every((h) => h.startsWith("https://wa.me/") && h.includes(encodeURIComponent("Hi, I'd like to book a Baseline assessment at CRUMACO."))), `${waHrefs.length} links`);

  // Structure and metadata.
  check("[1440] exactly one h1", (await page.locator("h1").count()) === 1);
  const title = await page.title();
  check("[1440] title", title === "CRUMACO — Sports Performance & Recovery Lab | Chhatarpur, New Delhi", title);
  const desc = await page.locator('meta[name="description"]').getAttribute("content");
  check("[1440] meta description ≤ 155 chars", desc.length <= 155, `${desc.length}`);
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  check("[1440] JSON-LD SportsActivityLocation with founder and areaServed", ld["@type"] === "SportsActivityLocation" && ld.founder?.name === "Tanvir Logani" && ld.areaServed?.name === "Delhi NCR");
  const ogUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  check("[1440] og:image present", !!ogUrl, ogUrl);
  const landmarks = await page.evaluate(() => ["header", "nav", "main", "footer"].every((t) => document.querySelector(t)));
  check("[1440] header/nav/main/footer landmarks", landmarks);
  const og = await page.request.get(`${BASE}/opengraph-image`);
  check("[1440] OG image renders", og.ok() && og.headers()["content-type"].includes("image/png"));
  const privacy = await page.request.get(`${BASE}/privacy`);
  check("[1440] privacy page", privacy.ok());
  await ctx.close();
}

// --- Reduced motion -------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector("#faq [data-reveal]")).opacity);
  check("[reduced motion] content visible without scrolling", opacity === "1");
  check("[reduced motion] counters show final values", (await page.locator("[data-count-to]").first().textContent()) === "2.45");
  check("[reduced motion] no opening curtain", await page.evaluate(() => getComputedStyle(document.querySelector(".pl")).display === "none"));
  check("[reduced motion] no smooth-scroll hijack", await page.evaluate(() => !document.documentElement.classList.contains("lenis")));
  await ctx.close();
}

// --- No JavaScript --------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector("#faq [data-reveal]")).opacity);
  check("[no JS] content still visible", opacity === "1");
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
