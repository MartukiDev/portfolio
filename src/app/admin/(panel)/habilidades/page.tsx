import type { Metadata } from "next";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { SectionTitle } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";

const t = adminContent.skills;

export const metadata: Metadata = { title: t.metaTitle };

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();
  const { data: skills, error } = await supabase.from("skills").select("*").order("orden").order("id");

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {error ? <p role="alert" className="text-sm text-red-300">{adminForms.unexpectedError}</p> : <SkillsManager skills={skills} />}
    </div>
  );
}
