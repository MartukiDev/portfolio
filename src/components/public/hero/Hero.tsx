import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { publicContent } from "@/content/es/public";
import { formatMonthYear } from "@/lib/format";
import type { SiteSettings } from "@/lib/queries/settings";
import { HeroTerminal } from "./HeroTerminal";

const t = publicContent.hero;

function availabilityBadges(settings: SiteSettings): string[] {
  const badges: string[] = [];
  if (settings.disponible_freelance) badges.push(t.badges.freelance);
  if (settings.disponible_practica) {
    const parts = [
      settings.practica_desde ? t.badges.internshipFrom(formatMonthYear(settings.practica_desde)) : t.badges.internship,
      settings.practica_duracion,
    ].filter(Boolean);
    badges.push(parts.join(" · "));
  }
  return badges;
}

export function Hero({ settings }: { settings: SiteSettings }) {
  const badges = availabilityBadges(settings);

  // Centrado en el área bajo el header, con una leve elevación óptica (5svh):
  // el aire sobre y bajo la terminal queda casi igual.
  return (
    <section aria-labelledby="hero-title" className="flex min-h-[calc(100svh-var(--header-offset))] items-center pb-[5svh]">
      <div className="w-full">
        {/* Texto real para lectores de pantalla y buscadores; la terminal es decorativa. */}
        <h1 id="hero-title" className="sr-only">
          {settings.nombre}
        </h1>
        {settings.tagline && <p className="sr-only">{settings.tagline}</p>}

        <HeroTerminal
          windowTitle={t.windowTitle}
          prompt={t.prompt}
          command={t.command}
          name={settings.nombre}
          tagline={settings.tagline}
        >
          {badges.length > 0 && (
            <ul className="flex flex-wrap gap-2 font-sans">
              {badges.map((badge) => (
                <li key={badge}>
                  <Badge variant="available">{badge}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col gap-3 font-sans sm:flex-row">
            <Button href={t.ctaPrimary.href} size="lg">
              {t.ctaPrimary.label}
            </Button>
            <Button href={t.ctaSecondary.href} size="lg" variant="secondary">
              {t.ctaSecondary.label}
            </Button>
          </div>
        </HeroTerminal>
      </div>
    </section>
  );
}
