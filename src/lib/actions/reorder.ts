import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type OrderedTable = "projects" | "services" | "testimonials" | "timeline_items" | "skills";
export type MoveDirection = "up" | "down";

type ScopeFilter = { column: string; value: string };

/**
 * Mueve un elemento una posición y renumera `orden` 1..n dentro del grupo
 * (p. ej. habilidades de una misma área). Renumerar corrige empates como
 * varios elementos con orden 0. Devuelve false si ya estaba en el extremo.
 */
export async function moveItem(
  supabase: SupabaseClient<Database>,
  table: OrderedTable,
  id: string,
  direction: MoveDirection,
  scope?: ScopeFilter,
): Promise<{ moved: boolean; error: string | null }> {
  let query = supabase.from(table).select("id, orden").order("orden").order("id");
  if (scope) query = query.eq(scope.column, scope.value);

  const { data, error } = await query;
  if (error) return { moved: false, error: error.message };

  const ids = data.map((row) => row.id);
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= ids.length) {
    return { moved: false, error: null };
  }

  [ids[index], ids[target]] = [ids[target], ids[index]];

  const current = new Map(data.map((row) => [row.id, row.orden]));
  const updates = ids
    .map((rowId, position) => ({ id: rowId, orden: position + 1 }))
    .filter((row) => current.get(row.id) !== row.orden);

  const results = await Promise.all(
    updates.map((row) => supabase.from(table).update({ orden: row.orden }).eq("id", row.id)),
  );
  const failed = results.find((result) => result.error);
  return { moved: true, error: failed?.error?.message ?? null };
}

/** Siguiente valor de `orden` para un elemento nuevo (al final). */
export async function nextOrder(
  supabase: SupabaseClient<Database>,
  table: OrderedTable,
): Promise<number> {
  const { data } = await supabase
    .from(table)
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.orden ?? 0) + 1;
}
