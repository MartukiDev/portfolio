"use client";

import { useState } from "react";

/** Estado del diálogo de edición: cerrado, creando (con valores iniciales) o editando una fila. */
export type EditorState<T, Defaults = Partial<T>> =
  | { mode: "closed" }
  | { mode: "create"; defaults: Defaults }
  | { mode: "edit"; item: T };

export function useEntityEditor<T, Defaults = Partial<T>>() {
  const [state, setState] = useState<EditorState<T, Defaults>>({ mode: "closed" });
  return {
    state,
    open: state.mode !== "closed",
    create: (defaults: Defaults) => setState({ mode: "create", defaults }),
    edit: (item: T) => setState({ mode: "edit", item }),
    close: () => setState({ mode: "closed" }),
  };
}
