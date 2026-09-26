import { Heading } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { formatPeriod } from "@/lib/format";
import type { TimelineItem } from "@/lib/queries/content";
import { Reveal } from "./Reveal";

const t = publicContent.cv.timeline;
const ORDER = ["experiencia", "freelance", "ayudantia", "formacion"] as const;

/** Línea de tiempo agrupada por tipo, en el orden que se definió en el backoffice. */
export function CvTimeline({ items }: { items: TimelineItem[] }) {
  const groups = ORDER.map((tipo) => ({ tipo, items: items.filter((item) => item.tipo === tipo) })).filter(
    (group) => group.items.length > 0,
  );

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <Reveal key={group.tipo}>
          <section aria-labelledby={`tl-${group.tipo}`} className="flex flex-col gap-5">
            <Heading level={3} size={4} id={`tl-${group.tipo}`} className="text-accent">
              {t.tipos[group.tipo]}
            </Heading>
            <ol className="relative flex flex-col gap-7 border-l border-white/15 pl-6">
              {group.items.map((item) => {
                const period = formatPeriod(item.inicio, item.fin, t.current);
                return (
                  <li key={item.id} className="relative flex flex-col gap-1">
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 -left-[1.8rem] size-2.5 rounded-full border-2 border-bg ${
                        item.fin ? "bg-muted" : "bg-accent"
                      }`}
                    />
                    {period && <p className="font-mono text-xs text-muted">{period}</p>}
                    <p className="font-medium">{item.titulo}</p>
                    {item.organizacion && <p className="text-sm text-muted">{item.organizacion}</p>}
                    {item.descripcion && (
                      <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-fg/85">{item.descripcion}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
