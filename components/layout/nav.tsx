"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { nav } from "@/content/site";
import { MenuIcon } from "@/components/ui/icons";

// The menu (Radix Dialog, focus trap, scroll lock) loads on first use, not
// with the page. Hovering or touching the button starts the download early.
const loadMenu = () => import("@/components/layout/mobile-menu").then((m) => m.MobileMenu);
const MobileMenu = dynamic(loadMenu, { ssr: false });

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuRequested, setMenuRequested] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 [--ring-color:var(--color-orange)] transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-b border-bone/10 bg-carbon/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <a href="#top" className="-m-2 flex items-center p-2" aria-label="CRUMACO, back to top">
          {/* TODO: swap in the client's SVG logo when supplied. */}
          <Image src="/brand/logo_orange.png" alt="CRUMACO" width={109} height={36} className="h-8 w-auto lg:h-9" preload />
        </a>

        {/* Minimal nav: the booking button and a menu, nothing else. */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#begin"
            data-cta="nav"
            data-intent="baseline"
            className="btn-primary hidden min-h-11 px-5 py-2.5 text-sm lg:inline-flex"
          >
            {nav.cta}
          </a>
          <button
            ref={menuButton}
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onPointerEnter={() => void loadMenu()}
            onTouchStart={() => void loadMenu()}
            onClick={() => {
              setMenuRequested(true);
              setOpen(true);
            }}
            className="-mr-2 flex min-h-12 items-center gap-3 px-2 font-mono text-[11px] font-medium tracking-[0.2em] text-bone uppercase"
          >
            <span className="hidden sm:inline">Menu</span>
            <MenuIcon className="size-6" />
          </button>
        </div>
        {menuRequested && <MobileMenu open={open} onOpenChange={setOpen} returnFocusRef={menuButton} />}
      </nav>
    </header>
  );
}
