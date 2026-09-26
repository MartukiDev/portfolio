"use client";

import { Link2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { adminContent } from "@/content/es/admin-content";
import {
  deleteTestimonial,
  moveTestimonial,
  saveTestimonial,
  setTestimonialPublished,
} from "@/lib/actions/testimonials";
import type { Tables } from "@/lib/supabase/database.types";
import { EntityDialog } from "./EntityDialog";
import { fieldA11y, FormField } from "./FormField";
import { SortableList } from "./SortableList";
import { useEntityEditor } from "./useEntityEditor";

type Testimonial = Tables<"testimonials">;
export type ProjectOption = Pick<Tables<"projects">, "id" | "titulo" | "publicado">;

const t = adminContent.testimonials;
const c = adminContent.common;

export function TestimonialsManager({
  testimonials,
  projects,
}: {
  testimonials: Testimonial[];
  projects: ProjectOption[];
}) {
  const editor = useEntityEditor<Testimonial>();
  const current = editor.state.mode === "edit" ? editor.state.item : null;
  const projectTitle = new Map(projects.map((project) => [project.id, project.titulo]));

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => editor.create({})}>
          <Plus aria-hidden="true" className="size-4" />
          {t.newItem}
        </Button>
      </div>

      <GlassCard>
        {testimonials.length === 0 ? (
          <p className="text-sm text-muted">{t.empty}</p>
        ) : (
          <SortableList
            items={testimonials}
            getLabel={(item) => item.autor}
            onMove={moveTestimonial}
            onDelete={deleteTestimonial}
            edit={{ onEdit: editor.edit }}
            toggles={[{ key: "publicado", label: c.published, ariaLabel: c.togglePublished, action: setTestimonialPublished }]}
            renderContent={(item) => (
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium">{item.autor}</span>
                  {item.cargo && <span className="text-sm text-muted">· {item.cargo}</span>}
                  {!item.publicado && <Badge>{c.draft}</Badge>}
                </div>
                <p className="line-clamp-2 text-sm text-muted">“{item.texto}”</p>
                {item.project_id && projectTitle.has(item.project_id) && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                    <Link2 aria-hidden="true" className="size-3.5" />
                    {projectTitle.get(item.project_id)}
                  </span>
                )}
              </div>
            )}
          />
        )}
      </GlassCard>

      <EntityDialog
        open={editor.open}
        onClose={editor.close}
        title={current ? t.editTitle : t.newTitle}
        id={current?.id ?? null}
        action={saveTestimonial}
      >
        {(errors) => (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="autor" label={t.fields.autor} errors={errors?.autor}>
                <Input {...fieldA11y("autor", errors?.autor)} name="autor" defaultValue={current?.autor ?? ""} maxLength={120} autoFocus />
              </FormField>
              <FormField id="cargo" label={t.fields.cargo} errors={errors?.cargo} optional>
                <Input {...fieldA11y("cargo", errors?.cargo)} name="cargo" defaultValue={current?.cargo ?? ""} maxLength={160} />
              </FormField>
            </div>
            <FormField id="texto" label={t.fields.texto} errors={errors?.texto}>
              <Textarea {...fieldA11y("texto", errors?.texto)} name="texto" defaultValue={current?.texto ?? ""} rows={5} maxLength={1000} />
            </FormField>
            <FormField id="project_id" label={t.fields.project_id} errors={errors?.project_id} optional>
              <Select {...fieldA11y("project_id", errors?.project_id)} name="project_id" defaultValue={current?.project_id ?? ""}>
                <option value="">{t.noProject}</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.titulo} {project.publicado ? "" : t.draftProject}
                  </option>
                ))}
              </Select>
            </FormField>
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm">{t.fields.publicado}</span>
              <Switch name="publicado" defaultChecked={current?.publicado ?? true} />
            </label>
          </>
        )}
      </EntityDialog>
    </>
  );
}
