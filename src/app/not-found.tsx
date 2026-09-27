import type { Metadata } from "next";
import { NotFoundTerminal } from "@/components/public/NotFoundTerminal";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SkipLink } from "@/components/public/SkipLink";
import { publicContent } from "@/content/es/public";
import { getSiteSettings } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: publicContent.notFound.metaTitle,
  robots: { index: false },
};

export default async function NotFound() {
  const settings = await getSiteSettings().catch(() => null);

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="contenido" className="container-site flex flex-1 items-center pt-[calc(var(--header-offset)+1rem)] pb-16">
        <div className="w-full">
          <NotFoundTerminal />
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
