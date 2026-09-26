import { Briefcase, Download, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CvTimeline } from "@/components/public/CvTimeline";
import { Reveal } from "@/components/public/Reveal";
import { hasRichText, RichText } from "@/components/public/RichText";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading, SectionTitle } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { formatMonthYear } from "@/lib/format";
import { getSkills, getTimeline } from "@/lib/queries/content";
import { getSiteSettings } from "@/lib/queries/settings";
import { CV_BUCKET, publicUrl } from "@/lib/storage";

const t = publicContent.cv;
const AREAS = ["frontend", "backend", "ia", "hardware", "infra", "otras"] as const;

export const metadata: Metadata = {
  title: t.metaTitle,
};

export default async function CvPage() {
  const [settings, timeline, skills] = await Promise.all([getSiteSettings(), getTimeline(), getSkills()]);
  if (!settings) notFound();

  // ?download= hace que Supabase lo sirva como descarga con ese nombre.
  const cvHref = settings.cv_pdf_path
    ? `${publicUrl(CV_BUCKET, settings.cv_pdf_path)}?download=${encodeURIComponent(t.downloadName(settings.nombre))}`
    : null;
  const skillGroups = AREAS.map((area) => ({ area, skills: skills.filter((skill) => skill.area === area) })).filter(
    (group) => group.skills.length > 0,
  );
  const available = settings.disponible_practica || settings.disponible_freelance;

  return (
    <div className="flex flex-col gap-16 pt-10 sm:pt-16">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle
          level={1}
          eyebrow={t.eyebrow}
          title={settings.nombre}
          description={settings.hero_descripcion ?? settings.tagline ?? undefined}
        />
        {cvHref && (
          <Button href={cvHref} size="lg" className="self-start sm:self-auto">
            <Download aria-hidden="true" className="size-4" />
            {t.download}
          </Button>
        )}
      </header>

      {available && (
        <Reveal>
          <GlassPanel as="section" aria-labelledby="disponibilidad" className="flex flex-col gap-6 border-success/25">
            <p id="disponibilidad" className="eyebrow text-success">
              {t.availability.eyebrow}
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {settings.disponible_practica && (
                <div className="flex gap-4">
                  <GraduationCap aria-hidden="true" className="mt-1 size-6 shrink-0 text-success" />
                  <div className="flex flex-col gap-1">
                    <Heading level={2} size={4}>
                      {t.availability.internshipTitle}
                    </Heading>
                    {settings.practica_desde && (
                      <p className="text-fg">{t.availability.internshipFrom(formatMonthYear(settings.practica_desde))}</p>
                    )}
                    {settings.practica_duracion && (
                      <p className="text-sm text-muted">{t.availability.internshipDuration(settings.practica_duracion)}</p>
                    )}
                  </div>
                </div>
              )}
              {settings.disponible_freelance && (
                <div className="flex gap-4">
                  <Briefcase aria-hidden="true" className="mt-1 size-6 shrink-0 text-success" />
                  <div className="flex flex-col gap-1">
                    <Heading level={2} size={4}>
                      {t.availability.freelanceTitle}
                    </Heading>
                    <p className="text-sm text-muted">{t.availability.freelanceText}</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              href={settings.disponible_practica ? "/contacto?tipo=practica" : "/contacto?tipo=freelance"}
              variant="secondary"
              className="self-start"
            >
              {t.availability.contact}
            </Button>
          </GlassPanel>
        </Reveal>
      )}

      {hasRichText(settings.bio) && (
        <Reveal>
          <section aria-labelledby="sobre-mi" className="flex flex-col gap-5">
            <Heading level={2} id="sobre-mi">
              {t.about}
            </Heading>
            <RichText doc={settings.bio} headingOffset={1} imageAlt={settings.nombre} className="max-w-3xl text-lg" />
          </section>
        </Reveal>
      )}

      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <section aria-labelledby="trayectoria" className="flex flex-col gap-8">
          <Heading level={2} id="trayectoria">
            {t.timeline.title}
          </Heading>
          {timeline.length > 0 ? <CvTimeline items={timeline} /> : <p className="text-muted">{t.timeline.empty}</p>}
        </section>

        <section aria-labelledby="habilidades" className="flex flex-col gap-8">
          <Heading level={2} id="habilidades">
            {t.skills.title}
          </Heading>
          {skillGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {skillGroups.map((group) => (
                <Reveal key={group.area}>
                  <GlassCard blur={false} className="flex flex-col gap-3">
                    <Heading level={3} size={4}>
                      {t.skills.areas[group.area]}
                    </Heading>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li key={skill.id} className="rounded-lg border border-glass-border px-3 py-1 font-mono text-sm">
                          {skill.nombre}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-muted">{t.skills.empty}</p>
          )}
        </section>
      </div>
    </div>
  );
}
