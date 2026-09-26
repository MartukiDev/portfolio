import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cliente anónimo sin cookies para lecturas públicas. No toca la sesión,
 * así que las páginas públicas pueden ser estáticas/ISR. RLS limita lo
 * que ve a los registros publicados.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
