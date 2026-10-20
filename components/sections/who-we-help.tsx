import { entries } from "@/content/site";
import { Photo, SectionHeading } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";
import { ArrowRight } from "@/components/ui/icons";

export function WhoWeHelp() {
  return (
    <section id="who-we-help" aria-labelledby="who-heading" className="theme-light section-y">
      <div className="container-x">
        <SectionHeading number={entries.number} label={entries.label} heading={entries.heading} id="who-heading" />

        {/* Tiles rise in one after another, softly coming into focus. */}
        <AnimatedContent
          as="ul"
          stagger={0.08}
          distance={70}
          blur={6}
          duration={0.9}
          threshold={0.12}
          className="mt-14 grid gap-x-6 gap-y-0 sm:grid-cols-2 sm:gap-y-14 lg:mt-20 lg:grid-cols-3 lg:gap-x-8"
        >
          {entries.items.map((item) => (
            <li key={item.id} className="border-t rule sm:border-t-0">
              <a
                href={`#programme-${item.programme}`}
                data-programme={item.programme}
                aria-label={`${item.title}: ${entries.linkLabel}`}
                className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-5 sm:block sm:py-0"
              >
                <Photo
                  src={item.image.src}
                  alt={item.image.alt}
                  sizes="(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 88px"
                  className="aspect-square sm:aspect-[4/5]"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <div className="sm:mt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.5rem] leading-[1.05] text-ink sm:text-[1.875rem]">{item.title}</h3>
                    <ArrowRight className="size-4 flex-none text-ink transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 text-[15px] leading-normal">{item.body}</p>
                </div>
              </a>
            </li>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
