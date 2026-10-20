import { baseline, baselineDetails } from "@/content/site";
import { CtaLink, Photo, SectionHeading, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

export function Baseline() {
  const detailsLine = [baselineDetails.duration, baselineDetails.price].filter(Boolean).join(" · ");

  return (
    <section id="baseline" aria-labelledby="baseline-heading" className="theme-dark section-y">
      <div className="container-x">
        <SectionHeading number={baseline.number} label={baseline.label} heading={baseline.heading} id="baseline-heading" />

        {/* Four steps on one hairline: vertical on mobile, horizontal from md. */}
        <ol className="mt-16 grid border-t border-bone/15 md:mt-24 md:grid-cols-4 md:gap-8">
          {baseline.steps.map((step, i) => (
            <li key={step.title} data-reveal style={stagger(i)} className="border-b border-bone/15 py-7 md:border-b-0 md:py-8">
              <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-orange uppercase">0{i + 1}</p>
              <h3 className="mt-4 font-display text-[1.75rem] leading-[1.05] text-bone">{step.title}</h3>
              <p className="mt-2 max-w-[30ch] text-[15px]">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div data-reveal className="lg:col-span-6">
            <p className="eyebrow">{baseline.leaveWith.title}</p>
            <ul className="mt-6">
              {baseline.leaveWith.items.map((item) => (
                <li key={item} className="border-t border-bone/15 py-5 font-display text-[1.75rem] leading-[1.1] text-bone sm:text-[2.125rem]">
                  {item}
                </li>
              ))}
            </ul>
            {detailsLine && <p className="mt-6 font-mono text-xs tracking-[0.15em] text-ash uppercase">{detailsLine}</p>}
            <div className="mt-10">
              <CtaLink source="baseline">{baseline.cta}</CtaLink>
            </div>
          </div>

          {/* Scroll-tied: the report photo rises past the list (parallax). */}
          <AnimatedContent scrub={0.8} distance={140} initialOpacity={0.3} threshold={0.02} className="lg:col-span-5 lg:col-start-8">
            <Photo
              src={baseline.image.src}
              alt={baseline.image.alt}
              sizes="(min-width: 1320px) 480px, (min-width: 1024px) 36vw, calc(100vw - 32px)"
              position="50% 40%"
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
              parallax
            />
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
