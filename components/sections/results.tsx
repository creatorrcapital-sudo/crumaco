import { results } from "@/content/site";
import { SectionHeading, stagger } from "@/components/ui/primitives";

function ChangeBar({ baseline, after, domain }: { baseline: number; after: number; domain: [number, number] }) {
  const [lo, hi] = domain;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  const a = pos(baseline);
  const b = pos(after);
  const increasing = b >= a;
  return (
    <div className="relative h-1.5 w-full bg-stone" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 bg-ash/45" style={{ width: `${a}%` }} />
      <div
        className="bar-fill absolute inset-y-0 bg-ember"
        style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%`, transformOrigin: increasing ? "left" : "right" }}
      />
      <div className="absolute -inset-y-1 w-px bg-ink" style={{ left: `${a}%` }} />
    </div>
  );
}

export function Results() {
  const fmt = (v: number, d: number) => v.toFixed(d);
  return (
    <section id="results" aria-labelledby="results-heading" className="theme-light section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeading number={results.number} label={results.label} heading={results.heading} id="results-heading" />
          <p data-reveal style={stagger(2)} className="prose-body mt-8">
            {results.intro}
          </p>
        </div>

        <figure data-reveal className="lg:col-span-7 lg:col-start-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow eyebrow-dash">Sample quarterly report</p>
            <p className="font-mono text-[11px] tracking-[0.15em] text-body uppercase">Illustrative sample</p>
          </div>
          <table className="mt-6 w-full border-collapse text-left">
            <caption className="sr-only">Sample quarterly report comparing baseline and week 12 readings. Illustrative example; individual results vary.</caption>
            <thead>
              <tr className="border-b rule [&>th]:py-3 [&>th]:font-medium [&>th]:whitespace-nowrap [&>th]:max-sm:tracking-[0.1em]">
                <th scope="col" className="eyebrow pr-2">{results.columns.metric}</th>
                <th scope="col" className="eyebrow pr-2">{results.columns.baseline}</th>
                <th scope="col" className="eyebrow pr-2">{results.columns.after}</th>
                <th scope="col" className="eyebrow w-[26%] sm:w-[34%]">{results.columns.change}</th>
              </tr>
            </thead>
            <tbody>
              {results.rows.map((row) => (
                <tr key={row.metric} className="border-b rule">
                  <th scope="row" className="py-5 pr-2 text-[14px] leading-tight font-medium text-ink sm:py-6 sm:text-[15px]">
                    {row.metric}
                  </th>
                  <td className="py-5 pr-2 whitespace-nowrap sm:py-6">
                    <span className="numeral text-xl text-body sm:text-[1.75rem]">{fmt(row.baseline, row.decimals)}</span>
                    {row.unit && <span className="ml-0.5 font-mono text-[10px] text-body sm:ml-1 sm:text-[11px]">{row.unit}</span>}
                  </td>
                  <td className="py-5 pr-2 whitespace-nowrap sm:py-6">
                    <span className="numeral text-xl text-ember-text sm:text-[1.75rem]">{fmt(row.after, row.decimals)}</span>
                    {row.unit && <span className="ml-0.5 font-mono text-[10px] text-body sm:ml-1 sm:text-[11px]">{row.unit}</span>}
                  </td>
                  <td className="py-5 sm:py-6">
                    <ChangeBar baseline={row.baseline} after={row.after} domain={row.domain} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <figcaption className="mt-5 text-sm text-body">{results.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
