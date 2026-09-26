import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "./paths";

/**
 * Verifica sesión y rol de administrador. Usar al inicio de cada página del
 * panel y de cada server action. Sin sesión o sin permisos redirige al login.
 * Se memoriza por request: layout y página comparten una sola verificación.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) {
    redirect(LOGIN_PATH);
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    // El proxy cierra la sesión de un no-admin al llegar al login.
    redirect(`${LOGIN_PATH}?error=no-autorizado`);
  }

  return {
    supabase,
    user: { id: userId, email: data.claims.email ?? null },
  };
});
