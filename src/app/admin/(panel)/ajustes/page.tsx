import type { Metadata } from "next";
import { CvUpload } from "@/components/admin/CvUpload";
import { FormSection } from "@/components/admin/FormSection";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SectionTitle } from "@/components/ui/Heading";
import { adminForms } from "@/content/es/admin-forms";
import { adminSettings } from "@/content/es/admin-settings";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: adminSettings.metaTitle,
};

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data: settings, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const t = adminSettings;

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {adminForms.unexpectedError}
        </p>
      )}
      <FormSection title={t.sections.cv}>
        <CvUpload currentPath={settings?.cv_pdf_path ?? null} version={settings?.updated_at ?? ""} />
      </FormSection>
      <SettingsForm settings={settings} />
    </div>
  );
}
