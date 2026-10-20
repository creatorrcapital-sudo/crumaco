import { problem } from "@/content/site";
import { Emphasis, Photo, stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-heading" className="theme-light section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 id="problem-heading" data-reveal className="display text-h2">
            <Emphasis text={problem.heading} />
          </h2>
          <p data-reveal style={stagger(1)} className="prose-body mt-8">
            {problem.body}
          </p>
        </div>

        <ul className="border-t rule lg:col-span-4 lg:col-start-9 lg:mt-3" aria-label="Sound familiar?">
          {problem.symptoms.map((symptom, i) => (
            <li key={symptom} data-reveal style={stagger(i + 1)} className="flex gap-4 border-b rule py-6">
              <span aria-hidden="true" className="mt-[0.8em] h-[2px] w-5 flex-none bg-orange" />
              <span className="font-display text-[1.75rem] leading-[1.1] text-balance text-ink">{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x mt-16 lg:mt-24">
        {/* Scroll-tied: the wide photo eases up and settles from a slight zoom. */}
        <AnimatedContent scrub={0.8} distance={50} scale={1.08} initialOpacity={0.35} threshold={0.02}>
          <Photo
            src={problem.image.src}
            alt={problem.image.alt}
            sizes="(min-width: 1320px) 1224px, (min-width: 1024px) calc(100vw - 96px), calc(100vw - 32px)"
            position="50% 55%"
            className="aspect-[4/3] sm:aspect-[2/1] lg:aspect-[21/8]"
            parallax
          />
        </AnimatedContent>
      </div>
    </section>
  );
}
