import { lab } from "@/content/site";
import { Photo, SectionHeading, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

export function Lab() {
  const [large, ...stacked] = lab.gallery;
  const inside = lab.inside.filter((item) => item.confirmed);

  return (
    <section id="lab" aria-labelledby="lab-heading" className="theme-light section-y overflow-x-clip">
      <div className="container-x">
        <SectionHeading number={lab.number} label={lab.label} heading={lab.heading} id="lab-heading" />

        {/* Editorial gallery on three scroll speeds: the large photo settles
            gently, the two stacked ones travel further (parallax depth). */}
        <div className="mt-14 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-20 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
          <AnimatedContent scrub={0.8} distance={60} scale={1.04} initialOpacity={0.5} threshold={0.02} className="col-span-2 lg:row-span-2">
            <Photo
              src={large.src}
              alt={large.alt}
              sizes="(min-width: 1320px) 816px, (min-width: 1024px) 62vw, calc(100vw - 32px)"
              className="aspect-[16/10] lg:aspect-auto lg:h-full"
              parallax
            />
          </AnimatedContent>
          {stacked.map((photo, i) => (
            <AnimatedContent key={photo.src} scrub={0.8} distance={140 + i * 80} initialOpacity={0.3} threshold={0.02}>
              <Photo
                src={photo.src}
                alt={photo.alt}
                sizes="(min-width: 1320px) 400px, (min-width: 1024px) 31vw, 50vw"
                className="aspect-[4/3]"
                parallax
              />
            </AnimatedContent>
          ))}
        </div>

        {inside.length > 0 && (
          <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-8">
            <p data-reveal className="eyebrow eyebrow-dash self-start lg:col-span-3 lg:pt-6">
              {lab.insideTitle}
            </p>
            <ul className="grid sm:grid-cols-2 sm:gap-x-8 lg:col-span-9">
              {inside.map((item, i) => (
                <li key={item.label} data-reveal style={stagger(i % 2)} className="border-t rule py-5">
                  <span className="font-display text-[1.625rem] leading-[1.1] text-balance text-ink">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
