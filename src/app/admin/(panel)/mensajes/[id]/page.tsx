import { ArrowLeft, Reply } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { MarkAsReadOnOpen, MessageActions } from "@/components/admin/MessageActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heading } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { mailtoUrl } from "@/lib/contact";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: adminContent.messages.metaTitle,
};

export default async function MessagePage({ params }: PageProps<"/admin/mensajes/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data: message } = await supabase.from("messages").select("*").eq("id", id).maybeSingle();
  if (!message) notFound();

  const t = adminContent.messages;
  const mailto = mailtoUrl(message.email, t.replySubject);

  return (
    <div className="flex flex-col gap-6">
      <MarkAsReadOnOpen id={message.id} leido={message.leido} />

      <Link href="/admin/mensajes" className="inline-flex items-center gap-1.5 self-start rounded text-sm text-muted hover:text-fg">
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t.back}
      </Link>

      <GlassCard className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={1} size={3}>
              {message.nombre}
            </Heading>
            <Badge>{t.tipos[message.tipo]}</Badge>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-4">
            <a href={mailto} className="font-mono text-accent hover:underline">
              {message.email}
            </a>
            <span>
              {t.receivedAt}{" "}
              <time dateTime={message.created_at}>{formatDateTime(message.created_at)}</time>
            </span>
          </div>
        </header>

        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.mensaje}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass-border pt-5">
          <Button href={mailto}>
            <Reply aria-hidden="true" className="size-4" />
            {t.reply}
          </Button>
          <MessageActions id={message.id} leido={message.leido} afterDeleteHref="/admin/mensajes" />
        </div>
      </GlassCard>
    </div>
  );
}
