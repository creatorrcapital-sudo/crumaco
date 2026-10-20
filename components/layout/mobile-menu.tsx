"use client";

import Image from "next/image";
import { useEffect, type RefObject } from "react";
import { nav, stickyBar } from "@/content/site";
import { whatsappHref } from "@/lib/links";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { ArrowRight, CloseIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Full-screen mobile menu. Loaded on demand (see nav.tsx) so the dialog
 *  code is not part of the initial page JavaScript. */
export function MobileMenu({
  open,
  onOpenChange,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  // Pause page smooth-scrolling while the menu is open.
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-near=""
        data-lenis-prevent=""
        className="topo [--ring-color:var(--color-orange)]"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site sections and booking</SheetDescription>
        <div className="container-x flex h-16 items-center justify-between">
          <Image src="/brand/logo_orange.png" alt="CRUMACO" width={97} height={32} className="h-8 w-auto" />
          <SheetClose className="-mr-2 flex size-12 items-center justify-center text-bone" aria-label="Close menu">
            <CloseIcon className="size-6" />
          </SheetClose>
        </div>
        <ul className="container-x mt-6 flex flex-col">
          {nav.links.map((link, i) => (
            <li key={link.href} className="border-b border-bone/10">
              <SheetClose asChild>
                <a href={link.href} className="flex min-h-16 items-center justify-between py-3 text-bone">
                  <span className="font-display text-4xl leading-none">{link.label}</span>
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ash">0{i + 1}</span>
                </a>
              </SheetClose>
            </li>
          ))}
        </ul>
        <div className="container-x mt-auto flex flex-col gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <SheetClose asChild>
            <a href="#begin" data-cta="mobile_menu" data-intent="baseline" className="btn-primary w-full">
              {nav.cta}
              <ArrowRight className="size-4" />
            </a>
          </SheetClose>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            data-wa="mobile_menu"
            className="flex min-h-12 items-center justify-center gap-2 border border-bone/20 text-sm font-medium text-bone"
          >
            <WhatsAppIcon className="size-4 text-orange" />
            {stickyBar.whatsappLabel}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
