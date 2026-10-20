// One-off asset pipeline: copies, renames and crops the client photos into
// /public/images, builds the logo variants in /public/brand and the app icons,
// and writes content/image-meta.generated.ts (size + average colour per image,
// used as a zero-cost placeholder while photos load).
//
// Usage: node scripts/prepare-assets.mjs ["path/to/source photos"]
// Default source folder: ../curmaco pics (next to this project).

import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(root, process.argv[2] ?? process.env.CRUMACO_PHOTOS ?? "../curmaco pics");
const OUT = path.join(root, "public/images");

// crop = [left, top, right, bottom] as fractions of the source image.
const jobs = [
  { out: "hero-lab.jpg", src: "crumaco lab2.jpg", width: 3200 },
  { out: "lab-treatment.jpg", src: "crumaco lab.jpg", width: 2400 },
  // Same room as the hero, cropped tight on the jerseys and equipment so it
  // does not read as a repeat.
  { out: "lab-floor.jpg", src: "crumaco lab2.jpg", crop: [0.38, 0.25, 1, 0.95], width: 2000 },
  { out: "lab-group.jpg", src: "crumaco lab3.jpg", width: 2400 },
  { out: "founder-coaching.webp", src: "owner.webp", copy: true },
  { out: "founder-athlete.webp", src: "owner2.webp", copy: true },
  { out: "philosophy.jpg", src: "22.jpg", width: 2000 },
  { out: "report.jpg", src: "2.jpg", width: 1600 },
  { out: "entry-pain.jpg", src: "6.jpg", width: 1200 },
  { out: "entry-fitness.jpg", src: "7.jpg", width: 1200 },
  { out: "entry-sport.jpg", src: "8.jpg", width: 1200 },
  // Crop off the bottom third: the tub carries another company's wordmark.
  { out: "entry-recovery.jpg", src: "10.jpg", crop: [0, 0, 1, 0.66] },
  { out: "entry-nutrition.jpg", src: "9.jpg", width: 1200 },
  { out: "entry-longevity.jpg", src: "11.jpg" },
  { out: "prog-01.jpg", src: "16.jpg", width: 1600 },
  { out: "prog-02.jpg", src: "15.jpg", width: 1600 },
  { out: "prog-03.jpg", src: "14.jpg", width: 1600 },
  // Crop to the left so the gym lettering on the back wall is hidden.
  { out: "prog-04.jpg", src: "17.jpg", crop: [0, 0, 0.66, 0.86], width: 1600 },
  { out: "prog-05.jpg", src: "18.jpg", width: 1600 },
  { out: "prog-06.jpg", src: "19.jpg", width: 1600 },
  { out: "prog-07.jpg", src: "20.jpg", width: 1600 },
  { out: "method.jpg", src: "12.jpg", width: 1600 },
  // Crop out the face at the top.
  { out: "cta.jpg", src: "1.jpg", crop: [0, 0.14, 1, 1], width: 2000 },
];

async function processImage(job) {
  const input = path.join(SRC, job.src);
  if (!existsSync(input)) throw new Error(`Missing source photo: ${input}`);
  const dest = path.join(OUT, job.out);

  if (job.copy) {
    await copyFile(input, dest);
  } else {
    let img = sharp(input).rotate();
    const { width: w, height: h } = await img.metadata();
    if (job.crop) {
      const [l, t, r, b] = job.crop;
      img = img.extract({
        left: Math.round(l * w),
        top: Math.round(t * h),
        width: Math.round((r - l) * w),
        height: Math.round((b - t) * h),
      });
      // Materialise the crop so the resize below applies to the cropped area.
      img = sharp(await img.toBuffer());
    }
    if (job.width) img = img.resize({ width: job.width, withoutEnlargement: true });
    await img.jpeg({ quality: 84, mozjpeg: true, progressive: true }).toFile(dest);
  }

  const meta = await sharp(dest).metadata();
  const { dominant } = await sharp(dest).resize(32).stats();
  const hex = "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return [`/images/${job.out}`, { width: meta.width, height: meta.height, color: hex }];
}

async function recolor(srcFile, hex, width) {
  const base = sharp(srcFile).trim().resize({ width });
  const { data: alpha, info } = await base.clone().extractChannel("alpha").raw().toBuffer({ resolveWithObject: true });
  return sharp({ create: { width: info.width, height: info.height, channels: 3, background: hex } })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png({ compressionLevel: 9 });
}

async function brand() {
  const dir = path.join(root, "public/brand");
  const full = path.join(root, "assets/brand-src/logo-full.png");
  const mark = path.join(root, "assets/brand-src/mark.png");
  await (await recolor(full, "#FC811E", 1200)).toFile(path.join(dir, "logo_orange.png"));
  await (await recolor(full, "#FFFFFF", 1200)).toFile(path.join(dir, "logo_white.png"));
  await (await recolor(mark, "#FC811E", 800)).toFile(path.join(dir, "mark_orange.png"));

  // App icons: orange mark centred on carbon.
  for (const [file, size] of [["app/icon.png", 192], ["app/apple-icon.png", 180]]) {
    const markPng = await (await recolor(mark, "#FC811E", Math.round(size * 0.78))).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: "#141312" } })
      .composite([{ input: markPng, gravity: "center" }])
      .png()
      .toFile(path.join(root, file));
  }
}

await mkdir(OUT, { recursive: true });
const entries = [];
for (const job of jobs) entries.push(await processImage(job));
await brand();

// Background for the generated Open Graph image (app/opengraph-image.tsx).
await sharp(path.join(OUT, "hero-lab.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .modulate({ saturation: 0.85 })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(root, "assets/og/hero-og.jpg"));

const body = `// Generated by scripts/prepare-assets.mjs. Do not edit by hand.
export const imageMeta: Record<string, { width: number; height: number; color: string }> = ${JSON.stringify(Object.fromEntries(entries), null, 2)};
`;
await writeFile(path.join(root, "content/image-meta.generated.ts"), body);
console.log(`Prepared ${entries.length} images and brand assets from ${SRC}`);
