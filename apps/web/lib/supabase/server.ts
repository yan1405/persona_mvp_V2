import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";

import { getSupabaseConfig } from "./config";

export async function createClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; proxy.ts refreshes them.
        }
      },
    },
  });
}

export function createRouteClient(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();
  let pendingCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];
  let pendingHeaders: Record<string, string> = {};

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        pendingCookies = cookiesToSet;
        pendingHeaders = headers;
      },
    },
  });

  function applyAuthCookies(response: NextResponse) {
    pendingCookies.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
    );
    Object.entries(pendingHeaders).forEach(([name, value]) =>
      response.headers.set(name, value),
    );
    return response;
  }

  return { applyAuthCookies, supabase };
}
