import { z } from "zod";
import { adminForms } from "@/content/es/admin-forms";
import { serviceIconNames } from "@/lib/icons";
import { checkbox, optionalText, requiredText } from "./shared";

const v = adminForms.validation;
const req = (max: number) => ({ required: v.required, max: v.tooLong(max) });

const optionalDate = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.iso.date({ error: v.date }).nullable(),
);

export const serviceSchema = z.object({
  titulo: requiredText(120, req(120)),
  descripcion: requiredText(600, req(600)),
  icono: z.preprocess((value) => (value === "" ? null : value), z.enum(serviceIconNames).nullable()),
  publicado: checkbox,
});
export type ServiceField = keyof z.infer<typeof serviceSchema>;

export const testimonialSchema = z.object({
  autor: requiredText(120, req(120)),
  cargo: optionalText(160, v.tooLong(160)),
  texto: requiredText(1000, req(1000)),
  project_id: z.preprocess((value) => (value === "" ? null : value), z.uuid().nullable()),
  publicado: checkbox,
});
export type TestimonialField = keyof z.infer<typeof testimonialSchema>;

export const tiposTrayectoria = ["formacion", "experiencia", "freelance", "ayudantia"] as const;

export const timelineSchema = z
  .object({
    tipo: z.enum(tiposTrayectoria, { error: v.required }),
    titulo: requiredText(160, req(160)),
    organizacion: optionalText(160, v.tooLong(160)),
    inicio: optionalDate,
    actual: checkbox,
    fin: optionalDate,
    descripcion: optionalText(1000, v.tooLong(1000)),
  })
  .transform(({ actual, ...data }) => ({ ...data, fin: actual ? null : data.fin }))
  .superRefine((data, ctx) => {
    if (data.inicio && data.fin && data.fin < data.inicio) {
      ctx.addIssue({ code: "custom", path: ["fin"], message: v.endBeforeStart });
    }
  });
export type TimelineField = keyof z.input<typeof timelineSchema>;

export const areasHabilidad = ["frontend", "backend", "hardware", "ia", "infra", "otras"] as const;

export const skillSchema = z.object({
  nombre: requiredText(60, req(60)),
  area: z.enum(areasHabilidad, { error: v.required }),
});
export type SkillField = keyof z.infer<typeof skillSchema>;
