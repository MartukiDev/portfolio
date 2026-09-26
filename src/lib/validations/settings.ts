import { z } from "zod";
import { adminForms } from "@/content/es/admin-forms";
import { checkbox, optionalText, optionalUrl, requiredText, tiptapDoc } from "./shared";

const v = adminForms.validation;

export const settingsSchema = z.object({
  nombre: requiredText(120, { required: v.required, max: v.tooLong(120) }),
  tagline: optionalText(120, v.tooLong(120)),
  hero_descripcion: optionalText(500, v.tooLong(500)),
  bio: tiptapDoc,
  disponible_freelance: checkbox,
  disponible_practica: checkbox,
  practica_desde: z.preprocess(
    (value) => (value === "" ? null : value),
    z.iso.date({ error: v.date }).nullable(),
  ),
  practica_duracion: optionalText(60, v.tooLong(60)),
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() !== "" ? value.trim().toLowerCase() : null),
    z.email({ error: v.email }).nullable(),
  ),
  whatsapp: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const digits = value.replace(/[\s+()-]/g, "");
      return digits === "" ? null : digits;
    },
    z.string().regex(/^[0-9]{8,15}$/, { error: v.whatsapp }).nullable(),
  ),
  github_url: optionalUrl(v.url),
  linkedin_url: optionalUrl(v.url),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type SettingsField = keyof SettingsInput;
