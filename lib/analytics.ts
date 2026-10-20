type EventName = "cta_click" | "form_start" | "form_step" | "form_submit" | "whatsapp_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Sends an event to GA4 and Meta Pixel when they are loaded. No-op otherwise. */
export function track(event: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  if (window.fbq) {
    if (event === "form_submit") window.fbq("track", "Lead", params);
    else window.fbq("trackCustom", event, params);
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}
