"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { entries, form } from "@/content/site";
import { submitEnquiry } from "@/app/actions/enquiry";
import { track } from "@/lib/analytics";
import { whatsappHref } from "@/lib/links";
import { UTM_KEYS, validateEnquiry, type FieldErrors, type Intent } from "@/lib/enquiry";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/icons";

const STEP_COUNT = 4;
const STEP_FIELDS: (keyof FieldErrors)[][] = [["interest"], ["timing"], ["name", "phone", "email"], ["consent"]];
const STEP_TITLES = [form.steps.interest, form.steps.timing, form.steps.details, form.steps.consent];

const INTEREST_OPTIONS = [
  ...entries.items.map((e) => ({ value: e.id, label: e.title })),
  { value: "not-sure", label: form.notSure },
];

type Values = {
  interest: string;
  timing: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
  website: string;
};

const FIELD_IDS: Record<keyof FieldErrors, string> = {
  interest: "enq-interest-0",
  timing: "enq-timing-0",
  name: "enq-name",
  phone: "enq-phone",
  email: "enq-email",
  consent: "enq-consent",
};

function ErrorText({ id, show, children }: { id: string; show: boolean; children: string }) {
  return show ? (
    <p id={id} className="mt-2 flex items-center gap-2 text-sm text-orange">
      <span aria-hidden="true" className="h-[1.5px] w-3 bg-orange" />
      {children}
    </p>
  ) : null;
}

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  onPick,
  error,
  columns,
}: {
  name: "interest" | "timing";
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  /** Pointer selection: advance automatically. Keyboard users press Continue. */
  onPick: (v: string) => void;
  error: boolean;
  columns: string;
}) {
  const errorId = `enq-${name}-error`;
  return (
    <div
      id={`enq-${name}-group`}
      role="radiogroup"
      aria-label={legend}
      aria-invalid={error || undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <div className={cn("grid gap-2.5", columns)}>
        {options.map((opt, i) => (
          <label
            key={opt.value}
            onClick={(e) => {
              if (e.detail > 0) onPick(opt.value);
            }}
            className={cn(
              "relative flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 text-[15px] font-medium text-bone transition-colors duration-200",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange",
              value === opt.value ? "border-orange bg-orange/10" : "border-bone/20 hover:border-bone/45",
            )}
          >
            <input
              id={`enq-${name}-${i}`}
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 flex-none items-center justify-center rounded-full border transition-colors",
                value === opt.value ? "border-orange" : "border-bone/40",
              )}
            >
              <span className={cn("size-2 rounded-full bg-orange transition-opacity", value === opt.value ? "opacity-100" : "opacity-0")} />
            </span>
            {opt.label}
          </label>
        ))}
      </div>
      <ErrorText id={errorId} show={error}>
        {form.errors[name]}
      </ErrorText>
    </div>
  );
}

