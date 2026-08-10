import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig, isSupabaseConfigured } from "./config";

function isPrivatePath(pathname: string) {
  return pathname === "/onboarding" || pathname.startsWith("/app");
}

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    if (isPrivatePath(request.nextUrl.pathname)) {
      return NextResponse.redirect(
        new URL("/auth/erro?codigo=configuracao", request.url),
      );
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  if (isPrivatePath(request.nextUrl.pathname) && !data?.claims) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  return response;
}
