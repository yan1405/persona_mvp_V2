import { type NextRequest, NextResponse } from "next/server";

import { getSafeNextPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createRouteClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));
  const reauth =
    requestUrl.searchParams.get("reauth") === "delete_account"
      ? "delete_account"
      : null;
  const reauthNonce = reauth ? crypto.randomUUID() : null;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/auth/erro?codigo=configuracao", origin),
    );
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);
  if (reauth && reauthNonce) {
    callbackUrl.searchParams.set("reauth", reauth);
    callbackUrl.searchParams.set("nonce", reauthNonce);
  }

  const { applyAuthCookies, supabase } = createRouteClient(request);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      scopes: "email",
      redirectTo: callbackUrl.toString(),
      queryParams: reauth ? { prompt: "login" } : undefined,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/auth/erro?codigo=provedor", origin));
  }

  const response = applyAuthCookies(NextResponse.redirect(data.url));
  if (reauthNonce) {
    response.cookies.set("persona_reauth_nonce", reauthNonce, {
      httpOnly: true,
      maxAge: 600,
      path: "/auth/callback",
      sameSite: "lax",
      secure: requestUrl.protocol === "https:",
    });
  }
  return response;
}
