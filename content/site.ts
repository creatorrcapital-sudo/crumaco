/**
 * CRUMACO landing page: all copy and configuration.
 *
 * Edit text here; components only read from this file.
 *
 * Conventions
 * - In headings, wrap the one or two accent words in *asterisks*. They render
 *   in italic orange (ember on light backgrounds).
 * - Anything marked PLACEHOLDER has not been supplied by the client yet.
 *   Empty placeholders are hidden on the page, so the demo still looks
 *   finished. Fill them in before launch (the README has the full list).
 * - `confirmed: false` hides an item (equipment, tests) until the client
 *   confirms it exists.
 * - `draft` notes mark copy that needs sign-off. Set SHOW_DRAFT_MARKERS to
 *   true to show those notes on the page while reviewing with the client.
 */

// ---------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------

export const flags = {
  /**
   * Photos of Tanvir with para-athletes (both founder photos show an
   * identifiable athlete). Written consent from every person pictured is
   * required before going live. When false, the founder section shows the
   * treatment room instead.
   */
  SHOW_ATHLETE_PROOF: true,
  /** Show small "Draft — ..." tags next to copy awaiting sign-off. */
  SHOW_DRAFT_MARKERS: false,
};

// ---------------------------------------------------------------------------
// Placeholders (PLACEHOLDER: supplied by the client before launch)
// ---------------------------------------------------------------------------

export const contact = {
  /** PLACEHOLDER: street address, e.g. "12, Example Marg" */
  streetAddress: "",
  locality: "Chhatarpur",
  city: "New Delhi",
  region: "Delhi",
  /** PLACEHOLDER: PIN code */
  postalCode: "",
  country: "IN",
  /** PLACEHOLDER: display phone, e.g. "+91 98XXX XXXXX" */
  phone: "",
  /** PLACEHOLDER: WhatsApp number, digits only with country code, e.g. "9198XXXXXXXX".
   *  While empty, WhatsApp buttons open WhatsApp with the message pre-filled
   *  and the visitor picks the contact. */
  whatsapp: "",
  /** PLACEHOLDER */
  email: "",
  /** PLACEHOLDER: full Instagram profile URL */
  instagram: "",
  /** PLACEHOLDER: opening hours, e.g. [{ days: "Mon–Sat", time: "7:00–21:00" }] */
  hours: [] as { days: string; time: string }[],
  /** PLACEHOLDER: Google Maps link to the Lab. While empty, the map link
   *  searches for "Chhatarpur, New Delhi". */
  mapUrl: "",
};

export const baselineDetails = {
  /** PLACEHOLDER, e.g. "90 minutes" */
  duration: "",
  /** PLACEHOLDER, e.g. "₹X,XXX" or "Complimentary for founding applicants" */
  price: "",
};

export const whatsappMessage = "Hi, I'd like to book a Baseline assessment at CRUMACO.";

// ---------------------------------------------------------------------------
// Brand and SEO
// ---------------------------------------------------------------------------

export const brand = {
  name: "CRUMACO",
  positioning: "Engineered Human Performance",
  supportingLine: "Systems, not workouts.",
  founder: "Tanvir Logani",
  areaServed: "Delhi NCR",
};

