import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_HOME, LOGIN_PATH, safeNextPath } from "@/lib/auth/paths";
import type { Database } from "@/lib/supabase/database.types";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Protege /admin/*: refresca la sesión y verifica que el usuario sea admin.
 * Es la primera barrera; requireAdmin() y RLS vuelven a verificar.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  let cacheHeaders: Record<string, string> = {};

  const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        cacheHeaders = { ...cacheHeaders, ...headers };
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  /** Redirección que conserva las cookies de sesión escritas en `response`. */
  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    for (const [key, value] of Object.entries(cacheHeaders)) {
      redirect.headers.set(key, value);
    }
    return redirect;
  };

  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === LOGIN_PATH;

  const { data } = await supabase.auth.getClaims();
  const hasSession = Boolean(data?.claims.sub);

  if (!hasSession) {
    if (isLogin) return response;
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("next", pathname + search);
    return redirectTo(url);
  }

  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || !isAdmin) {
    await supabase.auth.signOut({ scope: "local" });
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set("error", "no-autorizado");
    return redirectTo(url);
  }

  if (isLogin) {
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    return redirectTo(new URL(next ?? ADMIN_HOME, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
