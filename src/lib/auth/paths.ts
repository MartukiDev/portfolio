export const ADMIN_HOME = "/admin";
export const LOGIN_PATH = "/admin/login";

const ORIGIN = "http://local";

/**
 * Valida el destino post-login: solo rutas internas del panel, para que
 * `?next=` no sirva como redirección abierta. Se valida la ruta ya
 * normalizada (sin `..`, `//` ni barras invertidas).
 */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/")) return null;

  let url: URL;
  try {
    url = new URL(next, ORIGIN);
  } catch {
    return null;
  }

  if (url.origin !== ORIGIN) return null;
  const { pathname, search } = url;
  const inPanel = pathname === ADMIN_HOME || pathname.startsWith(`${ADMIN_HOME}/`);
  if (!inPanel || pathname === LOGIN_PATH) return null;

  return pathname + search;
}
