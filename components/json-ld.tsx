import { brand, contact, founder, seo } from "@/content/site";
import { siteUrl } from "@/lib/links";

/** LocalBusiness (SportsActivityLocation) structured data. Empty placeholders
 *  are left out until the client supplies them. */
export function JsonLd() {
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": `${url}/#business`,
    name: brand.name,
    slogan: brand.positioning,
    description: seo.description,
    url,
    image: `${url}/images/hero-lab.jpg`,
    logo: `${url}/brand/logo_orange.png`,
    address: {
      "@type": "PostalAddress",
      ...(contact.streetAddress && { streetAddress: contact.streetAddress }),
      addressLocality: `${contact.locality}, ${contact.city}`,
      addressRegion: contact.region,
      ...(contact.postalCode && { postalCode: contact.postalCode }),
      addressCountry: contact.country,
    },
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.email && { email: contact.email }),
    ...(contact.instagram && { sameAs: [contact.instagram] }),
    ...(contact.hours.length && { openingHours: contact.hours.map((h) => `${h.days} ${h.time}`) }),
    founder: {
      "@type": "Person",
      name: brand.founder,
      jobTitle: "Founder",
      alumniOf: founder.credentials
        .filter((c) => c.category === "Doctorate" || c.category === "Degree")
        .map((c) => ({ "@type": "CollegeOrUniversity", name: c.issuer })),
      hasCredential: [
        ...founder.credentials
          .filter((c) => ["Doctorate", "Degree", "Certification"].includes(c.category))
          .map((c) => ({
            "@type": "EducationalOccupationalCredential",
            name: c.title.replace(/\*/g, ""),
            credentialCategory: c.category === "Certification" ? "certificate" : "degree",
            recognizedBy: { "@type": "Organization", name: c.issuer },
          })),
        ...founder.specialists.map((s) => ({
          "@type": "EducationalOccupationalCredential",
          name: `${s.name} — ${s.scope}`,
          credentialCategory: "certificate",
        })),
      ],
    },
    areaServed: { "@type": "AdministrativeArea", name: brand.areaServed },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
