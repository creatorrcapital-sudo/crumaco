import { hero, withCounts } from "@/content/site";
import { stagger } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

/** The first proof, straight after the hero: what CRUMACO does, and who is
 *  behind it, in one quiet band. */
export function ProofBand() {
  return (
    <section id="proof" aria-label="About CRUMACO" className="theme-light border-b rule">
      <div className="container-x grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
        {/* Scroll-tied: the statement rises and resolves as it scrolls in. */}
        <AnimatedContent
          as="p"
          scrub={0.6}
          distance={70}
          initialOpacity={0.15}
          threshold={0.05}
          className="font-display text-[1.75rem] leading-[1.2] text-balance text-ink sm:text-[2.25rem] lg:col-span-6"
        >
          {hero.sub}
        </AnimatedContent>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
          {hero.proof.map((item, i) => (
            <li key={item} data-reveal style={stagger(i % 2)} className="flex items-start gap-3 border-t rule py-4 pr-4 text-[15px] leading-snug text-ink">
              <span aria-hidden="true" className="mt-[0.45rem] size-1.5 flex-none bg-orange" />
              {withCounts(item)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
