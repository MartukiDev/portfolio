"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { publicContent } from "@/content/es/public";

const t = publicContent.notFound;

export function NotFoundTerminal() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="glass overflow-hidden rounded-2xl sm:rounded-3xl">
      <div aria-hidden="true" className="relative flex h-10 items-center border-b border-glass-border px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]/80" />
          <span className="size-3 rounded-full bg-[#febc2e]/80" />
          <span className="size-3 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="absolute inset-x-16 truncate text-center font-mono text-xs text-muted">{t.windowTitle}</span>
      </div>
      <div className="flex flex-col gap-6 px-5 py-7 sm:px-10 sm:py-10">
        <div className="font-mono text-sm break-all sm:text-base">
          <p>
            <span className="text-accent">{t.prompt}</span> cd {pathname}
          </p>
          <p className="mt-1 text-red-300">{t.error(pathname)}</p>
        </div>
        <h1 className="font-mono text-[clamp(3rem,2rem+5vw,5rem)] leading-none font-semibold">404</h1>
        <p className="text-muted">{t.hint}</p>
        <div className="flex flex-col gap-3 font-sans sm:flex-row">
          <Button href="/" size="lg">
            {t.home}
          </Button>
          <Button href="/proyectos" size="lg" variant="secondary">
            {t.projects}
          </Button>
        </div>
      </div>
    </div>
  );
}
