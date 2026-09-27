import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/public/BrandIcons";
import { ContactForm, ContactFormWithParams } from "@/components/public/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading, SectionTitle } from "@/components/ui/Heading";
import { contactContent } from "@/content/es/contact";
import { publicContent } from "@/content/es/public";
import { mailtoUrl } from "@/lib/contact";
import { formatMonthYear } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/queries/settings";

const t = contactContent;

export const metadata: Metadata = pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/contacto" });

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const firstName = settings?.nombre.split(" ")[0] ?? "";
  const formProps = { whatsapp: settings?.whatsapp ?? null, firstName };

  const links = [
    settings?.email && { href: mailtoUrl(settings.email), label: settings.email, icon: <Mail aria-hidden="true" className="size-4" />, external: false },
    settings?.github_url && { href: settings.github_url, label: t.aside.github, icon: <GitHubIcon className="size-4" />, external: true },
    settings?.linkedin_url && { href: settings.linkedin_url, label: t.aside.linkedin, icon: <LinkedInIcon className="size-4" />, external: true },
  ].filter((link) => Boolean(link)) as Array<{ href: string; label: string; icon: React.ReactNode; external: boolean }>;

  const badges = [
    settings?.disponible_freelance && publicContent.hero.badges.freelance,
    settings?.disponible_practica &&
      (settings.practica_desde
        ? publicContent.hero.badges.internshipFrom(formatMonthYear(settings.practica_desde))
        : publicContent.hero.badges.internship),
  ].filter((badge): badge is string => Boolean(badge));

  return (
    <div className="flex flex-col gap-10 pt-10 sm:pt-16">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <GlassPanel>
          {/* ?tipo= se lee en el cliente; el fallback prerenderizado es el mismo formulario sin preselección. */}
          <Suspense fallback={<ContactForm {...formProps} initialTipo={null} />}>
            <ContactFormWithParams {...formProps} />
          </Suspense>
        </GlassPanel>

        <aside className="flex flex-col gap-6">
          {badges.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li key={badge}>
                  <Badge variant="available">{badge}</Badge>
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <GlassCard blur={false} className="flex flex-col gap-4">
              <Heading level={2} size={4}>
                {t.aside.title}
              </Heading>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-2.5 rounded text-sm break-all text-muted transition-colors hover:text-accent"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {settings?.whatsapp && <p className="text-xs text-muted">{t.aside.whatsappHint}</p>}
            </GlassCard>
          )}
        </aside>
      </div>
    </div>
  );
}
