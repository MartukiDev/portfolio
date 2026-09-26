import type { Metadata } from "next";
import { TimelineManager } from "@/components/admin/TimelineManager";
import { SectionTitle } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";

const t = adminContent.timeline;

export const metadata: Metadata = { title: t.metaTitle };

export default async function TimelinePage() {
  const { supabase } = await requireAdmin();
  const { data: items, error } = await supabase.from("timeline_items").select("*").order("orden").order("id");

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {error ? <p role="alert" className="text-sm text-red-300">{adminForms.unexpectedError}</p> : <TimelineManager items={items} />}
    </div>
  );
}
