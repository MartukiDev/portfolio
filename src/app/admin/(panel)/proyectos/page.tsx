import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { ProjectList } from "@/components/admin/ProjectList";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionTitle } from "@/components/ui/Heading";
import { adminForms } from "@/content/es/admin-forms";
import { adminProjects } from "@/content/es/admin-projects";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: adminProjects.metaTitle,
};

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin();
  const t = adminProjects;

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, titulo, slug, categoria, publicado, destacado, portada_path")
    .order("orden")
    .order("id");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
        <Button href="/admin/proyectos/nuevo">
          <Plus aria-hidden="true" className="size-4" />
          {t.newProject}
        </Button>
      </div>

      <GlassCard>
        {error ? (
          <p role="alert" className="text-sm text-red-300">
            {adminForms.unexpectedError}
          </p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted">{t.empty}</p>
        ) : (
          <ProjectList projects={projects} />
        )}
      </GlassCard>
    </div>
  );
}
