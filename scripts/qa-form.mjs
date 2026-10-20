// QA: walks the enquiry form at 390, 768 and 1440px — validation errors,
// pointer flow, keyboard-only flow, founders intent and the success state.
// Screenshots go to /qa/form-*.png.
//
// Usage: QA_URL=http://localhost:3000 node scripts/qa-form.mjs
// (Start the server with ENQUIRY_RATE_LIMIT=50 so repeated runs are not throttled.)

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.QA_URL ?? "http://localhost:3000";
const OUT = path.resolve(import.meta.dirname, "../qa");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];
const check = (label, ok) => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) process.exitCode = 1;
};

const form = (page) => page.locator("#begin form, #begin [role=status]").first();
const stepTitle = (page) => page.locator("#enq-step-title");
const shot = (page, name) => form(page).screenshot({ path: path.join(OUT, `form-${name}.png`) });

async function pointerFlow(width) {
  const height = width === 390 ? 844 : width === 768 ? 1024 : 900;
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  // The hero CTA scrolls to the form.
  await page.locator('#top a[data-cta="hero"]').click();
  await page.waitForTimeout(400);
  check(`[${width}] hero CTA goes to #begin`, page.url().endsWith("#begin"));

  // Step 1: Continue with nothing chosen shows an error.
  await page.locator("#begin button[type=submit]").click();
  check(`[${width}] step 1 error shown`, await page.locator("#enq-interest-error").isVisible());
  check(`[${width}] error announced to screen readers`, (await page.locator("#begin [aria-live=polite]").textContent()).includes("Choose what brings you in."));
  check(`[${width}] step 1 group marked invalid`, (await page.locator("#enq-interest-group").getAttribute("aria-invalid")) === "true");
  await shot(page, `${width}-1-error`);

  // Tapping a chip selects it and advances.
  await page.locator("#begin label", { hasText: "Pain & Injury" }).click();
  await page.waitForTimeout(500);
  check(`[${width}] chip tap advances to step 2`, (await stepTitle(page).textContent()) === "When would you like to start?");

  await page.locator("#begin label", { hasText: "This week" }).click();
  await page.waitForTimeout(500);
  check(`[${width}] advances to step 3`, (await stepTitle(page).textContent()) === "How should we reach you?");
  check(`[${width}] +91 prefix shown`, await page.locator("#begin").getByText("+91").isVisible());

  // Step 3: invalid phone and email.
  await page.fill("#enq-name", "Test Person");
  await page.fill("#enq-phone", "12345");
  await page.fill("#enq-email", "not-an-email");
  await page.locator("#begin button[type=submit]").click();
  check(`[${width}] phone error shown`, await page.locator("#enq-phone-error").isVisible());
  check(`[${width}] email error shown`, await page.locator("#enq-email-error").isVisible());
  const focused = await page
    .waitForFunction(() => document.activeElement?.id === "enq-phone", null, { timeout: 1500 })
    .then(() => true)
    .catch(() => false);
  check(`[${width}] focus moved to first invalid field`, focused);
  await shot(page, `${width}-3-error`);

  await page.fill("#enq-phone", "98765 43210");
  await page.fill("#enq-email", "");
  await page.locator("#begin button[type=submit]").click();
  await page.waitForTimeout(300);
  check(`[${width}] advances to step 4`, (await stepTitle(page).textContent()) === "One last thing");

  // Step 4: submit without consent.
  await page.locator("#begin button[type=submit]").click();
  check(`[${width}] consent error shown`, await page.locator("#enq-consent-error").isVisible());
  await shot(page, `${width}-4-error`);

  // Back keeps earlier answers.
  await page.getByRole("button", { name: "Back" }).click();
  check(`[${width}] back keeps the name`, (await page.inputValue("#enq-name")) === "Test Person");
  await page.locator("#begin button[type=submit]").click();

  await page.check("#enq-consent");
  await page.locator("#begin button[type=submit]").click();
  await page.getByText("Thank you, Test.").waitFor({ timeout: 10000 });
  check(`[${width}] success state shown`, await page.getByText("We'll message you on WhatsApp within 24 hours.").isVisible());
  check(`[${width}] success has WhatsApp button`, await page.locator('[data-wa="form_success"]').isVisible());
  await shot(page, `${width}-5-success`);

  // No horizontal scroll introduced by the form.
  check(`[${width}] no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await context.close();
}

async function keyboardFlow() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}/?utm_source=qa&utm_campaign=launch#begin`, { waitUntil: "networkidle" });

  // Founders CTA sets the intent.
  await page.locator('a[data-cta="founders"]').click();
  await page.waitForTimeout(300);
  check("[kbd] founders CTA sets intent", await page.getByText("Applying for the founding cohort").isVisible());

  await page.locator("#enq-interest-0").focus();
  await page.keyboard.press("ArrowDown"); // selects the next option
  check("[kbd] arrow key selects without advancing", (await stepTitle(page).textContent()) === "What brings you in?");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check("[kbd] Enter advances to step 2", (await stepTitle(page).textContent()) === "When would you like to start?");
  check("[kbd] focus moves to the step heading", await page.evaluate(() => document.activeElement?.id === "enq-step-title"));

  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check("[kbd] reaches step 3", (await stepTitle(page).textContent()) === "How should we reach you?");

  await page.keyboard.press("Tab");
  await page.keyboard.type("Keyboard User");
  await page.keyboard.press("Tab");
  await page.keyboard.type("9123456789");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check("[kbd] reaches step 4", (await stepTitle(page).textContent()) === "One last thing");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Space");
  check("[kbd] consent ticked with Space", await page.isChecked("#enq-consent"));
  await page.keyboard.press("Enter");
  await page.getByText("Thank you, Keyboard.").waitFor({ timeout: 10000 });
  check("[kbd] submits and shows success", true);

  // A visible focus ring on the success heading's WhatsApp button.
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check("[kbd] focus ring visible", outline !== "none");
  await context.close();
}

// A bot that fills the honeypot sees success, but nothing is stored (check the
// server log: no "[enquiry]" line for "Spam Bot").
async function honeypotFlow() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}/#begin`, { waitUntil: "networkidle" });
  await page.locator("#begin label", { hasText: "Longevity" }).click();
  await page.waitForTimeout(400);
  await page.locator("#begin label", { hasText: "Just exploring" }).click();
  await page.waitForTimeout(400);
  await page.fill("#enq-name", "Spam Bot");
  await page.fill("#enq-phone", "9000000000");
  await page.locator("#enq-website").fill("http://spam.example", { force: true });
  await page.locator("#begin button[type=submit]").click();
  await page.check("#enq-consent");
  await page.locator("#begin button[type=submit]").click();
  await page.getByText("Thank you, Spam.").waitFor({ timeout: 10000 });
  check("[spam] honeypot submission gets a quiet success", true);
  await context.close();
}

for (const w of [390, 768, 1440]) await pointerFlow(w);
await keyboardFlow();
await honeypotFlow();
await browser.close();
console.log(results.join("\n"));
