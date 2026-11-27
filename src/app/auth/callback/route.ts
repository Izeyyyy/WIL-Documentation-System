import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google sends the user back here. Only users with an active profile row may stay signed in.
export async function GET(request: NextRequest) {
  const fail = (code: string) =>
    NextResponse.redirect(new URL(`/?error=${code}`, request.url));

  const code = request.nextUrl.searchParams.get("code");
  if (!code) return fail("oauth_failed");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    console.error("Google sign-in callback failed:", error);
    return fail("oauth_failed");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) {
    if (profileError) console.error("Profile lookup after sign-in failed:", profileError);
    await supabase.auth.signOut();
    return fail(profileError ? "oauth_failed" : profile ? "inactive" : "not_registered");
  }

  // Best-effort: a failed timestamp update must not block sign-in.
  const { error: loginError } = await supabase
    .from("profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", data.user.id);
  if (loginError) console.error("last_login_at update failed:", loginError);

  return NextResponse.redirect(new URL("/", request.url));
}
