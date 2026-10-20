# CRUMACO — landing page

Single-page site for CRUMACO, the sports performance and recovery lab in Chhatarpur, New Delhi.
Next.js 16 (App Router, TypeScript), Tailwind CSS v4, two shadcn/ui primitives (Accordion, Sheet), deployed on Vercel.

One goal: **book a Baseline**. Secondary: apply for the founding cohort. Tertiary: WhatsApp.

---

## Run it

Requires Node 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
```

### Edit the content

All copy, flags and placeholders live in **`content/site.ts`**. Components only read from it.

- In headings, wrap the one or two accent words in `*asterisks*`. They render in italic orange (darker ember on light backgrounds).
- Set `confirmed: false` on any test or room to hide it from the page.
- Empty placeholders are hidden on the page, so the demo looks finished.

### Assets

The photos and logo files were produced by two one-off scripts. You only need to rerun them if the source files change.

```bash
node scripts/prepare-assets.mjs "../curmaco pics"   # photos → /public/images, logos → /public/brand, app icons
node scripts/make-topo.mjs                          # topographic texture → /public/textures/topo.svg
```

- `prepare-assets.mjs` renames and crops the photos as the brief specifies: `17.jpg` cropped left, the face cropped out of `1.jpg`, and the tub wordmark cropped off `10.jpg`. It then writes `content/image-meta.generated.ts`, which holds each photo's size and its average colour (used as the placeholder while it loads).
- `5.jpg` and `13.jpg` (other gyms' branding) are deliberately not used. Neither are the WhatsApp concept images or the Ideogram screenshots, which were style references only.
- The logos in `/public/brand` were extracted from the brochure PDF (`Crumaco-Edition-01.pdf`): the full logo and the triangle mark, recoloured to orange and white.
- **TODO:** swap in the client's SVG logo when it is supplied.

### Page order

Preloader → minimal hero → proof band → **01 The founder** → **02 Credentials** → **03 Retested, not remembered** → the problem → 04 Method → 05 Baseline → 06 Lab → 07 Sample readings → 08 Who we help → 09 Programmes → 10 Founders Programme → 11 FAQ → 12 Begin (the form).

Proof comes first on purpose: who is behind the method, then what clients get back.

The design is deliberately minimal:
- The hero is a photo, one headline, one line and one button, with a thin "See how it works / Chhatarpur, New Delhi" bar.
- Dense content is split into more, simpler sections.
- Lists use hairline rows instead of boxes and cards.
- The nav is the logo, a booking button and a full-screen Menu.
- The topographic texture now appears only in the footer and the menu.

### Copy voice

The copy is selective and calm: the visitor *requests* a Baseline, CRUMACO assesses, and a place is offered only where the data shows it can help.

- It leans on Tanvir's NCAA and professional basketball career, his doctorate and his certifications.
- Every claim is a brief fact or a sourced credential. Exclusivity comes from how CRUMACO works (membership by application, a 20-place founding cohort), never from invented scarcity, client names or results.
- Primary buttons read "Request your Baseline".
- Certification counts in the copy come from `withCounts()` in `content/site.ts`, so they always match the credentials list.
- The founder's paragraphs are still marked "Draft — founder to approve".

### Motion

All motion is off for visitors who prefer reduced motion. Content is always readable without JavaScript.

- **Preloader.** This is adapted from the Codegrid "Nullspace" component (`code.zip`), in `components/preloader.tsx`:
  1. Three corner tags ("Measure · Analyse · Elevate") and "CRUMACO" drop in letter by letter.
  2. Every letter but the C falls away, and "LAB" drops in beside it.
  3. The two slide together and morph into the monogram: a bold, orange, raised C next to a large LAB.
  4. A slit opens through the middle, then the screen splits top and bottom onto the hero.

  The small orange CRUMACO mark sits above the name and the monogram throughout, and rides up with the top half.

  It plays on **every page load**, about 4.4 s in total, and is skipped for reduced motion. The words come from `preloader` in `content/site.ts`.

  It was rebuilt in plain CSS rather than GSAP. GSAP is over the brief's 20 KB animation-library limit, and a JavaScript-driven preloader would leave phones on a black screen until the scripts load.

  The monogram's moves are measured from Hanken Grotesk and set in em, so they scale at every width. **If you change the words, re-measure the offsets** at the top of the "Opening sequence" block in `app/globals.css`.

  The hero is fully painted underneath the whole time, so the preloader does not delay LCP.
- **Parallax, two layers.**
  - **CSS layer.** Photos drift inside their frames, and the hero image and headline move at different speeds. This uses native CSS scroll-driven animations: no JavaScript, and it runs on the compositor. Browsers without support (currently Firefox) show those static.
  - **GSAP layer.** The React Bits `AnimatedContent` component (`components/ui/animated-content.tsx`, GSAP + ScrollTrigger) ties motion to the scroll position. Uses:
    - the founder's two photos, on two speeds;
    - the Lab gallery, at three depths;
    - the "Chiropractic Doctor" line, sliding in sideways;
    - the problem, Baseline and closing photos;
    - the "20" numeral;
    - the proof statement;
    - a staggered entrance for the "Who we help" tiles and the sample readings.
  - **Loading.** GSAP (about 40 KB compressed) loads on demand after the page is interactive, so it is not in the critical download. Content stays visible without JavaScript or if GSAP fails to load.
  - **Overflow.** The page clips sideways overflow, so horizontal slide-ins can never widen it on phones.
- **Smooth scrolling.** Lenis (about 4 KB) smooths wheel and trackpad scrolling on desktop, and in-page links glide to their section. It only loads on mouse or trackpad devices; phones keep native touch scrolling and download nothing extra.
- **Reveals and counters.** Sections rise in as they enter the viewport, the sample numerals count up, and the report bars grow.

### Hero film

When the founder film arrives:

1. Save it as `public/video/hero.mp4`.
2. Set `hero.video` to `"/video/hero.mp4"` in `content/site.ts`.

It plays muted, looped and inline, with the hero photo as its poster. Visitors who prefer reduced motion see the photo instead.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. Set the same keys in Vercel.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonical, Open Graph and JSON-LD links. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement ID. The script loads only when this is set. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID. The script loads only when this is set. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key. Used server-side only; never exposed to the browser. |
| `ENQUIRY_RATE_LIMIT` | Optional. Enquiries allowed per IP per 10 minutes (default 5). |

**Without the Supabase variables** the form still works for the demo. Each submission is written to the server log (`[enquiry] Supabase not configured; submission: …`) and the visitor sees the success state. **Configure Supabase before going live**, or enquiries are only in the logs.

### Analytics events

Sent to GA4 and Meta Pixel when they are loaded. `form_submit` is also sent to Meta as a standard `Lead`.

| Event | Parameters |
|---|---|
| `cta_click` | `location`: hero, nav, credentials, baseline, programmes, founders, sticky_bar or mobile_menu |
| `form_start` | `intent`, `location` |
| `form_step` | `n`: the step number |
| `form_submit` | `intent` (baseline or founders), `location` |
| `whatsapp_click` | `location`: floating, sticky_bar, mobile_menu, faq, footer or form_success |

---

## Supabase

Run this in the Supabase SQL editor:

```sql
create table public.applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  intent         text not null check (intent in ('baseline', 'founders')),
  interest       text not null,          -- pain, fitness, sport, recovery, nutrition, longevity, not-sure
  start_when     text not null,          -- This week / This month / Just exploring
  name           text not null,
  phone          text not null,          -- E.164, e.g. +919876543210
  email          text,
  consent        boolean not null,
  source_section text,                   -- which CTA opened the form
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_term       text,
  utm_content    text
);