export const seo = {
  title: "CRUMACO — Sports Performance & Recovery Lab | Chhatarpur, New Delhi",
  /** Keep at 155 characters or fewer. */
  description:
    "A private, testing-led performance and recovery lab in Chhatarpur, New Delhi, founded by former NCAA and pro basketball player Tanvir Logani.",
  ogAlt: "CRUMACO — Human performance, engineered. Sports performance and recovery lab in Chhatarpur, New Delhi.",
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const nav = {
  links: [
    { label: "Founder", href: "#founder" },
    { label: "Method", href: "#method" },
    { label: "Lab", href: "#lab" },
    { label: "Programmes", href: "#programmes" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Request your Baseline",
};

// ---------------------------------------------------------------------------
// Preloader (plays on every page load; skipped for reduced motion)
// ---------------------------------------------------------------------------

export const preloader = {
  /** Drops in letter by letter; every letter but the first then falls away. */
  title: "Crumaco",
  /** Drops in beside the remaining first letter to form the monogram. */
  outro: "Lab",
  /** Small corner labels (from the Lab section heading). */
  tags: ["Measure", "Analyse", "Elevate"],
};

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

/*
 * Voice: selective, calm, certain. We never chase: the visitor requests, we
 * assess, and we offer a place only where the data says we can help. Every
 * claim is a fact from the brief or a sourced credential. Exclusivity comes
 * from how CRUMACO works (by application, a 20-place cohort), never from
 * invented scarcity, client names or results.
 */
export const hero = {
  eyebrow: "A private performance & recovery lab",
  headline: "Human performance, *engineered.*",
  /** Minimal hero: one line under the headline. */
  tagline: "Built by a former NCAA and professional basketball player. Membership by application.",
  location: "Chhatarpur, New Delhi",
  /** Shown in the band straight after the hero. */
  sub: "Every client starts with a Baseline: a full assessment of how you move, recover and perform. Places are offered only where the data shows we can help.",
  primaryCta: "Request your Baseline",
  secondaryCta: { label: "See how it works", href: "#method" },
  microcopy: ["Full assessment", "One-page report", "WhatsApp reply within 24 hours"],
  /** Credentials first: the band after the hero is the first proof a visitor sees.
   *  "{certifications}" is filled in with the live count from `founder`. */
  proof: [
    "Founded by Tanvir Logani — NCAA and professional basketball",
    "Chiropractic Doctor, Parker College of Chiropractic",
    "{certifications} certifications, including Westside Barbell and NASM",
    "Small cohorts. Membership by application.",
  ],
  image: {
    src: "/images/hero-lab.jpg",
    alt: "The CRUMACO performance floor in Chhatarpur, with testing and training equipment under a basketball hoop",
  },
  /** Set to "/video/hero.mp4" when the founder film arrives (muted loop; the
   *  image above is the poster and the reduced-motion fallback). */
  video: null as string | null,
};

// ---------------------------------------------------------------------------
// The problem (unnumbered, after Retested)
// ---------------------------------------------------------------------------

export const problem = {
  heading: "Most people get a session. *Our clients get a system.*",
  body: "A sore knee gets treated as a knee. A plateau gets blamed on effort. But the limit is rarely where it hurts. It sits upstream, in how you move, recover, eat, sleep and handle load. Finding it takes testing, not guessing. It is the only way we work.",
  symptoms: [
    "A knee that will not settle.",
    "A plateau that will not shift.",
    "A body that feels older than it should.",
  ],
  image: {
    src: "/images/philosophy.jpg",
    alt: "A practitioner assessing a client's hip and leg position on a treatment table",
  },
};

// ---------------------------------------------------------------------------
// The method (03)
// ---------------------------------------------------------------------------

export const method = {
  number: "04",
  label: "The method",
  heading: "Five moves, *always in this order.*",
  steps: [
    {
      name: "Assess",
      body: "We measure force, movement, muscle activation, aerobic capacity and recovery before a single exercise is prescribed.",
    },
    {
      name: "Correct",
      body: "We address the restriction, imbalance or habit that is actually driving the problem.",
    },
    {
      name: "Rebuild",
      body: "Strength and capacity come back progressively, on a foundation that can take load.",
    },
    {
      name: "Perform",
      body: "Training is pointed at the goal you came in with, then past it.",
    },
    {
      name: "Sustain",
      body: "We retest every quarter, adjust the plan and keep the gains for years, not weeks.",
    },
  ],
  image: { src: "/images/method.jpg", alt: "A runner in motion, blurred against a dark background" },
};

// ---------------------------------------------------------------------------
// Your Baseline (04)
// ---------------------------------------------------------------------------

export const baseline = {
  number: "05",
  label: "Your Baseline",
  heading: "Every client starts with *a Baseline.*",
  steps: [
    { title: "Conversation", body: "Your history, goals and what has not worked." },
    { title: "Movement & strength testing", body: "Measured, not eyeballed." },
    { title: "Recovery readings", body: "How ready your system is to perform." },
    { title: "Your report", body: "Where you are, what is holding you back, and the plan." },
  ],
  leaveWith: {
    title: "You leave with",
    items: ["A one-page report", "A recommended pathway", "A straight answer on whether we can help, with no obligation either way"],
  },
  cta: "Request your Baseline",
  image: {
    src: "/images/report.jpg",
    alt: "A coach holding a clipboard with a hand-drawn basketball play",
  },
};

// ---------------------------------------------------------------------------
// The Lab (05)
// ---------------------------------------------------------------------------

export const lab = {
  number: "06",
  label: "The Lab",
  heading: "Measure. Analyse. *Elevate.*",
  gallery: [
    {
      src: "/images/lab-treatment.jpg",
      alt: "The private treatment room at CRUMACO, with a treatment table and the illuminated CRUMACO logo",
      caption: "Treatment room",
    },
    {
      src: "/images/lab-floor.jpg",
      alt: "Testing and training equipment on the CRUMACO performance floor, with framed basketball jerseys on the wall",
      caption: "Performance floor",
    },
    {
      src: "/images/lab-group.jpg",
      alt: "People gathered on the training floor at CRUMACO",
      caption: "On the floor",
    },
  ],
  insideTitle: "Inside",
  inside: [
    { label: "Performance testing floor", confirmed: true },
    { label: "Full-body red light bed", confirmed: true },
    { label: "Contrast suite — cold plunge & infrared sauna", confirmed: true },
    { label: "Private treatment room", confirmed: true },
  ],
  /** Sample readings have their own section (07). Heading from the brochure. */
  readingsNumber: "07",
  readingsSectionLabel: "Sample readings",
  readingsHeading: "What we *measure.*",
  readingsLabel: "Illustrative sample readings",
  readingsNote: "Readings shown are illustrative samples of the report format, not client results.",
  /** Each test is unconfirmed until the client confirms the equipment exists.
   *  Set confirmed: false to hide a tile. Descriptions are from the brochure. */
  readings: [
    { test: "Force plate", value: 2.45, decimals: 2, unit: "bw", detail: "Peak force and left–right asymmetry, measured through the ground.", confirmed: true },
    { test: "Motion capture", value: 8.8, decimals: 1, unit: "m/s", detail: "How you actually move: stride, speed and mechanics.", confirmed: true },
    { test: "EMG", value: 92, decimals: 0, unit: "% symmetry", detail: "Which muscles fire, how hard and how evenly.", confirmed: true },
    { test: "VO₂ max", value: 61.2, decimals: 1, unit: "ml/kg/min", detail: "The ceiling of your aerobic engine.", confirmed: true },
    { test: "HRV", value: 91, decimals: 0, unit: "ms", detail: "How ready your nervous system is to perform and recover.", confirmed: true },
    { test: "Isokinetic", value: 188, decimals: 0, unit: "Nm", detail: "Joint strength through the full range, side against side.", confirmed: true },
  ],
};

// ---------------------------------------------------------------------------
// Who we help (06)
// ---------------------------------------------------------------------------

export const entries = {
  number: "08",
  label: "Who we help",
  heading: "Six ways *into the system.*",
  linkLabel: "See the programme",
  /** `programme` is the id of the programme each card opens. */
  items: [
    { id: "pain", title: "Pain & Injury", body: "Relieve pain, restore movement, rebuild strength.", programme: "pain-reset", image: { src: "/images/entry-pain.jpg", alt: "A practitioner guiding a client's leg through a hip mobility assessment" } },
    { id: "fitness", title: "Fitness & Transformation", body: "Get stronger, change your body composition, keep it.", programme: "body-transformation", image: { src: "/images/entry-fitness.jpg", alt: "A man pressing dumbbells on a bench in a dark gym" } },
    { id: "sport", title: "Sports Performance", body: "Speed, power and durability for the season ahead.", programme: "athlete-development", image: { src: "/images/entry-sport.jpg", alt: "An athlete's feet in running spikes on a blue track surface" } },
    { id: "recovery", title: "Recovery & Regulation", body: "Sleep, recover and adapt between hard sessions.", programme: "nervous-system-reset", image: { src: "/images/entry-recovery.jpg", alt: "A man sitting in an ice bath outdoors" } },
    { id: "nutrition", title: "Health & Nutrition", body: "Eat for how you train and how you want to feel.", programme: "body-transformation", image: { src: "/images/entry-nutrition.jpg", alt: "A table of fruit, pastries and a pasta dish seen from above" } },
    { id: "longevity", title: "Longevity", body: "Strength, balance and capacity to stay independent for longer.", programme: "longevity", image: { src: "/images/entry-longevity.jpg", alt: "An older man training with a kettlebell in a gym" } },
  ],
};

// ---------------------------------------------------------------------------
// Signature programmes (07)
// ---------------------------------------------------------------------------

export const programmes = {
  number: "09",
  label: "Signature programmes",
  heading: "Seven pathways. *One system.*",
  labels: { bestFor: "Best for", pillars: "Pillars", startsWith: "Starts with" },
  startsWith: "A full assessment",
  /** Best for, pillars and category labels are from the brochure. */
  items: [
    {
      id: "human-movement-reset",
      name: "Human Movement Reset",
      category: "Foundation",
      tagline: "Rebuild. Restore. Reset.",
      summary: "We start at the foundation, with movement, mobility and baseline capacity, before anything is loaded on top.",
      bestFor: "Anyone starting out or returning to training",
      pillars: ["Movement", "Recovery"],
      image: { src: "/images/prog-01.jpg", alt: "A woman holding a barbell squat in a sunlit gym" },
    },
    {
      id: "pain-reset",
      name: "Pain Reset™",
      category: "Pain & Injury",
      tagline: "Move without pain setting the limits.",
      summary: "We find the root cause, correct it and rebuild the strength that helps keep pain from returning. Treatment and training run as one plan, not two.",
      bestFor: "Pain & injury",
      pillars: ["Movement", "Recovery", "Mindset"],
      image: { src: "/images/prog-02.jpg", alt: "A practitioner's hands working on a client's lower back" },
    },
    {
      id: "body-transformation",
      name: "Body Transformation™",
      category: "Fitness",
      tagline: "Measured. Progressive. Kept.",
      summary: "Builds strength and changes body composition, then holds the result, tracked against your own baseline.",
      bestFor: "Fitness & transformation",
      pillars: ["Movement", "Nutrition", "Mindset"],
      image: { src: "/images/prog-03.jpg", alt: "A man in a deep barbell squat in a dark gym" },
    },
    {
      id: "athlete-development",
      name: "Athlete Development System™",
      category: "Sport",
      tagline: "Speed, strength and power, on a timeline.",
      summary: "Testing-led training programmed around your season, with load monitored so you arrive ready, not worn out.",
      bestFor: "Sports performance",
      pillars: ["Movement", "Recovery", "Cognition"],
      image: { src: "/images/prog-04.jpg", alt: "An athlete driving a weighted sled across a training floor" },
    },
    {
      id: "executive-performance",
      name: "Executive Performance",
      category: "Leadership",
      tagline: "Energy. Focus. Stamina.",
      summary: "Better energy, focus and decision-making, built around a demanding calendar.",
      bestFor: "Leaders and professionals",
      pillars: ["Cognition", "Nutrition", "Recovery"],
      image: { src: "/images/prog-05.jpg", alt: "A man training on a rowing machine" },
    },
    {
      id: "nervous-system-reset",
      name: "Nervous System Reset™",
      category: "Regulation",
      tagline: "Down-regulate. Recover. Refocus.",
      summary: "Bring the body out of constant alert, so recovery, sleep and focus can follow.",
      bestFor: "Recovery & regulation",
      pillars: ["Recovery", "Mindset", "Cognition"],
      image: { src: "/images/prog-06.jpg", alt: "A person sitting cross-legged on a mat beside lit candles" },
    },
    {
      id: "longevity",
      name: "Longevity System",
      category: "Longevity",
      tagline: "Live better, for longer.",
      summary: "Strength and balance keep you independent; aerobic capacity and recovery keep you energetic.",
      bestFor: "Longevity & healthy ageing",
      pillars: ["Movement", "Nutrition", "Recovery"],
      image: { src: "/images/prog-07.jpg", alt: "An older couple holding a balance pose with arms outstretched" },
    },
  ],
  /** From the brochure. */
  notSure: {
    title: "Not sure which pathway is yours?",
    body: "You don't pick it. Your Baseline does. We recommend the pathway from your results, not from a menu.",
    cta: "Request your Baseline",
  },
};

// ---------------------------------------------------------------------------
// The founder (01): straight after the hero, credentials first
// ---------------------------------------------------------------------------

export const founder = {
  number: "01",
  label: "The founder",
  heading: "He played the game. *Now he engineers it.*",
  draft: "Draft — founder to approve",
  body: [
    "I spent my playing years in American college basketball and then the professional game. At that level, nothing runs on feel. Load, recovery and readiness are measured, and every decision is made from the numbers.",
    "Most people never get that standard. They get a session, a routine and a guess. CRUMACO exists to give the people who want it the standard I trained under.",
    "We keep our client list small on purpose, and we only take on people we can genuinely help.",
  ],
  signature: "Tanvir Logani",
  role: "Founder",
  /** One-line summary under the heading. "{certifications}" is the live count. */
  summary: "Former NCAA and professional basketball player. Chiropractic Doctor. {Certifications} certifications across strength, conditioning, rehab and nutrition.",
  /** Credentials have their own section (02), straight after the founder. */
  credentialsNumber: "02",
  credentialsTitle: "Credentials",
  credentialsHeading: "Earned on the court. *Certified off it.*",
  /**
   * Sources: Tanvir's LinkedIn education and certifications (screenshots
   * supplied by the client), the St. Joseph's Long Island men's basketball
   * roster (2011–12), and press coverage of the Asian Para Games team.
   * The client should confirm exact titles and years before launch.
   */
  credentials: [
    {
      category: "Doctorate",
      title: "Chiropractic *Doctor*",
      issuer: "Parker College of Chiropractic",
      featured: true,
    },
    {
      category: "Degree",
      title: "Bachelor of Science",
      issuer: "St. Joseph's University, New York",
      years: "2010–2013",
      detail: "Coursework in exercise science, kinesiology, nutrition, psychology, sports management and physical therapy.",
    },
    { category: "Certification", title: "Strength and Sports Conditioning Specialist", issuer: "Westside Barbell" },
    { category: "Certification", title: "Certified Strength Coach", issuer: "Westside Barbell" },
    { category: "Certification", title: "Athlete Trainer", issuer: "National Academy of Sports Medicine (NASM)" },
    { category: "Certification", title: "Personal Trainer Certification", issuer: "National Academy of Sports Medicine (NASM)" },
    {
      category: "Playing career",
      title: "NCAA college basketball, then the professional game",
      issuer: "St. Joseph's Golden Eagles, New York",
    },
    {
      category: "Coaching",
      title: "Indian para powerlifting",
      issuer: "Asian Para Games, Hangzhou",
      detail: "Led a team of Indian para powerlifters to the Asian Para Games.",
    },
  ] as { category: string; title: string; issuer: string; years?: string; detail?: string; featured?: boolean }[],
  /**
   * Further certifications from Tanvir's LinkedIn (titles as listed; no
   * issuer shown there). Two LinkedIn entries are deliberately left out
   * because they conflict with the site's compliance rules; see README.
   */
  specialistsTitle: "Specialist certifications",
  specialists: [
    { name: "Sports Performance Training", scope: "Sports Medicine Specialist" },
    { name: "Corrective Training", scope: "Sports, Lifestyle and Clinical" },
    { name: "Fascial Stretching", scope: "Mobility Specialist" },
    { name: "Functional Taping", scope: "Pain Management, Rehab & Sports Medicine" },
    { name: "Thai Bodywork", scope: "Sports and Clinical" },
    { name: "Cupping Therapist", scope: "Sports, Lifestyle and Clinical" },
    { name: "Nutritionist", scope: "Sports, Lifestyle and Clinical" },
  ],
  cta: "Request your Baseline",
  images: {
    main: { src: "/images/founder-coaching.webp", alt: "Tanvir Logani coaching an athlete at a para-sport event" },
    proof: { src: "/images/founder-athlete.webp", alt: "Tanvir Logani with an athlete at a para-sport competition" },
    /** Shown when SHOW_ATHLETE_PROOF is false. */
    fallback: { src: "/images/lab-treatment.jpg", alt: "Tanvir Logani's treatment room at CRUMACO" },
  },
};

/** Live certification count (main list + specialist list), so copy that
 *  quotes it never drifts from the credentials themselves. */
export const certificationCount =
  founder.credentials.filter((c) => c.category === "Certification").length + founder.specialists.length;

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];

/** Fills copy placeholders with the live count: "{certifications}" as digits
 *  (for the sans), "{Certifications}" as a word (for serif lines, where a "1"
 *  reads like an "l"). */
export const withCounts = (text: string) =>
  text
    .replace("{certifications}", String(certificationCount))
    .replace("{Certifications}", NUMBER_WORDS[certificationCount] ?? String(certificationCount));

// ---------------------------------------------------------------------------
// Founders Programme (08)
// ---------------------------------------------------------------------------

export const foundersProgramme = {
  number: "10",
  label: "Founders Programme",
  eyebrow: "Founding cohort · 20 places · Applications open December",
  heading: "Membership is *by application.*",
  body: "The founding cohort is capped at 20, so every member gets real time with Tanvir and the team. Every membership begins with an assessment, and places are offered only where the results show we can help.",
  places: 20,
  placesLabel: "places in the founding cohort",
  includesTitle: "Membership includes",
  draft: "Draft — pending legal approval of terms",
  includes: [
    "Baseline and quarterly re-test with a fresh report",
    "Regular 1:1 sessions with Tanvir",
    "Recovery suite access",
    "A direct WhatsApp line to the team",
  ],
  price: "Billed quarterly · Pricing shared after your assessment",
  cta: "Apply for the founding cohort",
};

// ---------------------------------------------------------------------------
// Retested, not remembered (02)
// ---------------------------------------------------------------------------

export const results = {
  number: "03",
  label: "Retested, not remembered",
  heading: "Retested, *not remembered.*",
  /** From the brochure. */
  intro: "Every quarter you are retested against your own baseline. You see exactly what moved, what didn't, and the target for the next twelve weeks. No guesswork, no flattering estimates.",
  columns: { metric: "Metric", baseline: "Baseline", after: "Week 12", change: "Change" },
  /** `domain` sets the scale of each change bar. */
  rows: [
    { metric: "Peak force", baseline: 2.1, after: 2.45, decimals: 2, unit: "bw", domain: [1.5, 3] },
    { metric: "L–R asymmetry", baseline: 14, after: 6, decimals: 0, unit: "%", domain: [0, 20] },
    { metric: "Resting HRV", baseline: 68, after: 81, decimals: 0, unit: "ms", domain: [40, 100] },
    { metric: "Mobility screen", baseline: 11, after: 17, decimals: 0, unit: "/21", domain: [0, 21] },
    { metric: "VO₂ max", baseline: 52.4, after: 55.1, decimals: 1, unit: "", domain: [40, 65] },
  ] as { metric: string; baseline: number; after: number; decimals: number; unit: string; domain: [number, number] }[],
  caption: "Illustrative example. Individual results vary.",
};

// ---------------------------------------------------------------------------
// FAQ (09)
// ---------------------------------------------------------------------------

export const faq = {
  number: "11",
  label: "FAQ",
  heading: "Questions, *answered.*",
  stillUnsure: "Still unsure? Message us on WhatsApp.",
  mapLabel: "Open in Google Maps",
  items: [
    { q: "Do I need to be an athlete?", a: "No. Tanvir trained at an elite level, but most clients come with pain, a plateau or a goal like staying strong as they age. The standard is the same." },
    { q: "Why is membership by application?", a: "Because the method depends on real time with the team. We keep the cohort small so that time stays real, and we only offer places where your Baseline shows we can help." },
    { q: "What happens at the Baseline?", a: "A conversation, then movement, strength and recovery testing, then your one-page report and recommended pathway." },
    { q: "How much does it cost?", a: "Programmes are billed quarterly. We share pricing after your assessment, once we know what you actually need." },
    { q: "Can I come in with an injury?", a: "Yes. That is one of the most common starting points. If something needs a doctor first, we will tell you." },
    { q: "What if I am not accepted into the founding cohort?", a: "We will tell you honestly and point you to the right next step." },
    { q: "Where are you?", a: "Chhatarpur, New Delhi.", map: true },
  ],
};

// ---------------------------------------------------------------------------
// Final call to action and form (10)
// ---------------------------------------------------------------------------

export const finalCta = {
  number: "12",
  label: "Begin",
  heading: "Move better. Feel better. Perform better. *Live better.*",
  sub: "Request your Baseline. We will tell you honestly whether we can help.",
  image: { src: "/images/cta.jpg", alt: "" },
  /** Objections answered next to the form (from the FAQ). */
  reassurance: [
    { label: "Fitness level", text: "No need to be an athlete. Most people start with pain, a plateau or a goal." },
    { label: "Injury", text: "One of the most common starting points. If something needs a doctor first, we will tell you." },
    { label: "Cost", text: "Pricing is shared after your assessment, once we know what you actually need." },
  ],
};

export const form = {
  steps: {
    interest: "What brings you in?",
    timing: "When would you like to start?",
    details: "How should we reach you?",
    consent: "One last thing",
  },
  notSure: "Not sure",
  timingOptions: ["This week", "This month", "Just exploring"],
  fields: {
    name: "Your name",
    phone: "Mobile number",
    phoneHint: "We reply on WhatsApp",
    email: "Email",
    emailHint: "Optional",
  },
  consent:
    "I agree to CRUMACO contacting me on WhatsApp/phone about my enquiry and storing these details as described in the Privacy Policy.",
  founderIntent: "Applying for the founding cohort",
  noFriction: "No account, no payment.",
  next: "Continue",
  back: "Back",
  submit: "Request my Baseline",
  submitting: "Sending…",
  errors: {
    interest: "Choose what brings you in.",
    timing: "Choose when you would like to start.",
    name: "Please enter your name.",
    phone: "Enter a valid 10-digit Indian mobile number.",
    email: "Enter a valid email address, or leave it blank.",
    consent: "Please tick the box so we can contact you.",
    generic: "Something went wrong sending your request. Please try again, or message us on WhatsApp.",
    rateLimited: "Too many requests from this connection. Please wait a few minutes, or message us on WhatsApp.",
  },
  success: {
    heading: "Thank you, {name}.",
    body: "We'll message you on WhatsApp within 24 hours.",
    whatsapp: "Message us on WhatsApp",
    nextTitle: "What happens next",
    next: [
      "We message you on WhatsApp to find a time for your Baseline.",
      "Your Baseline: a conversation, then movement, strength and recovery testing.",
      "You leave with your one-page report and a recommended pathway.",
    ],
  },
};

// ---------------------------------------------------------------------------
// Footer, sticky bar
// ---------------------------------------------------------------------------

export const footer = {
  visit: "Visit",
  hoursLabel: "Hours",
  connect: "Connect",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  privacy: "Privacy Policy",
  smallPrint: "Information on this site is general and is not medical advice. Individual results vary.",
};

export const stickyBar = {
  cta: "Request your Baseline",
  whatsappLabel: "Message CRUMACO on WhatsApp",
};
