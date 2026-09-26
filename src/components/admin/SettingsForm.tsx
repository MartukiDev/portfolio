"use client";

import type { JSONContent } from "@tiptap/react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { adminForms } from "@/content/es/admin-forms";
import { adminSettings } from "@/content/es/admin-settings";
import { updateSettings } from "@/lib/actions/settings";
import type { FormState } from "@/lib/actions/result";
import type { Tables } from "@/lib/supabase/database.types";
import type { SettingsField } from "@/lib/validations/settings";
import { fieldA11y, FormField } from "./FormField";
import { FormActions, FormSection } from "./FormSection";
import { RichTextEditor } from "./RichTextEditor";
import { submitWithoutReset } from "./submit";
import { useToast } from "./Toaster";

type SettingsFormProps = {
  settings: Tables<"site_settings"> | null;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const t = adminSettings;
  const f = t.fields;
  const notify = useToast();

  const [state, formAction, pending] = useActionState<FormState<SettingsField>, FormData>(
    async (prev, formData) => {
      const result = await updateSettings(prev, formData);
      notify(result);
      return result;
    },
    null,
  );

  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const field = (name: SettingsField, hasHint = false) => ({
    name,
    ...fieldA11y(name, errors?.[name], hasHint),
  });

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="flex flex-col gap-6" noValidate>
      <FormSection title={t.sections.hero}>
        <FormField id="nombre" label={f.nombre} errors={errors?.nombre}>
          <Input {...field("nombre")} defaultValue={settings?.nombre ?? ""} required maxLength={120} />
        </FormField>
        <FormField id="tagline" label={f.tagline} hint={f.taglineHint} errors={errors?.tagline} optional>
          <Input {...field("tagline", true)} defaultValue={settings?.tagline ?? ""} maxLength={120} />
        </FormField>
        <FormField id="hero_descripcion" label={f.hero_descripcion} errors={errors?.hero_descripcion} optional>
          <Textarea
            {...field("hero_descripcion")}
            defaultValue={settings?.hero_descripcion ?? ""}
            rows={3}
            maxLength={500}
          />
        </FormField>
      </FormSection>

      <FormSection title={t.sections.bio}>
        <FormField id="bio" label={f.bio} errors={errors?.bio} optional>
          <RichTextEditor
            {...fieldA11y("bio", errors?.bio)}
            name="bio"
            defaultValue={(settings?.bio as JSONContent | null) ?? null}
          />
        </FormField>
      </FormSection>

      <FormSection title={t.sections.availability}>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm">{f.disponible_freelance}</span>
          <Switch name="disponible_freelance" defaultChecked={settings?.disponible_freelance ?? true} />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm">{f.disponible_practica}</span>
          <Switch name="disponible_practica" defaultChecked={settings?.disponible_practica ?? true} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="practica_desde" label={f.practica_desde} errors={errors?.practica_desde} optional>
            <Input {...field("practica_desde")} type="date" defaultValue={settings?.practica_desde ?? ""} />
          </FormField>
          <FormField id="practica_duracion" label={f.practica_duracion} errors={errors?.practica_duracion} optional>
            <Input
              {...field("practica_duracion")}
              defaultValue={settings?.practica_duracion ?? ""}
              placeholder={f.practica_duracionPlaceholder}
              maxLength={60}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={t.sections.contact}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="email" label={f.email} hint={f.emailHint} errors={errors?.email} optional>
            <Input {...field("email", true)} type="email" defaultValue={settings?.email ?? ""} autoComplete="email" />
          </FormField>
          <FormField id="whatsapp" label={f.whatsapp} hint={f.whatsappHint} errors={errors?.whatsapp} optional>
            <Input
              {...field("whatsapp", true)}
              type="tel"
              inputMode="numeric"
              defaultValue={settings?.whatsapp ?? ""}
            />
          </FormField>
          <FormField id="github_url" label={f.github_url} errors={errors?.github_url} optional>
            <Input {...field("github_url")} type="url" defaultValue={settings?.github_url ?? ""} />
          </FormField>
          <FormField id="linkedin_url" label={f.linkedin_url} errors={errors?.linkedin_url} optional>
            <Input {...field("linkedin_url")} type="url" defaultValue={settings?.linkedin_url ?? ""} />
          </FormField>
        </div>
      </FormSection>

      <FormActions>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? adminForms.saving : adminForms.save}
        </Button>
      </FormActions>
    </form>
  );
}
