import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GitHubIcon } from "@/components/public/BrandIcons";
import { ProjectGallery } from "@/components/public/ProjectGallery";
import { Reveal } from "@/components/public/Reveal";
import { hasRichText, RichText } from "@/components/public/RichText";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Heading } from "@/components/ui/Heading";
import { publicContent } from "@/content/es/public";
import { getProjectBySlug, getPublishedProjectSlugs } from "@/lib/queries/projects";
import { mediaUrl } from "@/lib/storage";

const t = publicContent.caseStudy;

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.titulo, description: project.resumen };
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-4">
        <Heading level={2} size={3}>
          {title}
        </Heading>
        {children}
      </section>
    </Reveal>
  );
}

function Prose({ text }: { text: string }) {
  return <p className="text-lg leading-relaxed whitespace-pre-line text-fg/90">{text}</p>;
}

export default async function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const hasLinks = Boolean(project.demo_url || project.repo_url);

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-14 pt-10 sm:pt-16">
      <header className="flex flex-col gap-6">
        <Link href="/proyectos" className="inline-flex items-center gap-1.5 self-start rounded text-sm text-muted hover:text-fg">
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t.back}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{publicContent.categorias[project.categoria]}</Badge>
          {project.cliente && (
            <span className="text-sm text-muted">
              {t.client}: <span className="text-fg">{project.cliente}</span>
            </span>
          )}
        </div>
        <Heading level={1}>{project.titulo}</Heading>
        <p className="text-xl leading-relaxed text-muted">{project.resumen}</p>
        {project.portada_path && (
          <div className="glass-flat relative aspect-[1200/630] overflow-hidden rounded-2xl">
            <Image
              src={mediaUrl(project.portada_path)}
              alt={t.coverAlt(project.titulo)}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}
      </header>

      {project.problema && (
        <CaseSection title={t.sections.problem}>
          <Prose text={project.problema} />
        </CaseSection>
      )}
      {project.rol && (
        <CaseSection title={t.sections.role}>
          <Prose text={project.rol} />
        </CaseSection>
      )}
      {project.resultado && (
        <CaseSection title={t.sections.result}>
          <Prose text={project.resultado} />
        </CaseSection>
      )}
      {hasRichText(project.contenido) && (
        <CaseSection title={t.sections.technical}>
          <RichText doc={project.contenido} headingOffset={1} imageAlt={project.titulo} className="text-lg" />
        </CaseSection>
      )}
      {project.stack.length > 0 && (
        <CaseSection title={t.sections.stack}>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="glass-flat rounded-lg px-3 py-1.5 font-mono text-sm">
                {tech}
              </li>
            ))}
          </ul>
        </CaseSection>
      )}
      {hasLinks && (
        <CaseSection title={t.sections.links}>
          <div className="flex flex-col gap-3 sm:flex-row">
            {project.demo_url && (
              <Button href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" className="size-4" />
                {t.demo}
              </Button>
            )}
            {project.repo_url && (
              <Button href={project.repo_url} variant="secondary" target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-4" />
                {t.repo}
              </Button>
            )}
          </div>
        </CaseSection>
      )}
      {project.galeria_paths.length > 0 && (
        <CaseSection title={t.sections.gallery}>
          <ProjectGallery paths={project.galeria_paths} title={project.titulo} />
        </CaseSection>
      )}

      <Reveal>
        <GlassPanel className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Heading level={2} size={4}>
            {t.cta.title}
          </Heading>
          <Button href="/contacto">{t.cta.action}</Button>
        </GlassPanel>
      </Reveal>
    </article>
  );
}
