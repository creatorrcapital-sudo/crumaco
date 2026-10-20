import type { CSSProperties } from "react";
import { hero } from "@/content/site";
import { CtaLink, Emphasis, Photo } from "@/components/ui/primitives";
import { ArrowDown } from "@/components/ui/icons";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** Minimal hero: full-bleed Lab photo, one centred headline, one line, one
 *  button, and a thin bottom bar (in the spirit of the Codegrid hero). */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="theme-dark relative isolate flex min-h-svh flex-col overflow-hidden">
      <div className="hero-media absolute inset-0 -z-10">
        <Photo
          src={hero.image.src}
          alt={hero.image.alt}
          sizes="100vw"
          preload
          position="58% 50%"
          className="absolute inset-0"
          imgClassName="hero-parallax"
        />
        {hero.video && (
          <video
            className="hero-video photo-grade hero-parallax absolute inset-0 size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={hero.image.src}
            aria-hidden="true"
          >
            <source src={hero.video} type="video/mp4" />
          </video>
        )}
        {/* One even veil plus a soft vignette: quiet, and legible everywhere. */}
        <div className="absolute inset-0 bg-carbon/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,19,18,0)_0%,rgba(20,19,18,0.55)_100%)]" />
      </div>

      <div className="hero-content container-x flex flex-1 flex-col items-center justify-center pt-28 pb-28 text-center">
        {/* One line in both the fallback and the web font, so the swap causes no shift. */}
        <p className="enter eyebrow whitespace-nowrap max-sm:tracking-[0.12em]" style={idx(0)}>
          {hero.eyebrow}
        </p>
        {/* Width in em (not ch): it must not change when the web font swaps in. */}
        <h1 id="hero-heading" className="enter-headline display text-hero mt-7 max-w-[9em]">
          <Emphasis text={hero.headline} />
        </h1>
        <p className="enter mt-6 max-w-[26em] font-display text-[1.25rem] leading-snug text-balance text-bone/85 italic sm:text-[1.5rem]" style={idx(2)}>
          {hero.tagline}
        </p>
        <div className="enter mt-10" style={idx(3)}>
          <CtaLink source="hero">{hero.primaryCta}</CtaLink>
        </div>
        <ul
          className="enter mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 font-mono text-[11px] tracking-[0.12em] text-bone/65 uppercase"
          style={idx(4)}
          aria-label="What you get"
        >
          {hero.microcopy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="enter absolute inset-x-0 bottom-0" style={idx(5)}>
        <div className="container-x flex items-center justify-between gap-4 border-t border-bone/15 py-5 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap text-bone/75 uppercase sm:text-[11px] sm:tracking-[0.2em]">
          <a href={hero.secondaryCta.href} className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-bone">
            {hero.secondaryCta.label}
            <ArrowDown className="size-3.5" />
          </a>
          <span>{hero.location}</span>
        </div>
      </div>
    </section>
  );
}
