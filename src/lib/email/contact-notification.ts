import "server-only";
import { Resend } from "resend";
import { contactContent } from "@/content/es/contact";
import type { ContactInput } from "@/lib/validations/contact";

const t = contactContent.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type NotifyResult = { sent: true } | { sent: false; reason: string };

/**
 * Aviso por correo de un mensaje nuevo. Todo lo que viene del formulario se
 * escapa; Reply-To apunta al remitente para responder directo.
 */
export async function sendContactNotification(to: string, message: ContactInput): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return { sent: false, reason: "Falta RESEND_API_KEY o CONTACT_FROM_EMAIL" };

  const tipo = contactContent.tipos[message.tipo];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const panelUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin/mensajes` : null;

  const text = [
    t.heading,
    "",
    `${t.from}: ${message.nombre} <${message.email}>`,
    `${t.type}: ${tipo}`,
    "",
    message.mensaje,
    "",
    t.reply,
    ...(panelUrl ? [`${t.panel}: ${panelUrl}`] : []),
  ].join("\n");

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e5e7eb">
      <h1 style="margin:0 0 16px;font-size:18px">${escapeHtml(t.heading)}</h1>
      <p style="margin:0 0 4px"><strong>${escapeHtml(t.from)}:</strong> ${escapeHtml(message.nombre)} &lt;${escapeHtml(message.email)}&gt;</p>
      <p style="margin:0 0 16px"><strong>${escapeHtml(t.type)}:</strong> ${escapeHtml(tipo)}</p>
      <div style="white-space:pre-wrap;line-height:1.6;padding:16px;background:#f9fafb;border-radius:8px">${escapeHtml(message.mensaje)}</div>
      <p style="margin:16px 0 0;font-size:13px;color:#6b7280">${escapeHtml(t.reply)}${
        panelUrl ? ` · <a href="${escapeHtml(panelUrl)}" style="color:#0f766e">${escapeHtml(t.panel)}</a>` : ""
      }</p>
    </div>
  </body>
</html>`;

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: message.email,
    subject: t.subject(tipo, message.nombre),
    text,
    html,
  });
  return error ? { sent: false, reason: `${error.name}: ${error.message}` } : { sent: true };
}
