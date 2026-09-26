import { z } from "zod";
import { adminForms } from "@/content/es/admin-forms";
import { projectFolder } from "@/lib/storage";
import { checkbox, optionalText, optionalUrl, requiredText, tiptapDoc } from "./shared";

const v = adminForms.validation;

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Genera un slug desde un título: sin tildes, minúsculas y guiones. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const categorias = ["cliente", "propio", "academico"] as const;

export const projectSchema = z
  .object({
    id: z.uuid(),
    titulo: requiredText(160, { required: v.required, max: v.tooLong(160) }),
    slug: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z
        .string()
        .min(1, { error: v.required })
        .max(80, { error: v.tooLong(80) })
        .regex(SLUG_PATTERN, { error: v.slug }),
    ),
    resumen: requiredText(300, { required: v.required, max: v.tooLong(300) }),
    categoria: z.enum(categorias, { error: v.required }),
    cliente: optionalText(160, v.tooLong(160)),
    rol: optionalText(2000, v.tooLong(2000)),
    problema: optionalText(2000, v.tooLong(2000)),
    resultado: optionalText(2000, v.tooLong(2000)),
    contenido: tiptapDoc,
    stack: z
      .array(z.string().trim().min(1, { error: v.stackItem }).max(40, { error: v.stackItem }))
      .max(30, { error: v.stackMax }),
    portada_path: z.preprocess((value) => (value === "" ? null : value), z.string().nullable()),
    galeria_paths: z.array(z.string()).max(20, { error: v.galleryMax }),
    demo_url: optionalUrl(v.url),
    repo_url: optionalUrl(v.url),
    publicado: checkbox,
    destacado: checkbox,
  })
  .superRefine((data, ctx) => {
    // Solo se aceptan imágenes de la carpeta del propio proyecto.
    const prefix = `${projectFolder(data.id)}/`;
    const inFolder = (path: string) => path.startsWith(prefix) && !path.includes("..");
    if (data.portada_path && !inFolder(data.portada_path)) {
      ctx.addIssue({ code: "custom", path: ["portada_path"], message: v.invalidPath });
    }
    if (!data.galeria_paths.every(inFolder)) {
      ctx.addIssue({ code: "custom", path: ["galeria_paths"], message: v.invalidPath });
    }
  });

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectField = keyof ProjectInput;

/** Lee el FormData del formulario de proyecto (incluye campos múltiples). */
export function projectFormData(formData: FormData): Record<string, unknown> {
  const single = (key: string) => formData.get(key) ?? undefined;
  return {
    id: single("id"),
    titulo: single("titulo"),
    slug: single("slug"),
    resumen: single("resumen"),
    categoria: single("categoria"),
    cliente: single("cliente"),
    rol: single("rol"),
    problema: single("problema"),
    resultado: single("resultado"),
    contenido: single("contenido"),
    stack: formData.getAll("stack"),
    portada_path: single("portada_path"),
    galeria_paths: formData.getAll("galeria_paths"),
    demo_url: single("demo_url"),
    repo_url: single("repo_url"),
    publicado: single("publicado"),
    destacado: single("destacado"),
  };
}
