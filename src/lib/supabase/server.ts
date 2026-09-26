import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cliente con la sesión del usuario (cookies). Para server components del
 * backoffice, server actions y route handlers. Usar cookies() vuelve dinámica
 * la ruta: para páginas públicas usar `createPublicClient`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Llamado desde un server component: no puede escribir cookies.
          // El refresco de sesión lo hace proxy.ts.
        }
      },
    },
  });
}
