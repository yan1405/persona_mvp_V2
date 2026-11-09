import { type NextRequest, NextResponse } from "next/server";

import { isQaPasswordLoginEnabled } from "@/lib/auth/qa-login-gate";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createRouteClient } from "@/lib/supabase/server";

// Somente QA local (ver qa-login-gate.ts). Nunca registrar e-mail, senha ou token.
export async function POST(request: NextRequest) {
  if (!isQaPasswordLoginEnabled(process.env, request.headers.get("host"))) {
    return new NextResponse(null, { status: 404 });
  }

  const { origin } = new URL(request.url);
  const fail = () => NextResponse.redirect(new URL("/entrar?erro=qa", origin), 303);

  const form = await request.formData().catch(() => null);
  const email = form?.get("email");
  const password = form?.get("password");
  if (
    typeof email !== "string" || email.length < 3 || email.length > 254 || !email.includes("@") ||
    typeof password !== "string" || password.length < 1 || password.length > 200 ||
    !isSupabaseConfigured()
  ) {
    return fail();
  }

  const { applyAuthCookies, supabase } = createRouteClient(request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail();

  const next = getSafeNextPath(String(form?.get("next") ?? ""), "/app");
  return applyAuthCookies(NextResponse.redirect(new URL(next, origin), 303));
}
