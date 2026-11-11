import { type NextRequest, NextResponse } from "next/server";

import { isQaPasswordLoginEnabled } from "@/lib/auth/qa-login-gate";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createRouteClient } from "@/lib/supabase/server";

import { QA_LOGIN_DESTINATION, qaRedirectOrigin } from "./origin";

// Nunca registrar e-mail, senha ou token.
export async function POST(request: NextRequest) {
  if (!isQaPasswordLoginEnabled(process.env, request.headers.get("host"))) {
    return new NextResponse(null, { status: 404 });
  }

  const preview = process.env.VERCEL_ENV === "preview";
  const origin = preview
    ? `https://${process.env.VERCEL_URL}`
    : qaRedirectOrigin(request.url, request.headers.get("host"));
  if (preview && request.headers.get("origin") !== origin) {
    return new NextResponse(null, { status: 403 });
  }
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

  if (preview && email.trim().toLowerCase() !== process.env.PERSONA_QA_PREVIEW_EMAIL?.trim().toLowerCase()) {
    return fail();
  }

  const { applyAuthCookies, supabase } = createRouteClient(request);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail();

  return applyAuthCookies(NextResponse.redirect(new URL(QA_LOGIN_DESTINATION, origin), 303));
}
