import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { CacheTag } from "@/lib/queries/tags";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cliente anónimo sin cookies para lecturas públicas. No toca la sesión,
 * así que las páginas públicas pueden ser estáticas/ISR. RLS limita lo
 * que ve a los registros publicados.
 *
 * `tags` etiqueta las respuestas en la caché de datos de Next para poder
 * invalidarlas desde el backoffice (ver lib/revalidate.ts).
 */
export function createPublicClient(tags: readonly CacheTag[]) {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { tags: [...tags] } }),
    },
  });
}

/** Cliente anónimo sin caché para escrituras públicas (p. ej. el formulario de contacto). */
export function createAnonWriteClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
