// Shared by the form (client) and the server action, so both validate the same way.

export const INTERESTS = ["pain", "fitness", "sport", "recovery", "nutrition", "longevity", "not-sure"] as const;
export const TIMINGS = ["This week", "This month", "Just exploring"] as const;
export const INTENTS = ["baseline", "founders"] as const;

export type Intent = (typeof INTENTS)[number];

export type EnquiryInput = {
  intent: Intent;
  interest: string;
  timing: string;
  name: string;
  phone: string; // 10 digits, without +91
  email: string;
  consent: boolean;
  source: string;
  utm: Record<string, string>;
  /** Honeypot: real people never fill this. */
  website: string;
};

export type FieldErrors = Partial<Record<"interest" | "timing" | "name" | "phone" | "email" | "consent", true>>;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Strips spaces, dashes and a leading +91 / 91 / 0. */
export function normalisePhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export const isIndianMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function validateEnquiry(input: Pick<EnquiryInput, "interest" | "timing" | "name" | "phone" | "email" | "consent">) {
  const errors: FieldErrors = {};
  if (!(INTERESTS as readonly string[]).includes(input.interest)) errors.interest = true;
  if (!(TIMINGS as readonly string[]).includes(input.timing)) errors.timing = true;
  if (input.name.trim().length < 2 || input.name.trim().length > 80) errors.name = true;
  if (!isIndianMobile(normalisePhone(input.phone))) errors.phone = true;
  if (input.email.trim() && (!isEmail(input.email.trim()) || input.email.length > 120)) errors.email = true;
  if (input.consent !== true) errors.consent = true;
  return errors;
}
