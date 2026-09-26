"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { publicContent } from "@/content/es/public";
import { cn } from "@/lib/cn";
import { DockNav } from "./DockNav";
import { useHideOnScroll } from "./useHideOnScroll";

const t = publicContent.nav;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Con el menú móvil abierto, el header no se oculta.
  const isHidden = hidden && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 pt-3 transition-transform duration-300 ease-out",
        // Oculto al bajar; si se llega con el teclado (Tab), vuelve a mostrarse.
        isHidden && "-translate-y-[calc(100%+1rem)] has-[:focus-visible]:translate-y-0",
      )}
    >
      <div className="container-site">
        {/* Fondo más opaco que el vidrio base: el header pasa sobre texto grande al hacer scroll. */}
        <div
          className={cn(
            "glass rounded-2xl transition-colors",
            open ? "[--glass-bg:rgb(10_13_20/0.94)]" : "[--glass-bg:rgb(7_9_15/0.72)]",
          )}
        >
          <div className="flex h-16 items-center justify-between gap-4 pr-2 pl-5 md:pr-2.5">
            <Link href="/" onClick={() => setOpen(false)} className="font-display text-lg font-semibold tracking-wide">
              {publicContent.brand}
              <span className="text-accent">_</span>
            </Link>

            <nav aria-label={t.label} className="hidden md:block">
              <DockNav items={t.items} isActive={isActive} />
            </nav>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t.close : t.open}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex size-10 items-center justify-center rounded-full text-fg hover:bg-glass-hover md:hidden"
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>

          <nav
            id="mobile-nav"
            aria-label={t.label}
            className={cn("border-t border-glass-border px-3 pb-3 md:hidden", !open && "hidden")}
          >
            <ul className="flex flex-col gap-1 pt-3">
              {t.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-3 text-base transition-colors",
                      isActive(item.href) ? "bg-accent/10 text-accent" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
