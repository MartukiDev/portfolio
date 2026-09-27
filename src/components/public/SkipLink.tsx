import { publicContent } from "@/content/es/public";

/** Primer elemento enfocable: salta la navegación hasta el contenido principal (#contenido). */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
    >
      {publicContent.skipToContent}
    </a>
  );
}
