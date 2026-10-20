// Simple in-memory sliding-window limiter. Good enough for a demo and for a
// single server; on Vercel each instance keeps its own window, so swap in a
// shared store (for example Upstash Redis) if spam becomes a problem.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.ENQUIRY_RATE_LIMIT ?? 5);
const hits = new Map<string, number[]>();

export function rateLimit(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}
