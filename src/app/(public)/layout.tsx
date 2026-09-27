import { MotionProvider } from "@/components/public/MotionProvider";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SkipLink } from "@/components/public/SkipLink";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="contenido" className="container-site flex-1 pt-(--header-offset)">
        <MotionProvider>{children}</MotionProvider>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
