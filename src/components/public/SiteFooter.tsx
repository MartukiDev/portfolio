import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { publicContent } from "@/content/es/public";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import type { SiteSettings } from "@/lib/queries/settings";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "./BrandIcons";

const t = publicContent.footer;

type FooterLink = {
  href: string;
  label: string;
  display: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external: boolean;
};

function footerLinks(settings: SiteSettings | null): FooterLink[] {
  if (!settings) return [];
  const links: FooterLink[] = [];
  if (settings.email) {
    links.push({ href: mailtoUrl(settings.email), label: t.email, display: settings.email, icon: Mail, external: false });
  }
  if (settings.github_url) {
    links.push({ href: settings.github_url, label: t.github, display: t.github, icon: GitHubIcon, external: true });
  }
  if (settings.linkedin_url) {
    links.push({ href: settings.linkedin_url, label: t.linkedin, display: t.linkedin, icon: LinkedInIcon, external: true });
  }
  if (settings.whatsapp) {
    links.push({ href: whatsappUrl(settings.whatsapp), label: t.whatsapp, display: t.whatsapp, icon: WhatsAppIcon, external: true });
  }
  return links;
}

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const links = footerLinks(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-glass-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-sm text-muted">{t.rights(year, settings?.nombre ?? publicContent.brand)}</p>
        {links.length > 0 && (
          <nav aria-label={t.label}>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {links.map(({ href, label, display, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-2 rounded text-sm text-muted transition-colors hover:text-accent"
                  >
                    <Icon className="size-4" />
                    {display}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </footer>
  );
}
