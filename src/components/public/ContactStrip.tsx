import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import type { SiteSettings } from "@/lib/queries/settings";
import { WhatsAppIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";

const t = publicContent.contactStrip;

export function ContactStrip({ settings }: { settings: SiteSettings }) {
  return (
    <Reveal>
      <GlassPanel as="section" aria-labelledby="contact-strip-title" className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionTitle eyebrow={t.eyebrow} title={<span id="contact-strip-title">{t.title}</span>} description={t.description} />
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Button href="/contacto?tipo=freelance" size="lg">
            {t.cta}
          </Button>
          {settings.whatsapp && (
            <Button href={whatsappUrl(settings.whatsapp)} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" />
              {t.whatsapp}
            </Button>
          )}
          {!settings.whatsapp && settings.email && (
            <Button href={mailtoUrl(settings.email)} size="lg" variant="secondary">
              <Mail aria-hidden="true" className="size-4" />
              {t.email}
            </Button>
          )}
        </div>
      </GlassPanel>
    </Reveal>
  );
}
