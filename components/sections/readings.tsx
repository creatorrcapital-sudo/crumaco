import { lab } from "@/content/site";
import { SectionHeading } from "@/components/ui/primitives";
import AnimatedContent from "@/components/ui/animated-content";

/** Sample readings, on their own: six numbers, lots of air, clearly labelled
 *  as illustrative. Numerals count up once when seen. */
export function Readings() {
  const readings = lab.readings.filter((item) => item.confirmed);
  if (!readings.length) return null;

  return (
    <section id="readings" aria-labelledby="readings-heading" className="theme-dark section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionHeading
            number={lab.readingsNumber}
            label={lab.readingsSectionLabel}
            heading={lab.readingsHeading}
            id="readings-heading"
            className="lg:col-span-7"
          />
          <p data-reveal className="eyebrow lg:col-span-5 lg:pb-3 lg:text-right">
            {lab.readingsLabel}
          </p>
        </div>

        {/* Readings rise in one after another; the numerals then count up. */}
        <AnimatedContent
          as="ul"
          stagger={0.1}
          distance={80}
          duration={0.9}
          threshold={0.12}
          className="mt-16 grid grid-cols-2 gap-x-6 sm:gap-x-10 lg:mt-24 lg:grid-cols-3 lg:gap-x-16"
        >
          {readings.map((r) => (
            <li key={r.test} className="flex flex-col border-t border-bone/15 pt-6 pb-12 lg:pb-16">
              <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-bone/80 uppercase">{r.test}</p>
              <p className="numeral mt-8 text-[3rem] text-orange sm:text-[4rem] lg:text-[5rem]">
                <span
                  data-count-to={r.value}
                  data-decimals={r.decimals}
                  className="inline-block tabular-nums"
                  style={{ minWidth: `${r.value.toFixed(r.decimals).length * 0.5}em` }}
                >
                  {r.value.toFixed(r.decimals)}
                </span>
              </p>
              <p className="mt-2 font-mono text-xs text-bone/80">{r.unit}</p>
              <p className="mt-5 max-w-[30ch] text-[14px] leading-snug text-ash">{r.detail}</p>
            </li>
          ))}
        </AnimatedContent>
        <p data-reveal className="border-t border-bone/15 pt-5 text-xs text-ash">
          {lab.readingsNote}
        </p>
      </div>
    </section>
  );
}
