import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { adminIcons } from "@/components/admin/icons";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heading, SectionTitle } from "@/components/ui/Heading";
import { admin } from "@/content/es/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: admin.dashboard.eyebrow,
};

const UNREAD_PREVIEW = 5;

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const t = admin.dashboard;

  const [unreadCount, unreadList, published, drafts] = await Promise.all([
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("leido", false),
    supabase
      .from("messages")
      .select("id, nombre, email, tipo, mensaje, created_at")
      .eq("leido", false)
      .order("created_at", { ascending: false })
      .limit(UNREAD_PREVIEW),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("publicado", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("publicado", false),
  ]);

  const loadFailed = [unreadCount, unreadList, published, drafts].some((result) => result.error);

  const stats = [
    { label: t.stats.unread, value: unreadCount.count, href: "/admin/mensajes", highlight: true },
    { label: t.stats.published, value: published.count, href: "/admin/proyectos", highlight: false },
    { label: t.stats.drafts, value: drafts.count, href: "/admin/proyectos", highlight: false },
  ];

  return (
    <div className="flex flex-col gap-10">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />

      {loadFailed && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {t.loadError}
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link href={stat.href} className="block rounded-2xl">
              <GlassCard blur={false} interactive className="flex flex-col gap-2">
                <span className="text-sm text-muted">{stat.label}</span>
                <span
                  className={`font-display text-4xl font-semibold ${
                    stat.highlight && (stat.value ?? 0) > 0 ? "text-accent" : "text-fg"
                  }`}
                >
                  {stat.value ?? "—"}
                </span>
              </GlassCard>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col gap-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <Heading level={2} size={4}>
              {t.unreadTitle}
            </Heading>
            <Link
              href="/admin/mensajes"
              className="inline-flex items-center gap-1 rounded text-sm text-accent hover:underline"
            >
              {t.viewAllMessages}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {unreadList.data && unreadList.data.length > 0 ? (
            <ul className="flex flex-col divide-y divide-glass-border">
              {unreadList.data.map((message) => (
                <li key={message.id} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">{message.nombre}</span>
                    <Badge>{t.consultaTipos[message.tipo]}</Badge>
                    <time dateTime={message.created_at} className="ml-auto text-xs text-muted">
                      {formatDateTime(message.created_at)}
                    </time>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">{message.mensaje}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">{t.unreadEmpty}</p>
          )}
        </GlassCard>

        <GlassCard className="flex flex-col gap-5">
          <Heading level={2} size={4}>
            {t.quickTitle}
          </Heading>
          <ul className="flex flex-col gap-2">
            {t.quick.map((item) => {
              const Icon = adminIcons[item.icon];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="glass-flat flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-glass-hover"
                  >
                    <Icon aria-hidden="true" className="size-4 text-accent" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
