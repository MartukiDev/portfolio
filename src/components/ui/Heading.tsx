import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  level: HeadingLevel;
  /** Estilo visual de otro nivel sin cambiar la semántica. */
  size?: HeadingLevel;
};

const sizes: Record<HeadingLevel, string> = {
  1: "heading-1",
  2: "heading-2",
  3: "heading-3",
  4: "heading-4",
};

export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cn(sizes[size ?? level], className)} {...props} />;
}

type SectionTitleProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  level?: HeadingLevel;
  align?: "left" | "center";
  className?: string;
};

/** Título de sección: etiqueta pequeña en mayúsculas + título Oswald + bajada opcional. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  level = 2,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <header
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <p className="eyebrow text-accent">{eyebrow}</p>
      <Heading level={level} size={2}>
        {title}
      </Heading>
      {description && (
        <p className="text-base leading-relaxed text-muted">{description}</p>
      )}
    </header>
  );
}
