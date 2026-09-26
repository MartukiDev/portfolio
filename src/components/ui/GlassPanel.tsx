import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type PanelElement = "div" | "section" | "aside" | "article";

type GlassPanelProps<T extends PanelElement> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Contenedor principal de vidrio (secciones, terminal del hero, paneles del backoffice). */
export function GlassPanel<T extends PanelElement = "div">({
  as,
  className,
  ...props
}: GlassPanelProps<T>) {
  const Component: PanelElement = as ?? "div";
  return (
    <Component
      className={cn("glass rounded-3xl p-6 sm:p-8 lg:p-10", className)}
      {...props}
    />
  );
}
