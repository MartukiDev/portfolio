import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/public/EmptyState";
import { ProjectExplorer, ProjectGrid } from "@/components/public/ProjectExplorer";
import { SectionTitle } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { getPublishedProjects } from "@/lib/queries/projects";

const t = publicContent.projects;

export const metadata: Metadata = {
  title: t.metaTitle,
  description: t.description,
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="flex flex-col gap-10 pt-10 sm:pt-16">
      <SectionTitle level={1} eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {projects.length === 0 ? (
        <EmptyState command={t.empty.command} output={t.empty.output} message={t.empty.message} />
      ) : (
        // useSearchParams en el filtro: el fallback prerenderizado muestra todos.
        <Suspense fallback={<ProjectGrid projects={projects} active={null} />}>
          <ProjectExplorer projects={projects} />
        </Suspense>
      )}
    </div>
  );
}
