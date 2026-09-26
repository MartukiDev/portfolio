"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { admin } from "@/content/es/admin";
import { ADMIN_HOME, LOGIN_PATH, safeNextPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validations/auth";

export type SignInState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
  email?: string;
};

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      fieldErrors: { email: fieldErrors.email, password: fieldErrors.password },
      email: typeof formData.get("email") === "string" ? String(formData.get("email")) : "",
    };
  }

  const { email, password, next } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: admin.login.errors.invalidCredentials, email };
  }

  // Un usuario válido que no es admin ve el mismo error genérico.
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut({ scope: "local" });
    return { error: admin.login.errors.invalidCredentials, email };
  }

  redirect(safeNextPath(next) ?? ADMIN_HOME);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect(LOGIN_PATH);
}
