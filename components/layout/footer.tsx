import Image from "next/image";
import Link from "next/link";
import { brand, contact, footer, stickyBar } from "@/content/site";
import { whatsappHref, mapHref } from "@/lib/links";
import { WhatsAppIcon } from "@/components/ui/icons";

export function Footer() {
  const addressLines = [contact.streetAddress, `${contact.locality}, ${contact.city}${contact.postalCode ? ` ${contact.postalCode}` : ""}`].filter(Boolean);

  return (
    <footer className="theme-dark topo border-t border-bone/10 pb-28 lg:pb-0">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          {/* TODO: swap in the client's SVG logo when supplied. */}
          <Image src="/brand/logo_orange.png" alt="CRUMACO" width={145} height={48} className="h-12 w-auto" />
          <p className="mt-6 font-display text-3xl leading-tight text-bone">
            {brand.positioning}.
          </p>
          <p className="mt-2 text-sm text-ash">{brand.supportingLine}</p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow">{footer.visit}</p>
          <address className="mt-4 text-sm leading-relaxed not-italic">
            <a href={mapHref()} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
              {addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </a>
          </address>
          {contact.hours.length > 0 && (
            <div className="mt-6">
              <p className="eyebrow">{footer.hoursLabel}</p>
              <dl className="mt-3 text-sm">
                {contact.hours.map((h) => (
                  <div key={h.days} className="flex gap-3">
                    <dt className="text-ash">{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow">{footer.connect}</p>
          <ul className="mt-4 space-y-1 text-sm">
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" data-wa="footer" className="inline-flex min-h-11 items-center gap-2 hover:text-bone">
                <WhatsAppIcon className="size-4 text-orange" />
                {footer.whatsapp}
                <span className="sr-only">: {stickyBar.whatsappLabel}</span>
              </a>
            </li>
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex min-h-11 items-center hover:text-bone">{contact.phone}</a>
              </li>
            )}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center hover:text-bone">{contact.email}</a>
              </li>
            )}
            {contact.instagram && (
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-bone">{footer.instagram}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-bone/10 py-8 text-xs text-ash md:flex-row md:items-center md:justify-between">
        <p className="max-w-[62ch]">{footer.smallPrint}</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-bone hover:underline">
            {footer.privacy}
          </Link>
          <span>© CRUMACO</span>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      data-wa="floating"
      aria-label={stickyBar.whatsappLabel}
      className="group fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full border border-bone/15 bg-carbon text-orange shadow-[0_8px_30px_rgba(20,19,18,0.35)] [--ring-color:var(--color-orange)] transition-transform duration-200 hover:-translate-y-0.5 lg:flex"
    >
      <WhatsAppIcon className="size-6" />
      <span className="pointer-events-none absolute right-full mr-3 rounded-sm bg-carbon px-3 py-2 font-mono text-[11px] tracking-[0.15em] whitespace-nowrap text-bone uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        WhatsApp
      </span>
    </a>
  );
}
