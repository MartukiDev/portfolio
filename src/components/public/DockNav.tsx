"use client";

import { BriefcaseBusiness, FileText, FolderKanban, type LucideIcon, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { publicContent } from "@/content/es/public";
import { cn } from "@/lib/cn";

type NavItem = (typeof publicContent.nav.items)[number];
type Tone = NavItem["icon"];

const icons: Record<Tone, LucideIcon> = {
  projects: FolderKanban,
  services: BriefcaseBusiness,
  cv: FileText,
  contact: Mail,
};

/** Cada "app" con su color de la paleta. El texto va en fg sobre fondo oscuro teñido (AA). */
const tones: Record<Tone, string> = {
  projects: "border-accent/35 from-accent/30 to-accent/[0.06] [--dock-icon:var(--accent)]",
  services: "border-accent-2/35 from-accent-2/30 to-accent-2/[0.06] [--dock-icon:var(--accent-2)]",
  cv: "border-success/35 from-success/25 to-success/[0.05] [--dock-icon:var(--success)]",
  contact: "border-accent/30 from-accent/25 via-accent-2/15 to-accent-2/[0.06] [--dock-icon:var(--accent)]",
};

// Ampliación tipo Dock: curva gaussiana según la distancia del cursor al centro de cada ícono.
const MAX_BOOST = 0.42; // escala máxima = 1.42
const SIGMA = 58; // px: qué tan lejos llega la influencia a los vecinos
const EASE = 0.22; // suavizado por frame (spring simple)

type DockNavProps = {
  items: readonly NavItem[];
  isActive: (href: string) => boolean;
};

/**
 * Navegación como Dock de macOS: íconos de "app" con texto y ampliación al
 * pasar el cursor. Solo transform (sin cambios de layout ni CLS); se anima en
 * un loop de requestAnimationFrame sin re-renders. Desactivado con
 * prefers-reduced-motion y en pantallas táctiles.
 */
export function DockNav({ items, isActive }: DockNavProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const tileRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let pointerX: number | null = null;
    let frame = 0;
    const scales = tileRefs.current.map(() => 1);

    const render = () => {
      const tiles = tileRefs.current;
      const listLeft = list.getBoundingClientRect().left;

      let settled = true;
      tiles.forEach((tile, i) => {
        if (!tile) return;
        // offsetLeft/offsetWidth no incluyen transforms: posiciones de reposo.
        // El <li> es el offsetParent del link; su offsetLeft es relativo a la lista.
        const itemLeft = tile.parentElement?.offsetLeft ?? 0;
        const center = listLeft + itemLeft + tile.offsetLeft + tile.offsetWidth / 2;
        const target =
          pointerX === null ? 1 : 1 + MAX_BOOST * Math.exp(-((pointerX - center) ** 2) / (2 * SIGMA ** 2));
        scales[i] += (target - scales[i]) * EASE;
        if (Math.abs(target - scales[i]) > 0.001) settled = false;
        else scales[i] = target;
      });

      // Crecen hacia la izquierda con el borde derecho fijo, sin encimarse.
      const extras = tiles.map((tile, i) => (tile ? tile.offsetWidth * (scales[i] - 1) : 0));
      tiles.forEach((tile, i) => {
        if (!tile) return;
        const toTheRight = extras.slice(i + 1).reduce((sum, extra) => sum + extra, 0);
        const shift = -(toTheRight + extras[i] / 2);
        tile.style.transform = scales[i] === 1 && shift === 0 ? "" : `translateX(${shift}px) scale(${scales[i]})`;
      });

      frame = settled ? 0 : requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      schedule();
    };
    const onLeave = () => {
      pointerX = null;
      schedule();
    };

    const enabled = () => canHover.matches && !reduced.matches;
    const attach = () => {
      if (!enabled()) return;
      list.addEventListener("pointermove", onMove);
      list.addEventListener("pointerleave", onLeave);
    };
    const detach = () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
    const onPreferenceChange = () => {
      detach();
      attach();
    };

    attach();
    canHover.addEventListener("change", onPreferenceChange);
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      detach();
      cancelAnimationFrame(frame);
      canHover.removeEventListener("change", onPreferenceChange);
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <ul ref={listRef} className="relative flex items-center gap-2">
      {items.map((item, index) => {
        const Icon = icons[item.icon];
        const active = isActive(item.href);
        return (
          <li key={item.href} className="relative">
            <Link
              ref={(node) => {
                tileRefs.current[index] = node;
              }}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 flex h-12 w-[4.75rem] origin-top flex-col items-center justify-center gap-1 rounded-[0.9rem] border bg-gradient-to-b shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_8px_20px_-8px_rgb(0_0_0/0.6)] will-change-transform",
                tones[item.icon],
              )}
            >
              <Icon aria-hidden="true" className="size-[1.1rem] text-(--dock-icon)" />
              <span className="text-[0.6875rem] leading-none font-medium text-fg">{item.label}</span>
            </Link>
            {/* Punto de "app abierta" bajo la página actual. */}
            {active && (
              <span aria-hidden="true" className="absolute -bottom-[0.4rem] left-1/2 size-1 -translate-x-1/2 rounded-full bg-fg/80" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
