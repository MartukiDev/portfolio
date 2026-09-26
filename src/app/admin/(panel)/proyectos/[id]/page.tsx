import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { SectionTitle } from "@/components/ui/Heading";
import { adminProjects } from "@/content/es/admin-projects";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: adminProjects.form.editTitle,
};

export default async function EditProjectPage({ params }: PageProps<"/admin/proyectos/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={adminProjects.form.editTitle} title={project.titulo} />
      <ProjectForm key={project.updated_at} mode="edit" projectId={project.id} project={project} />
    </div>
  );
}
