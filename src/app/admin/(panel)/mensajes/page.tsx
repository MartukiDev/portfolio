import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { MessageActions } from "@/components/admin/MessageActions";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: adminContent.messages.metaTitle,
};

const PAGE_SIZE = 50;
const tipos = ["freelance", "practica", "otro"] as const;

const filtersSchema = z.object({
  tipo: z.enum(tipos).optional().catch(undefined),
  estado: z.literal("no-leidos").optional().catch(undefined),
  pagina: z.coerce.number().int().min(1).optional().catch(undefined),
});
type Filters = z.infer<typeof filtersSchema>;

function hrefWith(filters: Filters, patch: Partial<Filters>): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (next.tipo) params.set("tipo", next.tipo);
  if (next.estado) params.set("estado", next.estado);
  if (next.pagina && next.pagina > 1) params.set("pagina", String(next.pagina));
  const query = params.toString();
  return query ? `/admin/mensajes?${query}` : "/admin/mensajes";
}

export default async function MessagesPage({ searchParams }: PageProps<"/admin/mensajes">) {
  const { supabase } = await requireAdmin();
  const t = adminContent.messages;
  const filters = filtersSchema.parse(await searchParams);
  const page = filters.pagina ?? 1;

  let query = supabase
    .from("messages")
    .select("id, nombre, email, tipo, mensaje, leido, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (filters.tipo) query = query.eq("tipo", filters.tipo);
  if (filters.estado === "no-leidos") query = query.eq("leido", false);

  const { data: messages, count, error } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const chip = (active: boolean) =>
    cn(
      "inline-flex h-8 items-center rounded-full border px-3 text-sm transition-colors",
      active ? "border-accent/50 bg-accent/10 text-accent" : "border-glass-border text-muted hover:text-fg",
    );

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <nav aria-label={t.filters.label} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{t.filters.type}</span>
          <Link href={hrefWith(filters, { tipo: undefined, pagina: 1 })} className={chip(!filters.tipo)} aria-current={!filters.tipo ? "page" : undefined}>
            {t.filters.all}
          </Link>
          {tipos.map((tipo) => (
            <Link
              key={tipo}
              href={hrefWith(filters, { tipo, pagina: 1 })}
              className={chip(filters.tipo === tipo)}
              aria-current={filters.tipo === tipo ? "page" : undefined}
            >
              {t.tipos[tipo]}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{t.filters.status}</span>
          <Link href={hrefWith(filters, { estado: undefined, pagina: 1 })} className={chip(!filters.estado)} aria-current={!filters.estado ? "page" : undefined}>
            {t.filters.all}
          </Link>
          <Link
            href={hrefWith(filters, { estado: "no-leidos", pagina: 1 })}
            className={chip(filters.estado === "no-leidos")}
            aria-current={filters.estado === "no-leidos" ? "page" : undefined}
          >
            {t.filters.unread}
          </Link>
        </div>
      </nav>

      <GlassCard className="p-0 sm:p-0">
        {error ? (
          <p role="alert" className="p-6 text-sm text-red-300">
            {adminForms.unexpectedError}
          </p>
        ) : messages.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t.empty}</p>
        ) : (
          <ul className="divide-y divide-glass-border">
            {messages.map((message) => (
              <li key={message.id} className="flex items-start gap-3 px-4 py-4 sm:px-6">
                <span
                  className={cn("mt-2 size-2 shrink-0 rounded-full", message.leido ? "bg-transparent" : "bg-accent")}
                  aria-hidden="true"
                />
                <Link href={`/admin/mensajes/${message.id}`} className="group flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={cn("group-hover:text-accent", message.leido ? "text-fg" : "font-semibold text-fg")}>
                      {message.nombre}
                    </span>
                    {!message.leido && <span className="sr-only">({t.unreadDot})</span>}
                    <span className="truncate text-sm text-muted">{message.email}</span>
                    <Badge>{t.tipos[message.tipo]}</Badge>
                    <time dateTime={message.created_at} className="text-xs text-muted sm:ml-auto">
                      {formatDateTime(message.created_at)}
                    </time>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">{message.mensaje}</p>
                </Link>
                <MessageActions id={message.id} leido={message.leido} compact />
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      {totalPages > 1 && (
        <nav aria-label={t.pagination.label} className="flex items-center justify-between gap-4 text-sm">
          {page > 1 ? (
            <Link href={hrefWith(filters, { pagina: page - 1 })} className="text-accent hover:underline">
              ← {t.pagination.previous}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">{t.pagination.page(page, totalPages)}</span>
          {page < totalPages ? (
            <Link href={hrefWith(filters, { pagina: page + 1 })} className="text-accent hover:underline">
              {t.pagination.next} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
