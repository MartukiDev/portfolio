import type { Metadata } from "next";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { SectionTitle } from "@/components/ui/Heading";
import { adminContent } from "@/content/es/admin-content";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";

const t = adminContent.testimonials;

export const metadata: Metadata = { title: t.metaTitle };

export default async function TestimonialsPage() {
  const { supabase } = await requireAdmin();
  const [testimonials, projects] = await Promise.all([
    supabase.from("testimonials").select("*").order("orden").order("id"),
    supabase.from("projects").select("id, titulo, publicado").order("orden").order("id"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {testimonials.error || projects.error ? (
        <p role="alert" className="text-sm text-red-300">{adminForms.unexpectedError}</p>
      ) : (
        <TestimonialsManager testimonials={testimonials.data} projects={projects.data} />
      )}
    </div>
  );
}
