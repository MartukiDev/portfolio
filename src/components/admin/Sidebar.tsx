"use client";

import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { admin } from "@/content/es/admin";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";
import { adminIcons } from "./icons";

type SidebarProps = {
  email: string | null;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ email }: SidebarProps) {
  const t = admin.nav;
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

  const close = () => setOpen(false);

  return (
    <>
      {/* Barra superior en móvil */}
      <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between rounded-none border-x-0 border-t-0 px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.open}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-fg hover:bg-glass-hover"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </header>

      {/* Overlay en móvil */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-bg/70 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="admin-sidebar"
        className={cn(
          "glass fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 rounded-none rounded-r-3xl p-4 transition-transform duration-200",
          "lg:inset-y-4 lg:left-4 lg:w-64 lg:translate-x-0 lg:rounded-3xl",
          open ? "translate-x-0" : "max-lg:invisible max-lg:-translate-x-full",
        )}
      >
        <div className="flex h-10 items-center justify-between px-2">
          <Brand />
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="-mr-1 inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-glass-hover hover:text-fg lg:hidden"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav aria-label={t.label} className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {t.items.map((item) => {
              const Icon = adminIcons[item.icon];
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-muted hover:bg-glass-hover hover:text-fg",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-1 border-t border-glass-border pt-4">
          {email && (
            <p className="truncate px-3 pb-2 font-mono text-xs text-muted" title={email}>
              {email}
            </p>
          )}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-fg"
          >
            <ExternalLink aria-hidden="true" className="size-4.5" />
            {t.viewSite}
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-glass-hover hover:text-fg"
            >
              <LogOut aria-hidden="true" className="size-4.5" />
              {t.signOut}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="font-display text-lg font-semibold tracking-wide text-fg">
      {admin.brand}
      <span className="ml-1.5 font-mono text-xs font-normal text-accent">{admin.brandSuffix}</span>
    </Link>
  );
}
