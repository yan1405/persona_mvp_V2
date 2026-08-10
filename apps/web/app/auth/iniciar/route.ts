import { type NextRequest, NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createRouteClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/auth/erro?codigo=configuracao", origin),
    );
  }

  const { applyAuthCookies, supabase } = createRouteClient(request);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      scopes: "email",
      redirectTo: `${origin}/auth/callback?next=/onboarding`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/auth/erro?codigo=provedor", origin));
  }

  return applyAuthCookies(NextResponse.redirect(data.url));
}
