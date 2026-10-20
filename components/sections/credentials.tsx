import { certificationCount, founder, hero } from "@/content/site";
import { CtaLink, Emphasis, SectionHeading, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

/** Tanvir's full credentials as a quiet typographic list: one row per
 *  qualification, hairlines between, the doctorate first and largest. */
export function Credentials() {
  const [featured, ...rest] = founder.credentials;
  const tally = [
    `${founder.credentials.filter((c) => c.category === "Doctorate").length} doctorate`,
    `${founder.credentials.filter((c) => c.category === "Degree").length} degree`,
    `${certificationCount} certifications`,
  ];

  return (
    <section id="credentials" aria-labelledby="credentials-heading" className="theme-dark section-y overflow-x-clip">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionHeading
            number={founder.credentialsNumber}
            label={founder.credentialsTitle}
            heading={founder.credentialsHeading}
            id="credentials-heading"
            className="lg:col-span-7"
          />
          <ul data-reveal className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-bone/80 uppercase lg:col-span-5 lg:justify-end lg:pb-3">
            {tally.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {/* The doctorate, set large. */}
        <div data-reveal className="mt-16 grid gap-4 border-t border-bone/15 pt-8 lg:mt-24 lg:grid-cols-12 lg:gap-8 lg:pt-10">
          <p className="eyebrow lg:col-span-3 lg:pt-4">{featured.category}</p>
          <div className="lg:col-span-9">
            {/* Scroll-tied: the doctorate slides in from the right as it scrolls in. */}
            <AnimatedContent
              as="p"
              scrub={0.6}
              direction="horizontal"
              distance={160}
              initialOpacity={0.1}
              threshold={0.02}
              className="display text-[clamp(3rem,1.8rem+5vw,6.5rem)]"
            >
              <Emphasis text={featured.title} />
            </AnimatedContent>
            <p className="mt-5 font-mono text-xs tracking-[0.16em] text-bone/75 uppercase">{featured.issuer}</p>
          </div>
        </div>

        {/* Degree, certifications, playing career, coaching. */}
        <ul className="mt-12 border-t border-bone/15 lg:mt-16">
          {rest.map((c, i) => (
            <li
              key={c.title}
              data-reveal
              style={stagger(i % 3)}
              className="grid gap-2 border-b border-bone/15 py-6 sm:grid-cols-12 sm:gap-6 lg:py-7"
            >
              <p className="eyebrow pt-1.5 sm:col-span-3">{c.category}</p>
              <div className="sm:col-span-9 lg:col-span-5">
                <p className="font-display text-[1.625rem] leading-[1.1] text-balance text-bone sm:text-[2rem]">{c.title}</p>
                {c.detail && <p className="mt-2 max-w-[48ch] text-[15px] text-bone/70">{c.detail}</p>}
              </div>
              <p className="font-mono text-[11px] leading-relaxed tracking-[0.14em] text-ash uppercase sm:col-span-9 sm:col-start-4 lg:col-span-4 lg:col-start-9 lg:pt-2 lg:text-right">
                {c.issuer}
                {c.years && <span className="whitespace-nowrap"> · {c.years}</span>}
              </p>
            </li>
          ))}
        </ul>

        {/* Specialist certifications. */}
        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <p data-reveal className="eyebrow lg:col-span-3 lg:pt-5">
            {founder.specialistsTitle}
          </p>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-9">
            {founder.specialists.map((s, i) => (
              <li key={s.name} data-reveal style={stagger(i % 2)} className="border-t border-bone/15 py-5">
                <p className="font-display text-[1.5rem] leading-[1.1] text-bone">{s.name}</p>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed tracking-[0.12em] text-ash uppercase">{s.scope}</p>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 lg:mt-24">
          <CtaLink source="credentials">{founder.cta}</CtaLink>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] tracking-[0.12em] text-bone/70 uppercase">
            {hero.microcopy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
