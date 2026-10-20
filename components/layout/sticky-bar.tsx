"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { stickyBar } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/icons";

/**
 * Mobile/tablet bottom bar. Appears after the hero, and hides whenever another
 * primary button or the form is on screen, so only one primary action is ever
 * visible at a time.
 */
export function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScreen = new Set<Element>();
    const watched = [
      document.getElementById("top"),
      document.getElementById("begin"),
      ...Array.from(document.querySelectorAll("[data-primary-cta]")),
    ].filter(Boolean) as Element[];

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size === 0);
    });
    watched.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-bone/10 bg-carbon/95 backdrop-blur-md [--ring-color:var(--color-orange)] transition-transform duration-300 ease-out lg:hidden motion-reduce:transition-none",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="container-x flex gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a href="#begin" data-cta="sticky_bar" data-intent="baseline" className="btn-primary flex-1">
          {stickyBar.cta}
          <ArrowRight className="size-4" />
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          data-wa="sticky_bar"
          aria-label={stickyBar.whatsappLabel}
          className="flex size-[3.25rem] flex-none items-center justify-center border border-bone/20 text-orange"
        >
          <WhatsAppIcon className="size-5" />
        </a>
      </div>
    </div>
  );
}
