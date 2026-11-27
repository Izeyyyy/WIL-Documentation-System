import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Starts Google sign-in. Supabase stores the PKCE verifier in a cookie on this response.
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${request.nextUrl.origin}/auth/callback` },
  });

  if (error || !data.url) {
    console.error("Google sign-in start failed:", error);
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }

  return NextResponse.redirect(data.url);
}
