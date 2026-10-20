import { faq } from "@/content/site";
import { mapHref, whatsappHref } from "@/lib/links";
import { SectionHeading } from "@/components/ui/primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowUpRight, WhatsAppIcon } from "@/components/ui/icons";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="theme-light section-y border-t rule">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeading number={faq.number} label={faq.label} heading={faq.heading} id="faq-heading" />
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" data-wa="faq" className="btn-text mt-8">
            <WhatsAppIcon className="size-4 text-ink" />
            {faq.stillUnsure}
          </a>
        </div>

        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion type="single" collapsible className="border-t rule">
            {faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger>
                  <span className="font-display text-[1.5rem] leading-[1.15] text-ink sm:text-[1.75rem]">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="prose-body">{item.a}</p>
                  {item.map && (
                    <a href={mapHref()} target="_blank" rel="noopener noreferrer" className="btn-text mt-2">
                      {faq.mapLabel}
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