-- Lock the table down: no public access. The site inserts with the service
-- role key from the server, which bypasses RLS.
alter table public.applications enable row level security;
```

The form collects only what is needed to reply: name, mobile, optional email, interest, timing and consent. There are no medical history fields.

### Spam protection

- **Honeypot field.** Bots that fill it see a success message, but nothing is stored.
- **Per-IP rate limit.** This is in-memory, so each Vercel instance keeps its own count. If spam becomes a problem, move it to a shared store such as Upstash Redis.

---

## Placeholders still to fill (`content/site.ts`)

| What | Where | Until filled |
|---|---|---|
| Street address | `contact.streetAddress` | Footer shows "Chhatarpur, New Delhi" |
| PIN code | `contact.postalCode` | Hidden |
| Phone | `contact.phone` | Hidden |
| WhatsApp number | `contact.whatsapp` (digits with country code, e.g. `9198…`) | WhatsApp buttons open with the message pre-filled and the visitor picks the contact |
| Opening hours | `contact.hours` | Hidden |
| Email | `contact.email` | Hidden |
| Instagram | `contact.instagram` | Hidden |
| Google Maps link | `contact.mapUrl` | The map link searches for "Chhatarpur, New Delhi" |
| Baseline duration | `baselineDetails.duration` | The duration/price line is hidden while both are empty |
| Baseline price | `baselineDetails.price`, e.g. a price or "Complimentary for founding applicants" | As above |
| Logo SVG | `/public/brand` and the TODO comments in `nav.tsx`, `footer.tsx` and `mobile-menu.tsx` | Brochure PNGs are used |
| Privacy Policy | `app/privacy/page.tsx` (a placeholder page, set to `noindex`) | Placeholder text is shown |
| Hero film | `public/video/hero.mp4` and `hero.video` | Hero photo is shown |

---

## Needs real-world sign-off before launch

| Item | Where | What is needed |
|---|---|---|
| **Athlete consent** | `flags.SHOW_ATHLETE_PROOF` (default `true` for the demo) | **Written consent from every person pictured is required before going live.** Both founder photos show an identifiable para-athlete. With the flag off, the founder section shows the treatment room instead. No caption names an athlete or a medal. |
| **Founder copy** | `founder.body` (marked "Draft — founder to approve") | Tanvir approves the wording in his voice. |
| **Founders Programme terms** | `foundersProgramme.includes` (marked "Draft — pending legal approval of terms") | Legal approves the inclusions, the 20-place cap, quarterly billing and the December opening. |
| **Equipment** | `lab.readings[].confirmed` and `lab.inside[].confirmed` | Confirm that each test exists: force plate, motion capture, EMG, VO₂ max, HRV and isokinetic. All are `true` for the demo. Also confirm the testing floor and treatment room. The red light bed and contrast suite were confirmed in the brief. |
| **Certifications left off the site** | Tanvir's LinkedIn | Two LinkedIn certifications are deliberately **not shown** because they conflict with the brief's compliance rules: "Colon Hydrotherapist – Pre Training & Lifestyle Diseases" (lifestyle-disease wording, and a cleansing-type procedure the brief rules out) and "Spot Fat Reduction – Hormonal Balancing Specialist" (implies body-result and hormonal treatment claims). Add them only after legal sign-off. Legal may also want to review "Cupping Therapist" and the "Clinical" wording in some certification titles. |
| **Founder credentials** | `founder.credentials`, `founder.specialists` | Confirm every title, issuer and year. They come from Tanvir's LinkedIn education and certifications (screenshots supplied), the St. Joseph's Long Island men's basketball roster (2011–12), and a 2023 press release about the Indian para powerlifting team at the Asian Para Games, Hangzhou. A third-party directory (ZoomInfo) lists "Palmer College of Chiropractic", but LinkedIn says **Parker**; the site uses Parker. The LinkedIn certifications page needs a sign-in, so any certification not in the screenshots is still missing. |
| **Doctor title before his name** | Everywhere Tanvir is named | The site shows his chiropractic doctorate as a credential but **does not** prefix his name with the doctor title, following the original brief. Whether a chiropractor may use that title in India is a legal question; decide it with the client before changing the name anywhere. |
| **Copy taken from the brochure** | `programmes.items[].bestFor`, `.pillars`, `.category`, `programmes.notSure`, `lab.readings[].detail`, `results.intro` | The brief did not supply these, so they come from the client's own brochure (`Crumaco-Edition-01`). Confirm they still apply. |
| **Health & Nutrition card** | `entries.items` (`programme: "body-transformation"`) | There is no nutrition programme, so this card opens Body Transformation™. Change it in one line if another fits better. |

Set `flags.SHOW_DRAFT_MARKERS` to `true` to show small "Draft" tags beside the copy awaiting sign-off while reviewing with the client.

### Compliance notes

- No claims about diseases or medical outcomes, no medical procedures, no trust logos, no testimonials, no ratings, and no before/after photos.
- Every sample metric is labelled in visible text: "Illustrative sample readings" in the Lab, and "Illustrative example. Individual results vary." under the sample report.
- Scarcity is stated honestly ("20 places"), with no countdowns.
- Credentials are set as text, not issuers' logos, so nothing reads as an endorsement or trust badge.
- The para powerlifting credential names the event, not individual athletes.
- Run `node scripts/check-banned-words.mjs` after any copy change. Whole-word hits must be zero.
- Some licensed stock photos show sportswear brand marks: a swoosh on the spikes in `entry-sport.jpg` and a logo on the shorts in `philosophy.jpg`. These are not trust logos, but swap the images if the client would rather show no third-party marks.
- **Colour:** brand ember `#E2741A` measures 2.7:1 on bone, below WCAG AA's 3:1 even for large text. Italic display words and numerals on light backgrounds therefore use `ember-text` `#CF6410` (3.3:1). Brand ember is kept for bars and accents. Change it in `app/globals.css` if the client prefers the exact brochure tone over AA compliance.

