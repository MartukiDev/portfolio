import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/ui/Heading";
import { Reveal } from "./Reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  children: ReactNode;
};

/** Sección de la portada: título con etiqueta, link opcional "ver todo" y contenido. */
export function Section({ id, eyebrow, title, description, link, children }: SectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow={eyebrow} title={<span id={id}>{title}</span>} description={description} />
        {link && (
          <Link href={link.href} className="inline-flex items-center gap-1.5 rounded text-sm text-accent hover:underline">
            {link.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </Reveal>
      {children}
    </section>
  );
}
