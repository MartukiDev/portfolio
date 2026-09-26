"use client";

import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { adminForms } from "@/content/es/admin-forms";
import { adminProjects } from "@/content/es/admin-projects";
import { saveProject } from "@/lib/actions/projects";
import type { FormState } from "@/lib/actions/result";
import type { Tables } from "@/lib/supabase/database.types";
import { categorias, slugify, type ProjectField } from "@/lib/validations/project";
import { CoverUpload } from "./CoverUpload";
import { fieldA11y, FormField } from "./FormField";
import { FormActions, FormSection } from "./FormSection";
import { GalleryUpload } from "./GalleryUpload";
import { RichTextEditor } from "./RichTextEditor";
import { submitWithoutReset } from "./submit";
import { TagInput } from "./TagInput";
import { useToast } from "./Toaster";

type ProjectFormProps =
  | { mode: "create"; projectId: string; project?: undefined }
  | { mode: "edit"; projectId: string; project: Tables<"projects"> };

export function ProjectForm({ mode, projectId, project }: ProjectFormProps) {
  const t = adminProjects.form;
  const f = t.fields;
  const notify = useToast();
  const router = useRouter();

  const [titulo, setTitulo] = useState(project?.titulo ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  // En un proyecto nuevo el slug sigue al título hasta que se edita a mano.
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const [state, formAction, pending] = useActionState<FormState<ProjectField>, FormData>(
    async (prev, formData) => {
      const result = await saveProject(prev, formData);
      notify(result);
      if (result.ok && result.created) {
        router.replace(`/admin/proyectos/${projectId}`);
      } else if (result.ok) {
        router.refresh();
      }
      return result;
    },
    null,
  );

  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const field = (name: ProjectField, hasHint = false) => ({
    name,
    ...fieldA11y(name, errors?.[name], hasHint),
  });

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="id" value={projectId} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/proyectos"
          className="inline-flex items-center gap-1.5 rounded text-sm text-muted hover:text-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t.back}
        </Link>
        {project?.publicado && (
          <Link
            href={`/proyectos/${project.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded text-sm text-accent hover:underline"
          >
            {t.viewPublic}
            <ExternalLink aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>

      <FormSection title={t.sections.basics}>
        <FormField id="titulo" label={f.titulo} errors={errors?.titulo}>
          <Input
            {...field("titulo")}
            value={titulo}
            onChange={(event) => {
              setTitulo(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            required
            maxLength={160}
          />
        </FormField>
        <FormField
          id="slug"
          label={f.slug}
          hint={
            <>
              {f.slugHint}
              <span className="font-mono text-fg">{slug || "…"}</span>
            </>
          }
          errors={errors?.slug}
        >
          <Input
            {...field("slug", true)}
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value.toLowerCase());
            }}
            onBlur={() => setSlug((current) => slugify(current))}
            className="font-mono"
            required
            maxLength={80}
            spellCheck={false}
            autoCapitalize="none"
          />
        </FormField>
        <FormField id="resumen" label={f.resumen} hint={f.resumenHint} errors={errors?.resumen}>
          <Textarea {...field("resumen", true)} defaultValue={project?.resumen ?? ""} rows={2} required maxLength={300} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="categoria" label={f.categoria} errors={errors?.categoria}>
            <Select {...field("categoria")} defaultValue={project?.categoria ?? "cliente"}>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {adminProjects.categorias[categoria]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="cliente" label={f.cliente} errors={errors?.cliente} optional>
            <Input {...field("cliente")} defaultValue={project?.cliente ?? ""} maxLength={160} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={t.sections.caseStudy}>
        <FormField id="problema" label={f.problema} errors={errors?.problema} optional>
          <Textarea {...field("problema")} defaultValue={project?.problema ?? ""} rows={4} maxLength={2000} />
        </FormField>
        <FormField id="rol" label={f.rol} errors={errors?.rol} optional>
          <Textarea {...field("rol")} defaultValue={project?.rol ?? ""} rows={4} maxLength={2000} />
        </FormField>
        <FormField id="resultado" label={f.resultado} errors={errors?.resultado} optional>
          <Textarea {...field("resultado")} defaultValue={project?.resultado ?? ""} rows={4} maxLength={2000} />
        </FormField>
      </FormSection>

      <FormSection title={t.sections.content}>
        <FormField id="contenido" label={f.contenido} errors={errors?.contenido} optional>
          <RichTextEditor
            {...fieldA11y("contenido", errors?.contenido)}
            name="contenido"
            projectId={projectId}
            defaultValue={(project?.contenido as JSONContent | null) ?? null}
          />
        </FormField>
      </FormSection>

      <FormSection title={t.sections.media}>
        <FormField id="portada" label={f.portada} hint={f.portadaHint} errors={errors?.portada_path} optional>
          <CoverUpload
            id="portada"
            name="portada_path"
            projectId={projectId}
            defaultPath={project?.portada_path ?? null}
            alt={t.coverAlt}
          />
        </FormField>
        <FormField id="galeria" label={f.galeria} errors={errors?.galeria_paths} optional>
          <GalleryUpload
            id="galeria"
            name="galeria_paths"
            projectId={projectId}
            defaultPaths={project?.galeria_paths ?? []}
            altFor={t.galleryAlt}
          />
        </FormField>
      </FormSection>

      <FormSection title={t.sections.links}>
        <FormField id="stack" label={f.stack} hint={adminForms.tags.hint} errors={errors?.stack} optional>
          <TagInput {...fieldA11y("stack", errors?.stack, true)} name="stack" defaultValue={project?.stack ?? []} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="demo_url" label={f.demo_url} errors={errors?.demo_url} optional>
            <Input {...field("demo_url")} type="url" defaultValue={project?.demo_url ?? ""} placeholder="https://" />
          </FormField>
          <FormField id="repo_url" label={f.repo_url} errors={errors?.repo_url} optional>
            <Input {...field("repo_url")} type="url" defaultValue={project?.repo_url ?? ""} placeholder="https://" />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={t.sections.visibility}>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm">{f.publicado}</span>
            <span className="text-xs text-muted">{f.publicadoHint}</span>
          </span>
          <Switch name="publicado" defaultChecked={project?.publicado ?? false} />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm">{f.destacado}</span>
            <span className="text-xs text-muted">{f.destacadoHint}</span>
          </span>
          <Switch name="destacado" defaultChecked={project?.destacado ?? false} />
        </label>
      </FormSection>

      <FormActions>
        {state && !state.ok && <p className="mr-auto text-sm text-red-300">{state.error}</p>}
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? adminForms.saving : adminForms.save}
        </Button>
      </FormActions>
    </form>
  );
}
