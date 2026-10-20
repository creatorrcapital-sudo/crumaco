"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { programmes } from "@/content/site";
import { Photo } from "@/components/ui/primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Programme = (typeof programmes.items)[number];

function Details({ programme, index }: { programme: Programme; index: number }) {
  return (
    <>
      <p className="eyebrow eyebrow-dash">
        Programme 0{index + 1} · {programme.category}
      </p>
      <p className="mt-4 font-display text-[1.75rem] leading-[1.1] text-ember-text italic sm:text-[2rem]">{programme.tagline}</p>
      <p className="prose-body mt-4">{programme.summary}</p>
      <dl className="mt-8 border-t rule text-[15px]">
        {[
          [programmes.labels.bestFor, programme.bestFor],
          [programmes.labels.pillars, programme.pillars.join(" · ")],
          [programmes.labels.startsWith, programmes.startsWith],
        ].map(([term, value]) => (
          <div key={term} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b rule py-3.5">
            <dt className="eyebrow pt-1">{term}</dt>
            <dd className="text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** Desktop: vertical tabs with the selected programme on the right.
 *  Mobile: accordion. Cards in "Who we help" select a programme via
 *  #programme-<id> links. */
export function ProgrammesExplorer() {
  const items = programmes.items;
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string>(items[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectById = useCallback(
    (id: string) => {
      const i = items.findIndex((p) => p.id === id);
      if (i < 0) return;
      setActive(i);
      setOpenId(id);
    },
    [items],
  );

  useEffect(() => {
    const fromHash = () => {
      const match = window.location.hash.match(/^#programme-(.+)$/);
      if (match) selectById(match[1]);
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-programme]");
      if (link?.dataset.programme) selectById(link.dataset.programme);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, [selectById]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    setOpenId(items[next].id);
    tabRefs.current[next]?.focus();
  };

  const current = items[active];

  return (
    <div className="relative">
      {/* Anchor targets for the "Who we help" cards. */}
      {items.map((p) => (
        <span key={p.id} id={`programme-${p.id}`} className="absolute top-0" aria-hidden="true" />
      ))}

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
        <div role="tablist" aria-orientation="vertical" aria-label="Signature programmes" className="col-span-5 border-t rule">
          {items.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={selected}
                aria-controls={`panel-${p.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setActive(i);
                  setOpenId(p.id);
                }}
                onKeyDown={onKeyDown}
                className="group relative flex w-full items-baseline gap-5 border-b rule py-5 text-left"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 -left-6 h-[1.5px] w-4 bg-orange transition-opacity duration-300",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="w-6 flex-none font-mono text-[11px] font-medium tracking-[0.2em] text-ink">0{i + 1}</span>
                <span
                  className={cn(
                    "font-display text-[2rem] leading-[1.05] transition-colors duration-300",
                    selected ? "text-ink" : "text-ink/55 group-hover:text-ink/80",
                  )}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="col-span-7"
        >
          <div key={current.id} className="animate-in fade-in-0 duration-500 motion-reduce:animate-none">
            <Photo
              src={current.image.src}
              alt={current.image.alt}
              sizes="(min-width: 1320px) 680px, 52vw"
              className="aspect-[16/10]"
            />
            <div className="mt-8 max-w-[38rem]">
              <h3 className="display text-h3">{current.name}</h3>
              <div className="mt-5">
                <Details programme={current} index={active} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and tablet */}
      <Accordion
        type="single"
        collapsible
        value={openId}
        onValueChange={setOpenId}
        className="border-t rule lg:hidden"
      >
        {items.map((p, i) => (
          <AccordionItem key={p.id} value={p.id}>
            <AccordionTrigger>
              <span className="flex items-baseline gap-4">
                <span className="w-6 flex-none font-mono text-[11px] font-medium tracking-[0.2em] text-ink">0{i + 1}</span>
                <span className="font-display text-[1.625rem] leading-[1.1] text-ink sm:text-[2rem]">{p.name}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Photo
                src={p.image.src}
                alt={p.image.alt}
                sizes="(min-width: 640px) calc(100vw - 64px), calc(100vw - 32px)"
                className="aspect-[16/10]"
              />
              <div className="mt-6">
                <Details programme={p} index={i} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
