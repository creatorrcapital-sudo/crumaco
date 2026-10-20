import { foundersProgramme as fp } from "@/content/site";
import { CtaLink, DraftTag, Emphasis, SectionLabel, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

export function FoundersProgramme() {
  return (
    <section id="founders-programme" aria-labelledby="founders-heading" className="theme-dark section-y">
      {/* On mobile the button follows the membership card, so it is never on
          screen together with the programmes section's button. */}
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
        <div className="lg:col-span-6 lg:row-start-1">
          <div data-reveal>
            <SectionLabel number={fp.number} label={fp.label} />
          </div>
          <p data-reveal style={stagger(1)} className="mt-8 font-mono text-[11px] font-medium tracking-[0.2em] text-bone uppercase">
            {fp.eyebrow}
          </p>
          <h2 id="founders-heading" data-reveal style={stagger(2)} className="display text-h2 mt-5">
            <Emphasis text={fp.heading} />
          </h2>
          <p data-reveal style={stagger(3)} className="prose-body mt-8">
            {fp.body}
          </p>
          <p data-reveal style={stagger(3)} className="mt-8 border-l-2 border-orange pl-4 font-mono text-xs leading-relaxed tracking-[0.12em] text-bone uppercase">
            {fp.price}
          </p>
        </div>

        <div data-reveal style={stagger(1)} className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <div>
            <div className="flex items-end justify-between gap-6 border-b border-bone/10 pb-8">
              {/* Scroll-tied: the cap rises into place. */}
              <AnimatedContent as="span" scrub={0.6} distance={110} initialOpacity={0.15} threshold={0.02} className="numeral inline-block text-[6.5rem] leading-[0.8] text-orange sm:text-[8rem]">
                {fp.places}
              </AnimatedContent>
              <span className="max-w-[11rem] pb-1 text-right font-mono text-[11px] tracking-[0.2em] text-ash uppercase">
                {fp.placesLabel}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <p className="eyebrow">{fp.includesTitle}</p>
              <DraftTag>{fp.draft}</DraftTag>
            </div>
            <ul className="mt-4">
              {fp.includes.map((item, i) => (
                <li key={item} className="flex items-baseline gap-5 border-b border-bone/10 py-4 last:border-b-0">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-orange">0{i + 1}</span>
                  <span className="text-[1.0625rem] text-bone">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal style={stagger(4)} className="lg:col-span-6 lg:row-start-2">
          <CtaLink source="founders" intent="founders">
            {fp.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
