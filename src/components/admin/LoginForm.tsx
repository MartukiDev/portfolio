"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { admin } from "@/content/es/admin";
import { signIn, type SignInState } from "@/lib/actions/auth";

type LoginFormProps = {
  next?: string;
  initialError?: string;
};

export function LoginForm({ next, initialError }: LoginFormProps) {
  const t = admin.login;
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, {
    error: initialError,
  });

  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder={t.emailPlaceholder}
          defaultValue={state.email}
          required
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <p id="email-error" className="text-sm text-red-300">
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "password-error" : undefined}
        />
        {passwordError && (
          <p id="password-error" className="text-sm text-red-300">
            {passwordError}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
