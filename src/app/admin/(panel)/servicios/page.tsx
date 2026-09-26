import type { Metadata } from "next";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { SectionTitle } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";

const t = adminContent.services;

export const metadata: Metadata = { title: t.metaTitle };

export default async function ServicesPage() {
  const { supabase } = await requireAdmin();
  const { data: services, error } = await supabase.from("services").select("*").order("orden").order("id");

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {error ? <p role="alert" className="text-sm text-red-300">{adminForms.unexpectedError}</p> : <ServicesManager services={services} />}
    </div>
  );
}
