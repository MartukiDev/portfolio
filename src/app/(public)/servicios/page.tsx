import type { Metadata } from "next";
import { EmptyState } from "@/components/public/EmptyState";
import { Reveal } from "@/components/public/Reveal";
import { ServiceCard } from "@/components/public/ServiceCard";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionTitle } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { getPublishedServices } from "@/lib/queries/content";

const t = publicContent.services;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.description,
};

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="flex flex-col gap-12 pt-10 sm:pt-16">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {services.length === 0 ? (
        <EmptyState command={t.empty.command} output={t.empty.output} message={t.empty.message} />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={(index % 3) * 0.08} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <Reveal>
        <GlassPanel className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <SectionTitle eyebrow={t.eyebrow} title={t.cta.title} description={t.cta.description} />
          <Button href={t.cta.href} size="lg" className="self-start md:self-auto">
            {t.cta.action}
          </Button>
        </GlassPanel>
      </Reveal>
    </div>
  );
}
