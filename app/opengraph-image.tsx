import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hero, seo } from "@/content/site";

export const alt = seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once at module load with literal paths, so the image is generated at
// build time and only these files are traced into the deployment.
const [photo, logo, serif, serifItalic, mono] = await Promise.all([
  readFile(join(process.cwd(), "assets/og/hero-og.jpg")),
  readFile(join(process.cwd(), "public/brand/logo_orange.png")),
  readFile(join(process.cwd(), "assets/og/instrument-serif-latin-400-normal.woff")),
  readFile(join(process.cwd(), "assets/og/instrument-serif-latin-400-italic.woff")),
  readFile(join(process.cwd(), "assets/og/ibm-plex-mono-latin-500-normal.woff")),
]);

export default async function OpengraphImage() {
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const [lead, accent] = hero.headline.split("*").filter(Boolean);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#141312" }}>
        {/* Satori needs explicit sizes (no `inset`) and gradients as backgroundImage. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoSrc} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(90deg, rgba(20,19,18,0.96) 0%, rgba(20,19,18,0.86) 48%, rgba(20,19,18,0.35) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(0deg, rgba(20,19,18,0.92) 0%, rgba(20,19,18,0) 60%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={196} height={65} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Plex Mono", fontSize: 18, letterSpacing: 3.6, color: "#FC811E", textTransform: "uppercase" }}>
              <div style={{ width: 28, height: 2, background: "#FC811E" }} />
              Sports performance & recovery lab · Chhatarpur, New Delhi
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontFamily: "Instrument Serif", fontSize: 104, lineHeight: 0.95, color: "#F3EFE8" }}>
              <span>{lead.trim()}</span>
              <span style={{ fontStyle: "italic", color: "#FC811E" }}>{accent}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
