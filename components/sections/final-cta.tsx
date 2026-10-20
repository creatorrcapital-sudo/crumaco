import { finalCta } from "@/content/site";
import { Emphasis, Photo, SectionLabel, stagger } from "@/components/ui/primitives";
import { EnquiryForm } from "@/components/form/enquiry-form";

export function FinalCta() {
  // One sentence per line, like the brochure's closing page.
  const lines = finalCta.heading.split(/(?<=\.\*?)\s+/);

  return (
    <section id="begin" aria-labelledby="begin-heading" className="theme-dark relative isolate overflow-hidden section-y">
      <div className="absolute inset-0 -z-10">
        <Photo
          src={finalCta.image.src}
          alt={finalCta.image.alt}
          sizes="100vw"
          position="30% 20%"
          className="absolute inset-0"
          parallax
        />
        <div className="absolute inset-0 bg-carbon/70 lg:bg-[linear-gradient(90deg,rgba(20,19,18,0.3)_0%,rgba(20,19,18,0.75)_42%,#141312_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-carbon to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon to-transparent" />
      </div>

      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div data-reveal>
            <SectionLabel number={finalCta.number} label={finalCta.label} />
          </div>
          <h2 id="begin-heading" data-reveal style={stagger(1)} className="display text-h2 mt-6">
            {lines.map((line) => (
              <span key={line} className="block">
                <Emphasis text={line} />
              </span>
            ))}
          </h2>
          <p data-reveal style={stagger(2)} className="lede mt-6 text-bone">
            {finalCta.sub}
          </p>
          <dl data-reveal style={stagger(3)} className="mt-10 border-t border-bone/15">
            {finalCta.reassurance.map((r) => (
              <div key={r.label} className="grid gap-1 border-b border-bone/15 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="eyebrow pt-0.5">{r.label}</dt>
                <dd className="text-[15px]">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal style={stagger(1)} className="lg:col-span-6 lg:col-start-7">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
