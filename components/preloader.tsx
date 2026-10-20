import type { CSSProperties } from "react";
import Image from "next/image";
import { preloader } from "@/content/site";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

/** Letters pre-split on the server (no SplitText needed). Each letter sits in
 *  an overflow-hidden box so it can drop in and fall away. */
function Letters({ text, first }: { text: string; first?: boolean }) {
  return [...text].map((ch, i) => (
    <span key={i} className={`pl-char${first && i === 0 ? " pl-first" : ""}`} style={idx(i)}>
      <span>{ch}</span>
    </span>
  ));
}

function Stage({ preload }: { preload?: boolean }) {
  return (
    <div className="pl-stage">
      {/* The brand mark, small and quiet, above the name and the monogram. */}
      <Image src="/brand/mark_orange.png" alt="" width={120} height={29} className="pl-mark" preload={preload} />
      <div className="pl-intro">
        <Letters text={preloader.title} first />
      </div>
      <div className="pl-outro">
        <Letters text={preloader.outro} />
      </div>
    </div>
  );
}

/**
 * Preloader, adapted from the Codegrid "Nullspace" component:
 *   1. corner tags and the name drop in letter by letter
 *   2. every letter but the first falls away; "LAB" drops in beside it
 *   3. the two slide together and morph into the monogram
 *   4. a slit opens through the middle, then the screen splits top and bottom
 *
 * Rebuilt in plain CSS (app/globals.css, "Preloader") instead of GSAP: it
 * starts at the first frame rather than after the JavaScript loads, and adds
 * no library weight. Both halves hold the same animated stage, so the split
 * runs through the centre of the monogram. Plays on every page load; skipped
 * for reduced motion. The hero is fully painted underneath the whole time.
 */
export function Preloader() {
  return (
    <div className="pl" aria-hidden="true">
      <div className="pl-half pl-top">
        <Stage preload />
      </div>
      <div className="pl-half pl-bottom">
        <Stage />
      </div>
      <div className="pl-tags">
        {preloader.tags.map((tag, i) => (
          <p key={tag} className={`pl-tag pl-tag-${i + 1}`} style={idx(i)}>
            <span>{tag}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
