import { type NextRequest, NextResponse } from "next/server";

import { getSafeNextPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createRouteClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/auth/erro?codigo=configuracao", requestUrl.origin),
    );
  }

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/erro?codigo=retorno", requestUrl.origin),
    );
  }

  const { applyAuthCookies, supabase } = createRouteClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase OAuth callback failed:", error.message);
    return applyAuthCookies(
      NextResponse.redirect(
        new URL("/auth/erro?codigo=sessao", requestUrl.origin),
      ),
    );
  }

  return applyAuthCookies(
    NextResponse.redirect(new URL(next, requestUrl.origin)),
  );
}
