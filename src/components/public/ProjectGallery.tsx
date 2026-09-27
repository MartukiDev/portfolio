"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { publicContent } from "@/content/es/public";
import { mediaUrl } from "@/lib/storage";

type ProjectGalleryProps = {
  paths: string[];
  title: string;
};

const t = publicContent.caseStudy;

export function ProjectGallery({ paths, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const titleId = useId();
  const total = paths.length;

  const go = (delta: number) =>
    setIndex((current) => (current === null ? null : (current + delta + total) % total));

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {paths.map((path, i) => (
          <li key={path}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t.lightbox.open(i + 1)}
              className="glass-flat group relative block aspect-[4/3] w-full overflow-hidden rounded-xl"
            >
              <Image
                src={mediaUrl(path)}
                alt={t.galleryAlt(title, i + 1)}
                fill
                sizes="(min-width: 1200px) 370px, (min-width: 1024px) 31vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={index !== null}
        onClose={() => setIndex(null)}
        labelledBy={titleId}
        className="max-w-5xl border-0 bg-transparent p-0 shadow-none backdrop:bg-bg/90"
      >
        {index !== null && (
          <div onKeyDown={onKeyDown} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p id={titleId} className="font-mono text-sm text-muted" aria-live="polite">
                {t.lightbox.label} · {t.lightbox.counter(index + 1, total)}
              </p>
              <button
                type="button"
                onClick={() => setIndex(null)}
                aria-label={t.lightbox.close}
                autoFocus
                className="inline-flex size-10 items-center justify-center rounded-full bg-surface text-fg hover:bg-glass-hover"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            {/* Alto fijo relativo a la pantalla: siempre cabe junto a los controles, sin scroll. */}
            <div className="relative h-[65dvh] w-full overflow-hidden rounded-2xl bg-surface">
              <Image
                src={mediaUrl(paths[index])}
                alt={t.galleryAlt(title, index + 1)}
                fill
                // lazy no carga dentro de un <dialog> modal; aquí hay una sola imagen montada.
                loading="eager"
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
              />
            </div>
            {total > 1 && (
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.lightbox.previous}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-surface text-fg hover:bg-glass-hover"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.lightbox.next}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-surface text-fg hover:bg-glass-hover"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
