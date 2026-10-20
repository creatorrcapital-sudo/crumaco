"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { track } from "@/lib/analytics";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Page-wide progressive enhancements, in one small client component:
 * - smooth scrolling (Lenis) on mouse/trackpad devices; touch stays native
 * - reveals [data-reveal] elements as they enter the viewport
 * - counts [data-count-to] numerals up once, when first seen
 * - tracks CTA and WhatsApp clicks, and tells the form which CTA was used
 * Everything is readable without JS and respects prefers-reduced-motion.
 */
export function Enhancements() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scrolling for wheel and trackpad. Loaded on demand, and only
    // where it helps, so phones download nothing extra.
    let lenis: Lenis | undefined;
    let disposed = false;
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      import("lenis").then(({ default: LenisCtor }) => {
        if (disposed) return;
        lenis = new LenisCtor({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.95 });
        window.__lenis = lenis;
      });
    }

    // In-page links glide to their target (with the nav offset) when Lenis
    // runs; otherwise the browser's own smooth scrolling handles them.
    const onAnchorClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#" || hash === "#main") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      if (location.hash !== hash) history.pushState(null, "", hash);
      // Next frame, so menus can close (and unlock scrolling) first. Lenis
      // honours each section's CSS scroll-margin-top, which clears the nav.
      requestAnimationFrame(() => lenis?.scrollTo(target));
    };
    document.addEventListener("click", onAnchorClick);

    // Reveal on view. Siblings inside the same [data-reveal-group] stagger.
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

    // Attach the topo texture to dark sections shortly before they scroll in.
    const topoObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-near", "");
          topoObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "600px 0px" },
    );
    document.querySelectorAll(".topo").forEach((el) => topoObserver.observe(el));

    // Count-up numerals.
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count-to]"));
    const format = (v: number, decimals: number) => v.toFixed(decimals);
    let countObserver: IntersectionObserver | undefined;
    if (!reduced) {
      for (const el of counters) el.textContent = format(0, Number(el.dataset.decimals ?? 0));
      countObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            countObserver?.unobserve(el);
            const to = Number(el.dataset.countTo);
            const decimals = Number(el.dataset.decimals ?? 0);
            const duration = 1400;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              el.textContent = format(to * eased, decimals);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        },
        { threshold: 0.4 },
      );
      counters.forEach((el) => countObserver?.observe(el));
    }

    // Click tracking + CTA intent hand-off to the form.
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const cta = target?.closest<HTMLElement>("[data-cta]");
      if (cta) {
        const detail = { intent: cta.dataset.intent ?? "baseline", source: cta.dataset.cta ?? "unknown" };
        track("cta_click", { location: detail.source });
        window.dispatchEvent(new CustomEvent("crumaco:cta", { detail }));
      }
      const wa = target?.closest<HTMLElement>("[data-wa]");
      if (wa) track("whatsapp_click", { location: wa.dataset.wa ?? "unknown" });
    };
    document.addEventListener("click", onClick);

    return () => {
      disposed = true;
      lenis?.destroy();
      delete window.__lenis;
      document.removeEventListener("click", onAnchorClick);
      revealObserver.disconnect();
      topoObserver.disconnect();
      countObserver?.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