---

## QA

Run these against a running server. Start it with `ENQUIRY_RATE_LIMIT=50` so repeated form runs are not throttled.

```bash
QA_URL=http://localhost:3000 node scripts/qa-screenshots.mjs   # every section at 390/768/1440 → /qa, plus layout checks
QA_URL=http://localhost:3000 node scripts/qa-form.mjs          # validation, pointer + keyboard flows, success, honeypot
QA_URL=http://localhost:3000 node scripts/qa-interactions.mjs  # sticky bar, menu, deep links, counters, metadata
node scripts/check-banned-words.mjs                            # compliance grep
```

- **`qa-screenshots.mjs`** flags horizontal scroll, elements overflowing the viewport, a single word left alone on the last line of a heading of four or more words, stretched or missing images, and missing alt text.
- **Results** from the last run are in `/qa`: screenshots, `form-results.txt`, `interaction-results.txt` and `lighthouse-mobile.report.html`.

---

## Deploy (Vercel)

1. Import the repository in Vercel. The framework preset is Next.js and needs no changes.
2. Add the environment variables above, including the Supabase keys before launch.
3. Set `NEXT_PUBLIC_SITE_URL` to the final domain once it is connected.
4. After the first deploy, run Lighthouse against the live URL. Vercel's CDN, HTTP/2 and Brotli usually beat localhost numbers.
