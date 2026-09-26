"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { contactContent } from "@/content/es/contact";
import { sendContactMessage } from "@/lib/actions/contact";
import type { FormState } from "@/lib/actions/result";
import { whatsappUrl } from "@/lib/contact";
import { parseTipo, TIPOS_CONSULTA, type ContactField, type TipoConsulta } from "@/lib/validations/contact";
import { WhatsAppIcon } from "./BrandIcons";

const t = contactContent;

type ContactFormProps = {
  whatsapp: string | null;
  firstName: string;
};

/** Lee ?tipo= de la URL (la página es estática; esto corre en el cliente). */
export function ContactFormWithParams(props: ContactFormProps) {
  const tipo = parseTipo(useSearchParams().get("tipo"));
  // key: si cambia el tipo en la URL, el formulario parte de nuevo con esa preselección.
  return <ContactForm key={tipo ?? "none"} {...props} initialTipo={tipo} />;
}

type FormProps = ContactFormProps & { initialTipo: TipoConsulta | null };

/** "Enviar otro mensaje" vuelve a montar el formulario: estado de envío y tiempo parten de cero. */
export function ContactForm(props: FormProps) {
  const [formKey, setFormKey] = useState(0);
  return <ContactFormInner key={formKey} {...props} onReset={() => setFormKey((key) => key + 1)} />;
}

function ContactFormInner({ whatsapp, firstName, initialTipo, onReset }: FormProps & { onReset: () => void }) {
  const [tipo, setTipo] = useState<TipoConsulta>(initialTipo ?? "freelance");
  const mountedAt = useRef<number | null>(null);
  const [state, formAction, pending] = useActionState<FormState<ContactField>, FormData>(sendContactMessage, null);

  // Momento en que el formulario quedó listo: el servidor rechaza envíos de menos de 3 s.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("cargado_en", String(mountedAt.current ?? Date.now()));
    startTransition(() => formAction(formData));
  };

  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const a11y = (field: ContactField) =>
    errors?.[field]?.length
      ? ({ "aria-invalid": true, "aria-describedby": `${field}-error` } as const)
      : ({} as const);
  const fieldError = (field: ContactField) =>
    errors?.[field]?.[0] ? (
      <p id={`${field}-error`} className="text-sm text-red-300">
        {errors[field]?.[0]}
      </p>
    ) : null;

  const whatsappLink = whatsapp ? whatsappUrl(whatsapp, t.whatsappMessage[tipo](firstName)) : null;

  if (state?.ok) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <CircleCheck aria-hidden="true" className="size-10 text-success" />
        <h2 className="heading-3">{t.success.title}</h2>
        <p className="text-muted">{t.success.body}</p>
        <Button variant="secondary" onClick={onReset}>
          {t.success.again}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {state && !state.ok && (
        <p role="alert" className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      {/* Honeypot: invisible para personas y lectores de pantalla; los bots suelen rellenarlo. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="sitio_web">{t.form.honeypot}</label>
        <input id="sitio_web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nombre">{t.form.nombre}</Label>
          <Input id="nombre" name="nombre" autoComplete="name" placeholder={t.form.nombrePlaceholder} required maxLength={120} {...a11y("nombre")} />
          {fieldError("nombre")}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t.form.email}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder={t.form.emailPlaceholder} required {...a11y("email")} />
          {fieldError("email")}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tipo">{t.form.tipo}</Label>
        <Select id="tipo" name="tipo" value={tipo} onChange={(event) => setTipo(parseTipo(event.target.value) ?? "otro")} {...a11y("tipo")}>
          {TIPOS_CONSULTA.map((option) => (
            <option key={option} value={option}>
              {t.tipos[option]}
            </option>
          ))}
        </Select>
        {fieldError("tipo")}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="mensaje">{t.form.mensaje}</Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          placeholder={t.form.mensajePlaceholder[tipo]}
          {...a11y("mensaje")}
        />
        {fieldError("mensaje")}
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
          {pending ? t.form.submitting : t.form.submit}
        </Button>
        {whatsappLink && (
          <Button href={whatsappLink} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" />
            {t.aside.whatsapp}
          </Button>
        )}
      </div>
      <p className="text-xs text-muted">{t.form.privacy}</p>
    </form>
  );
}
