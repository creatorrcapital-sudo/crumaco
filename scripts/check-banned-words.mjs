// Compliance check: scans the site source for banned words and claims.
// Whole-word, case-insensitive matches fail the check, except `Dr`, which
// is matched case-sensitively as a title ("Dr", "Dr.") so that "Draft" and
// "Drive" do not count. Raw substring hits are listed too, for review.
//
// Usage: node scripts/check-banned-words.mjs

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const DIRS = ["app", "components", "content", "lib"];
const EXT = /\.(tsx?|mjs|css|md|json)$/;

// From the brief's QA list, plus the other banned claims in its rules.
const BANNED = [
  { term: "Dr", re: /\bDr\b\.?/g, caseSensitive: true },
  ...["detox", "anti-ageing", "anti-aging", "cure", "cures", "cured", "guarantee", "guaranteed", "diabetes", "PCOS", "PCOD", "PRP", "HBOT",
    "fatty liver", "obesity", "hypertension", "GERD", "autoimmune", "reversal", "prevent disease", "drug-free", "injection", "injections"].map((term) => ({
    term,
    re: new RegExp(`\\b${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi"),
  })),
  { term: "5×", re: /\b5\s?[×x]\s?faster/gi },
];
const SUBSTRINGS = ["Dr", "detox", "ageing", "aging", "cure", "guarantee", "diabetes", "PCOS", "PRP", "HBOT"];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXT.test(name)) files.push(full);
  }
};
DIRS.forEach((d) => walk(path.join(root, d)));
files.push(path.join(root, "README.md"));

const hits = [];
const substringHits = [];
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const rel = path.relative(root, file);
  text.split("\n").forEach((line, i) => {
    for (const { term, re } of BANNED) {
      re.lastIndex = 0;
      if (re.test(line)) hits.push(`${rel}:${i + 1}  [${term}]  ${line.trim().slice(0, 120)}`);
    }
    for (const s of SUBSTRINGS) {
      if (line.toLowerCase().includes(s.toLowerCase())) substringHits.push(`${rel}:${i + 1}  ~${s}~  ${line.trim().slice(0, 100)}`);
    }
  });
}

console.log(`Scanned ${files.length} files.`);
console.log(`\nWhole-word hits (must be zero): ${hits.length}`);
hits.forEach((h) => console.log("  " + h));
console.log(`\nSubstring hits, for review (e.g. "Draft", "secure", "ageing" in "healthy ageing"): ${substringHits.length}`);
substringHits.forEach((h) => console.log("  " + h));
process.exitCode = hits.length ? 1 : 0;
