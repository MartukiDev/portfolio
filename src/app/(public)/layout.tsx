import { MotionProvider } from "@/components/public/MotionProvider";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { publicContent } from "@/content/es/public";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        {publicContent.skipToContent}
      </a>
      <SiteHeader />
      <main id="contenido" className="container-site flex-1 pt-(--header-offset)">
        <MotionProvider>{children}</MotionProvider>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
