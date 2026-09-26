import { z } from "zod";
import { contactContent } from "@/content/es/contact";

const e = contactContent.errors;

export const TIPOS_CONSULTA = ["freelance", "practica", "otro"] as const;
export type TipoConsulta = (typeof TIPOS_CONSULTA)[number];

export function parseTipo(value: string | null | undefined): TipoConsulta | null {
  return TIPOS_CONSULTA.find((tipo) => tipo === value) ?? null;
}

/** Mismos límites que los checks de la tabla messages. */
export const contactSchema = z.object({
  nombre: z.string().trim().min(1, { error: e.nombre }).max(120, { error: e.nombreMax }),
  email: z.email({ error: e.email }).trim().toLowerCase().max(254, { error: e.email }),
  tipo: z.enum(TIPOS_CONSULTA, { error: e.tipo }),
  mensaje: z.string().trim().min(10, { error: e.mensajeMin }).max(5000, { error: e.mensajeMax }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
