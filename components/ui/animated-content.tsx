"use client";

/**
 * AnimatedContent, from React Bits (https://reactbits.dev), JavaScript + CSS
 * variant, ported to TypeScript. The animation logic is the original's. Four
 * changes for this site:
 *   1. GSAP and ScrollTrigger load on demand (dynamic import) after the page
 *      is interactive, so they are not part of the critical JavaScript.
 *   2. Content is hidden only when JS runs (`.js .ac-pending` in globals.css)
 *      and is revealed if GSAP fails to load, so it can never stay invisible.
 *   3. Reduced motion shows the content at once without loading GSAP.
 *   4. An `as` prop keeps semantics (e.g. a <ul> whose children are <li>).
 * ScrollTrigger is kept in sync with Lenis smooth scrolling when it runs.
 */

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import type { gsap as GsapType } from "gsap";

type Gsap = typeof GsapType;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let loader: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | null = null;
function loadGsap() {
  loader ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    // Keep ScrollTrigger in step with Lenis when smooth scrolling is active.
    const lenis = window.__lenis;
    if (lenis) lenis.on("scroll", st.ScrollTrigger.update);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loader;
}

const WIPES = {
  up: "linear-gradient(to top, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  down: "linear-gradient(to bottom, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  left: "linear-gradient(to left, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  right: "linear-gradient(to right, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
  center:
    "radial-gradient(farthest-corner at 50% 50%, #000 calc(var(--ac-wipe) * 140% - 40%), transparent calc(var(--ac-wipe) * 140%))",
} as const;

export type AnimatedContentProps = {
  children?: ReactNode;
  as?: ElementType;
  container?: string | HTMLElement;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  blur?: number;
  rotate?: number;
  tilt?: number;
  wipe?: "none" | keyof typeof WIPES;
  threshold?: number;
  delay?: number;
  stagger?: number;
  staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  trigger?: "scroll" | "mount";
  once?: boolean;
  scrub?: boolean | number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  className?: string;
  style?: CSSProperties;
  [key: `data-${string}`]: string | undefined;
  "aria-label"?: string;
};

export default function AnimatedContent({
  children,
  as: Tag = "div",
  container,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  rotate = 0,
  tilt = 0,
  wipe = "none",
  threshold = 0.1,
  delay = 0,
  stagger = 0,
  staggerFrom = "start",
  trigger = "scroll",
  once = true,
  scrub = false,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = "power3.in",
  onStart,
  onComplete,
  onDisappearanceComplete,
  className = "",
  style,
  ...props
}: AnimatedContentProps) {
  const ref = useRef<HTMLElement>(null);
  const callbacksRef = useRef({ onStart, onComplete, onDisappearanceComplete });
  useEffect(() => {
    callbacksRef.current = { onStart, onComplete, onDisappearanceComplete };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reveal = () => {
      el.style.visibility = "visible";
      el.classList.remove("ac-pending");
    };

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduce) {
      reveal();
      callbacksRef.current.onComplete?.();
      return undefined;
    }

    let disposed = false;
    let revert: (() => void) | undefined;

    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (disposed) return;

        // Default: the page itself (the original also looked for a
        // '#snap-main-container' element, which this site does not have).
        const scroller = typeof container === "string" ? (document.querySelector(container) ?? undefined) : container;

        const ctx = gsap.context(() => {
          const targets = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
          const horizontal = direction === "horizontal";
          const axis = horizontal ? "x" : "y";
          const sign = reverse ? -1 : 1;
          const mask = wipe === "none" ? undefined : WIPES[wipe];

          gsap.set(el, { visibility: "visible" });
          el.classList.remove("ac-pending");

          const from: gsap.TweenVars = {
            [axis]: distance * sign,
            scale,
            opacity: animateOpacity ? initialOpacity : 1,
          };
          const to: gsap.TweenVars = {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration,
            ease,
          };

          if (blur > 0) {
            from.filter = `blur(${blur}px)`;
            to.filter = "blur(0px)";
          }
          if (rotate) {
            from.rotation = rotate * sign;
            to.rotation = 0;
          }
          if (tilt) {
            const tiltAxis = horizontal ? "rotationY" : "rotationX";
            from[tiltAxis] = horizontal ? -tilt * sign : tilt * sign;
            to[tiltAxis] = 0;
            from.transformPerspective = 900;
            to.transformPerspective = 900;
          }
          if (mask) {
            gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
            from["--ac-wipe"] = 0;
            to["--ac-wipe"] = 1;
          }
          if (stagger > 0) to.stagger = { each: stagger, from: staggerFrom };

          const settle = () => {
            if (scrub) return;
            gsap.set(targets, { clearProps: mask ? "filter,transform,maskImage,webkitMaskImage" : "filter,transform" });
          };

          const disappear = () => {
            if (disappearAfter <= 0) return;
            const out: gsap.TweenVars = {
              [axis]: -distance * sign,
              scale: 0.8,
              opacity: animateOpacity ? initialOpacity : 0,
              delay: disappearAfter,
              duration: disappearDuration,
              ease: disappearEase,
              onComplete: () => callbacksRef.current.onDisappearanceComplete?.(),
            };
            if (blur > 0) out.filter = `blur(${blur}px)`;
            if (stagger > 0) out.stagger = { each: stagger, from: staggerFrom };
            gsap.to(targets, out);
          };

          const tl = gsap.timeline({
            paused: true,
            onStart: () => callbacksRef.current.onStart?.(),
            onComplete: () => {
              callbacksRef.current.onComplete?.();
              settle();
              if (once && !scrub) disappear();
            },
          });
          tl.fromTo(targets, from, to, scrub ? 0 : Math.max(delay, 0));

          if (trigger === "mount") {
            tl.play();
            return;
          }

          const start = `top ${(1 - threshold) * 100}%`;

          if (scrub) {
            ScrollTrigger.create({
              trigger: el,
              scroller,
              start,
              end: `top ${Math.max((1 - threshold) * 100 - 45, 5)}%`,
              scrub: scrub === true ? true : Math.max(Number(scrub) || 0, 0.01),
              animation: tl,
            });
            return;
          }

          ScrollTrigger.create({
            trigger: el,
            scroller,
            start,
            once,
            onEnter: () => {
              tl.play();
            },
            onLeaveBack: once
              ? undefined
              : () => {
                  if (mask) gsap.set(targets, { maskImage: mask, webkitMaskImage: mask });
                  tl.reverse();
                },
          });
        }, el);

        revert = () => ctx.revert();
      })
      .catch(() => {
        // Never leave content hidden if the animation library cannot load.
        reveal();
      });

    return () => {
      disposed = true;
      revert?.();
    };
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    rotate,
    tilt,
    wipe,
    threshold,
    delay,
    stagger,
    staggerFrom,
    trigger,
    once,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase,
  ]);

  return (
    <Tag ref={ref} className={`ac-pending ${className}`.trim()} style={style} {...props}>
      {children}
    </Tag>
  );
}
