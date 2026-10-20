import { flags, founder, withCounts } from "@/content/site";
import { DraftTag, Photo, SectionHeading, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

export function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-heading" className="theme-light section-y">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-5">
          {flags.SHOW_ATHLETE_PROOF ? (
            <>
              {/* Two photos on two scroll speeds: the small one travels further,
                  so it slides over the large one as you scroll (parallax). */}
              <AnimatedContent scrub={0.8} distance={90} initialOpacity={0.4} threshold={0.05} className="w-full max-w-[520px]">
                {/* Source is 1440px wide: keep display at or below ~560px. */}
                <Photo
                  src={founder.images.main.src}
                  alt={founder.images.main.alt}
                  sizes="(min-width: 640px) 520px, calc(100vw - 32px)"
                  className="aspect-[4/5] w-full"
                  position="38% 40%"
                  parallax
                />
              </AnimatedContent>
              <AnimatedContent
                scrub={0.8}
                distance={220}
                initialOpacity={0}
                threshold={0.02}
                className="relative -mt-24 ml-auto w-[45%] max-w-[240px] lg:-mr-10"
              >
                {/* Source is 1080px wide. Shown without naming the athlete. */}
                <Photo
                  src={founder.images.proof.src}
                  alt={founder.images.proof.alt}
                  sizes="(min-width: 640px) 240px, 45vw"
                  className="aspect-square w-full border-[6px] border-bone"
                />
              </AnimatedContent>
            </>
          ) : (
            <AnimatedContent scrub={0.8} distance={90} initialOpacity={0.4} threshold={0.05} className="w-full max-w-[520px]">
              <Photo
                src={founder.images.fallback.src}
                alt={founder.images.fallback.alt}
                sizes="(min-width: 1024px) 520px, calc(100vw - 32px)"
                className="aspect-[4/5] w-full"
                parallax
              />
            </AnimatedContent>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading number={founder.number} label={founder.label} heading={founder.heading} id="founder-heading" />
          <p data-reveal style={stagger(2)} className="mt-8 max-w-[34ch] font-display text-[1.5rem] leading-[1.25] text-balance text-ink sm:text-[1.75rem]">
            {withCounts(founder.summary)}
          </p>
          <div className="mt-4">
            <DraftTag>{founder.draft}</DraftTag>
          </div>
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-body md:text-lg">
            {founder.body.map((paragraph, i) => (
              <p key={i} data-reveal style={stagger(i + 2)} className="max-w-[54ch]">
                {paragraph}
              </p>
            ))}
          </div>
          <p data-reveal style={stagger(3)} className="mt-10 font-display text-[2rem] leading-none text-ink italic">
            {founder.signature} <span className="text-ember-text">—</span> {founder.role}
          </p>
        </div>
      </div>
    </section>
  );
}