export function EnquiryForm() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent>("baseline");
  const [source, setSource] = useState("direct");
  const [values, setValues] = useState<Values>({ interest: "", timing: "", name: "", phone: "", email: "", consent: false, website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formError, setFormError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const started = useRef(false);
  const focusOnStep = useRef(false);
  const utm = useRef<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);

  // UTM parameters and the CTA that brought the visitor here.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) utm.current[key] = v;
    }
    const onCta = (e: Event) => {
      const detail = (e as CustomEvent<{ intent: string; source: string }>).detail;
      setIntent(detail.intent === "founders" ? "founders" : "baseline");
      setSource(detail.source);
    };
    window.addEventListener("crumaco:cta", onCta);
    return () => {
      window.removeEventListener("crumaco:cta", onCta);
      window.clearTimeout(advanceTimer.current);
    };
  }, []);

  // Move focus to the step heading after the visitor changes step.
  useEffect(() => {
    if (!focusOnStep.current) return;
    focusOnStep.current = false;
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    // Keep the question in view: through Lenis when it runs, natively otherwise.
    const top = heading.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight - 160) {
      if (window.__lenis) window.__lenis.scrollTo(heading, { offset: -112 });
      else heading.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [step]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track("form_start", { intent, location: source });
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    markStarted();
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof FieldErrors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const errorsFor = (fields: (keyof FieldErrors)[], all: FieldErrors) => {
    const out: FieldErrors = {};
    for (const f of fields) if (all[f]) out[f] = true;
    return out;
  };

  const showErrors = (found: FieldErrors) => {
    setErrors(found);
    const keys = Object.keys(found) as (keyof FieldErrors)[];
    setAnnouncement(keys.map((k) => form.errors[k]).join(" "));
    const first = keys[0];
    if (first) window.setTimeout(() => document.getElementById(FIELD_IDS[first])?.focus(), 0);
  };

  const goTo = (next: number) => {
    window.clearTimeout(advanceTimer.current);
    focusOnStep.current = true;
    setStep(next);
    setFormError("");
    setAnnouncement(`Step ${next + 1} of ${STEP_COUNT}: ${STEP_TITLES[next]}`);
    track("form_step", { n: next + 1 });
  };

  const validateStep = (s: number, v: Values = values) => errorsFor(STEP_FIELDS[s], validateEnquiry(v));

  const next = (v: Values = values) => {
    const found = validateStep(step, v);
    if (Object.keys(found).length) return showErrors(found);
    setErrors({});
    goTo(step + 1);
  };

  const pick = (key: "interest" | "timing", value: string) => {
    const updated = { ...values, [key]: value };
    set(key, value);
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => next(updated), 220);
  };

  const submit = async () => {
    const all = validateEnquiry(values);
    if (Object.keys(all).length) {
      const firstStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => all[f]));
      if (firstStep !== step) goTo(firstStep);
      return showErrors(errorsFor(STEP_FIELDS[firstStep], all));
    }
    setStatus("submitting");
    setFormError("");
    try {
      const result = await submitEnquiry({ ...values, intent, source, utm: utm.current });
      if (result.ok) {
        track("form_submit", { intent, location: source });
        setStatus("success");
        return;
      }
      setStatus("idle");
      if (result.reason === "invalid") {
        const firstStep = STEP_FIELDS.findIndex((fields) => fields.some((f) => result.errors[f]));
        if (firstStep >= 0 && firstStep !== step) goTo(firstStep);
        return showErrors(errorsFor(STEP_FIELDS[Math.max(0, firstStep)], result.errors));
      }
      const message = result.reason === "rate_limited" ? form.errors.rateLimited : form.errors.generic;
      setFormError(message);
      setAnnouncement(message);
    } catch {
      setStatus("idle");
      setFormError(form.errors.generic);
      setAnnouncement(form.errors.generic);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (step < STEP_COUNT - 1) next();
    else void submit();
  };

  const firstName = values.name.trim().split(/\s+/)[0] ?? "";

  if (status === "success") {
    return (
      <div className="border border-bone/10 bg-graphite/95 p-6 sm:p-10" role="status">
        <p className="eyebrow eyebrow-dash">Request received</p>
        <h3 ref={successRef} tabIndex={-1} className="display mt-5 text-[2.5rem] outline-none sm:text-5xl">
          {form.success.heading.replace("{name}", firstName)}
        </h3>
        <p className="lede mt-4 text-bone">{form.success.body}</p>
        <a
          href={whatsappHref(`Hi, I'm ${firstName}. I've just requested a Baseline assessment at CRUMACO.`)}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="form_success"
          className="mt-8 inline-flex min-h-12 items-center gap-3 border border-bone/25 px-5 text-sm font-medium text-bone transition-colors hover:border-bone/60"
        >
          <WhatsAppIcon className="size-4 text-orange" />
          {form.success.whatsapp}
        </a>
        <div className="mt-10 border-t border-bone/10 pt-6">
          <p className="eyebrow">{form.success.nextTitle}</p>
          <ol className="mt-4 space-y-3">
            {form.success.next.map((item, i) => (
              <li key={item} className="flex gap-4 text-[15px]">
                <span className="pt-0.5 font-mono text-[11px] tracking-[0.2em] text-orange">0{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={markStarted}
      aria-labelledby="enq-step-title"
      className="border border-bone/10 bg-graphite/95 p-5 backdrop-blur-sm sm:p-10"
    >
      {/* Hidden context fields. */}
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="source_section" value={source} />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="enq-website">Website</label>
        <input
          id="enq-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-ash uppercase">
          Step {step + 1} of {STEP_COUNT}
        </p>
        {intent === "founders" && (
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-orange uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-orange" />
            {form.founderIntent}
          </p>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={step + 1}
        className="mt-3 h-[3px] w-full bg-bone/10"
      >
        <div
          className="h-full origin-left bg-orange transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${(step + 1) / STEP_COUNT})` }}
        />
      </div>

      <h3
        id="enq-step-title"
        ref={headingRef}
        tabIndex={-1}
        className="display mt-8 scroll-mt-28 text-[2rem] outline-none sm:text-[2.5rem]"
      >
        {STEP_TITLES[step]}
      </h3>

      <div className="mt-6 min-h-[16rem]">
        {step === 0 && (
          <ChoiceGroup
            name="interest"
            legend={form.steps.interest}
            options={INTEREST_OPTIONS}
            value={values.interest}
            onChange={(v) => set("interest", v)}
            onPick={(v) => pick("interest", v)}
            error={!!errors.interest}
            columns="grid-cols-1 xs:grid-cols-2"
          />
        )}

        {step === 1 && (
          <ChoiceGroup
            name="timing"
            legend={form.steps.timing}
            options={form.timingOptions.map((t) => ({ value: t, label: t }))}
            value={values.timing}
            onChange={(v) => set("timing", v)}
            onPick={(v) => pick("timing", v)}
            error={!!errors.timing}
            columns="grid-cols-1"
          />
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="enq-name" className="eyebrow block">{form.fields.name}</label>
              <input
                id="enq-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? "enq-name-error" : undefined}
                className="mt-2 block min-h-13 w-full border border-bone/20 bg-carbon px-4 text-base text-bone transition-colors outline-none placeholder:text-ash/70 focus:border-orange aria-invalid:border-orange"
              />
              <ErrorText id="enq-name-error" show={!!errors.name}>{form.errors.name}</ErrorText>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="enq-phone" className="eyebrow block">{form.fields.phone}</label>
                <span id="enq-phone-hint" className="text-xs text-ash">{form.fields.phoneHint}</span>
              </div>
              <div className="mt-2 flex min-h-13 border border-bone/20 bg-carbon transition-colors focus-within:border-orange has-[[aria-invalid=true]]:border-orange">
                <span className="flex items-center border-r border-bone/15 px-4 font-mono text-sm text-bone/80" aria-hidden="true">
                  +91
                </span>
                <input
                  id="enq-phone"
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={14}
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/[^\d\s+-]/g, ""))}
                  aria-invalid={errors.phone || undefined}
                  aria-describedby={`enq-phone-hint${errors.phone ? " enq-phone-error" : ""}`}
                  aria-label={`${form.fields.phone}, India +91`}
                  className="w-full bg-transparent px-4 text-base tracking-wide text-bone outline-none"
                />
              </div>
              <ErrorText id="enq-phone-error" show={!!errors.phone}>{form.errors.phone}</ErrorText>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="enq-email" className="eyebrow block">{form.fields.email}</label>
                <span id="enq-email-hint" className="text-xs text-ash">{form.fields.emailHint}</span>
              </div>
              <input
                id="enq-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={120}
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={errors.email || undefined}
                aria-describedby={`enq-email-hint${errors.email ? " enq-email-error" : ""}`}
                className="mt-2 block min-h-13 w-full border border-bone/20 bg-carbon px-4 text-base text-bone transition-colors outline-none focus:border-orange aria-invalid:border-orange"
              />
              <ErrorText id="enq-email-error" show={!!errors.email}>{form.errors.email}</ErrorText>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label htmlFor="enq-consent" className="flex cursor-pointer gap-4 text-[15px] leading-relaxed text-bone/90">
              <span className="relative mt-0.5 flex size-6 flex-none items-center justify-center">
                <input
                  id="enq-consent"
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={errors.consent || undefined}
                  aria-describedby={errors.consent ? "enq-consent-error" : undefined}
                  className="peer size-6 cursor-pointer appearance-none border border-bone/40 bg-carbon transition-colors checked:border-orange checked:bg-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange aria-invalid:border-orange"
                />
                <svg viewBox="0 0 16 16" aria-hidden="true" className="pointer-events-none absolute size-3.5 text-carbon opacity-0 peer-checked:opacity-100">
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span>
                {form.consent.replace("Privacy Policy.", "")}
                <Link href="/privacy" target="_blank" className="underline underline-offset-4 hover:text-bone">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <ErrorText id="enq-consent-error" show={!!errors.consent}>{form.errors.consent}</ErrorText>
            <p className="mt-6 text-sm text-ash">{form.noFriction}</p>
          </div>
        )}
      </div>

      {formError && (
        <p role="alert" className="mt-4 border-l-2 border-orange pl-4 text-sm text-bone">
          {formError}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-bone/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="inline-flex min-h-12 items-center gap-2 px-1 text-sm font-medium text-bone/80 hover:text-bone"
          >
            <ArrowRight className="size-4 rotate-180" />
            {form.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={status === "submitting"} className="btn-primary disabled:opacity-70">
          {step < STEP_COUNT - 1 ? form.next : status === "submitting" ? form.submitting : form.submit}
          <ArrowRight className="size-4" />
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </form>
  );
}
