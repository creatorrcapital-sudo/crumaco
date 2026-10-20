import { method } from "@/content/site";
import { Photo, SectionHeading, stagger } from "@/components/ui/primitives";

export function Method() {
  return (
    <section id="method" aria-labelledby="method-heading" className="theme-light section-y border-t rule">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading number={method.number} label={method.label} heading={method.heading} id="method-heading" />

          <Photo
            src={method.image.src}
            alt={method.image.alt}
            sizes="calc(100vw - 32px)"
            className="mt-10 aspect-[16/10] lg:hidden"
            parallax
            reveal={0}
          />

          <ol className="mt-12 border-t rule lg:mt-16">
            {method.steps.map((step, i) => (
              <li
                key={step.name}
                data-reveal
                style={stagger(i % 2)}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b rule py-7 sm:grid-cols-[3.5rem_11rem_1fr] sm:gap-x-6 lg:py-9"
              >
                <span className="pt-2 font-mono text-[11px] font-medium tracking-[0.2em] text-ink">0{i + 1}</span>
                <h3 className="display text-h3">{step.name}</h3>
                <p className="col-start-2 mt-2 max-w-[44ch] sm:col-start-3 sm:mt-1">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <Photo
              src={method.image.src}
              alt={method.image.alt}
              sizes="(min-width: 1320px) 480px, 36vw"
              className="aspect-[4/5]"
              parallax
            />
            <p className="eyebrow mt-5" aria-hidden="true">
              {method.steps.map((s) => s.name).join(" → ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
