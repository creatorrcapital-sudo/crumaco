import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { imageMeta } from "@/content/image-meta.generated";
import { flags } from "@/content/site";
import { ArrowRight } from "@/components/ui/icons";

/** Renders *asterisk* segments of a heading as <em> (italic accent colour). */
export function Emphasis({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** "01 — The method" in mono, with the orange dash. */
export function SectionLabel({ number, label, className }: { number?: string; label: string; className?: string }) {
  return (
    <p className={cn("eyebrow eyebrow-dash", className)}>
      {number ? `${number} — ${label}` : label}
    </p>
  );
}

export function SectionHeading({
  number,
  label,
  heading,
  id,
  className,
  headingClassName,
  children,
}: {
  number?: string;
  label: string;
  heading: string;
  id?: string;
  className?: string;
  headingClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <div data-reveal>
        <SectionLabel number={number} label={label} />
      </div>
      <h2 id={id} data-reveal style={{ "--reveal-i": 1 } as React.CSSProperties} className={cn("display text-h2 mt-6", headingClassName)}>
        <Emphasis text={heading} />
      </h2>
      {children}
    </div>
  );
}

/** Graded next/image in a sized wrapper. The wrapper shows the photo's average
 *  colour while it loads. Give it an aspect ratio or height via className. */
export function Photo({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  preload,
  position,
  grade = true,
  reveal,
  parallax,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  position?: string;
  grade?: boolean;
  /** Drift the photo inside its frame as it scrolls past (CSS scroll-driven,
   *  no JS; off for reduced motion and in browsers without support). */
  parallax?: boolean;
  /** Reveal on view, with this stagger index. */
  reveal?: number;
  /** Overlays (gradients, captions) drawn above the image. */
  children?: ReactNode;
}) {
  const meta = imageMeta[src];
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      data-reveal={reveal === undefined ? undefined : ""}
      style={{ backgroundColor: meta?.color ?? "#1f1d1b", ...(reveal ? { "--reveal-i": reveal } : {}) } as React.CSSProperties}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        className={cn("object-cover", grade && "photo-grade", parallax && "parallax-img", imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
      {children}
    </div>
  );
}

/** Inline style for a reveal stagger index. */
export const stagger = (i: number) => ({ "--reveal-i": i }) as React.CSSProperties;

/** Primary call to action. Every one scrolls to the form; a click listener
 *  (components/enhancements.tsx) sets the intent and tracks the location. */
export function CtaLink({
  children,
  source,
  intent = "baseline",
  className,
  countsAsPrimary = true,
}: {
  children: ReactNode;
  source: string;
  intent?: "baseline" | "founders";
  className?: string;
  /** Hide the mobile sticky bar while this button is on screen. */
  countsAsPrimary?: boolean;
}) {
  return (
    <a
      href="#begin"
      data-cta={source}
      data-intent={intent}
      data-primary-cta={countsAsPrimary ? "" : undefined}
      className={cn("btn-primary group", className)}
    >
      <span>{children}</span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Small review tag for copy awaiting sign-off (hidden unless flagged on). */
export function DraftTag({ children }: { children: ReactNode }) {
  if (!flags.SHOW_DRAFT_MARKERS) return null;
  return (
    <span className="inline-block border border-dashed border-current px-2 py-1 font-mono text-[10px] tracking-[0.15em] uppercase opacity-80">
      {children}
    </span>
  );
}
