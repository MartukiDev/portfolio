"use server";

import { after } from "next/server";
import { contactContent } from "@/content/es/contact";
import { sendContactNotification } from "@/lib/email/contact-notification";
import { getSiteSettings } from "@/lib/queries/settings";
import { createAnonWriteClient } from "@/lib/supabase/public";
import { contactSchema, type ContactField } from "@/lib/validations/contact";
import { invalid } from "./helpers";
import type { ActionResult, FormState } from "./result";

const MIN_FILL_MS = 3000;
const e = contactContent.errors;
const sent: ActionResult<ContactField> = { ok: true, message: contactContent.success.title };

export async function sendContactMessage(
  _prev: FormState<ContactField>,
  formData: FormData,
): Promise<ActionResult<ContactField>> {
  // Honeypot: un humano no ve este campo. Al bot se le responde "enviado" sin guardar nada.
  const honeypot = formData.get("sitio_web");
  if (typeof honeypot === "string" && honeypot.trim() !== "") return sent;

  // Tiempo mínimo desde que se cargó el formulario (sin la marca = envío sin JavaScript).
  const loadedAt = Number(formData.get("cargado_en"));
  if (!Number.isFinite(loadedAt) || loadedAt <= 0 || Date.now() - loadedAt < MIN_FILL_MS) {
    return { ok: false, error: e.tooFast };
  }

  const parsed = contactSchema.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    tipo: formData.get("tipo"),
    mensaje: formData.get("mensaje"),
  });
  if (!parsed.success) {
    const result = invalid<ContactField>(parsed.error);
    return result.ok ? result : { ...result, error: e.generic };
  }

  const { error } = await createAnonWriteClient().from("messages").insert(parsed.data);
  if (error) {
    console.error("[contacto] No se pudo guardar el mensaje:", error.message);
    return { ok: false, error: e.unexpected };
  }

  // El mensaje ya está guardado: el correo sale después de responder y, si falla, solo se registra.
  after(async () => {
    const settings = await getSiteSettings().catch(() => null);
    if (!settings?.email) {
      console.warn("[contacto] Sin site_settings.email: no se envía aviso.");
      return;
    }
    const result = await sendContactNotification(settings.email, parsed.data);
    if (!result.sent) console.error("[contacto] No se pudo enviar el aviso:", result.reason);
  });

  return sent;
}
