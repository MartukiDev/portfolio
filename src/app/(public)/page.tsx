import { notFound } from "next/navigation";
import { Hero } from "@/components/public/hero/Hero";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function HomePage() {
  const settings = await getSiteSettings();
  if (!settings) notFound();

  const t = publicContent.placeholder;

  return (
    <>
      <Hero settings={settings} />
      <GlassCard className="mt-8">
        <SectionTitle eyebrow={t.eyebrow} title={t.title} description={t.description} />
      </GlassCard>
    </>
  );
}
