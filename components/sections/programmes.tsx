import { programmes } from "@/content/site";
import { CtaLink, SectionHeading } from "@/components/ui/primitives";
import { ProgrammesExplorer } from "@/components/sections/programmes-explorer";

export function Programmes() {
  return (
    <section id="programmes" aria-labelledby="programmes-heading" className="theme-light section-y border-t rule">
      <div className="container-x">
        <SectionHeading number={programmes.number} label={programmes.label} heading={programmes.heading} id="programmes-heading" />

        <div className="mt-12 lg:mt-20">
          <ProgrammesExplorer />
        </div>

        <div data-reveal className="mt-16 flex flex-col gap-8 border-t rule pt-10 md:flex-row md:items-center md:justify-between lg:mt-28">
          <div>
            <p className="display text-h3">{programmes.notSure.title}</p>
            <p className="prose-body mt-3">{programmes.notSure.body}</p>
          </div>
          <CtaLink source="programmes" className="flex-none self-start md:self-center">
            {programmes.notSure.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
