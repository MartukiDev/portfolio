import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { SectionTitle } from "@/components/ui/Heading";
import { adminProjects } from "@/content/es/admin-projects";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: adminProjects.form.newTitle,
};

export default async function NewProjectPage() {
  await requireAdmin();
  // El id se genera antes de guardar para poder subir imágenes a su carpeta.
  const projectId = crypto.randomUUID();

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle level={1} eyebrow={adminProjects.eyebrow} title={adminProjects.form.newTitle} />
      <ProjectForm mode="create" projectId={projectId} />
    </div>
  );
}
