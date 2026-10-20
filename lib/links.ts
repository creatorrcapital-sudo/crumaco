import { contact, whatsappMessage } from "@/content/site";

/** wa.me link. Without a number, WhatsApp opens with the message pre-filled
 *  and the visitor picks the contact. */
export function whatsappHref(message: string = whatsappMessage) {
  const number = contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function mapHref() {
  if (contact.mapUrl) return contact.mapUrl;
  const query = [contact.streetAddress, contact.locality, contact.city, contact.postalCode].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
