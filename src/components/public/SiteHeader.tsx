"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { publicContent } from "@/content/es/public";
import { cn } from "@/lib/cn";

const t = publicContent.nav;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const linkClass = (href: string) =>
    cn(
      "rounded-full px-4 py-2 text-sm transition-colors",
      isActive(pathname, href) ? "bg-accent/10 text-accent" : "text-muted hover:text-fg",
    );

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6">
      {/* Fondo más opaco que el vidrio base: el header pasa sobre texto grande al hacer scroll. */}
      <div
        className={cn(
          "glass mx-auto max-w-6xl rounded-2xl transition-colors",
          open ? "[--glass-bg:rgb(10_13_20/0.94)]" : "[--glass-bg:rgb(7_9_15/0.72)]",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-4 pr-2 pl-5">
          <Link href="/" onClick={() => setOpen(false)} className="font-display text-lg font-semibold tracking-wide">
            {publicContent.brand}
            <span className="text-accent">_</span>
          </Link>

          <nav aria-label={t.label} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {t.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={linkClass(item.href)}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
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
                  className={cn(linkClass(item.href), "block py-3 text-base")}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
