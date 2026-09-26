import type { Metadata } from "next";
import { NotFoundTerminal } from "@/components/public/NotFoundTerminal";
import { SiteHeader } from "@/components/public/SiteHeader";
import { publicContent } from "@/content/es/public";

export const metadata: Metadata = {
  title: publicContent.notFound.metaTitle,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="container-site flex flex-1 items-center pt-24 pb-16">
        <div className="w-full">
          <NotFoundTerminal />
        </div>
      </main>
    </>
  );
}
