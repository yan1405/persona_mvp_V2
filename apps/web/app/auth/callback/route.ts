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

  const reauth = requestUrl.searchParams.get("reauth");
  if (reauth === "delete_account") {
    const nonce = requestUrl.searchParams.get("nonce");
    const storedNonce = request.cookies.get("persona_reauth_nonce")?.value;
    const destination = new URL(next, requestUrl.origin);

    if (!nonce || !storedNonce || nonce !== storedNonce) {
      destination.searchParams.set("notice", "reauth_failed");
    } else {
      const { error: authorizationError } = await supabase.rpc(
        "authorize_sensitive_action",
        { p_purpose: "delete_account" },
      );
      destination.searchParams.set(
        "notice",
        authorizationError ? "reauth_failed" : "reauthenticated",
      );
    }

    const response = applyAuthCookies(NextResponse.redirect(destination));
    response.cookies.set("persona_reauth_nonce", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/auth/callback",
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
    });
    return response;
  }

  return applyAuthCookies(NextResponse.redirect(new URL(next, requestUrl.origin)));
}
