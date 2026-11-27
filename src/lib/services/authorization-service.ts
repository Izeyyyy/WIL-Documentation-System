import { getAuthenticatedUser } from "@/lib/services/auth-service";
import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/utils/api-error";
import type { UserRole } from "@/types/database-enums";
import type { UserProfile } from "@/types/user";

export async function requireRole(
  allowedRoles: UserRole[]
) {
  return (await requireActiveProfile(allowedRoles)).user;
}

/** Same checks as requireRole, but also returns the caller's profile row. */
export async function requireActiveProfile(
  allowedRoles: UserRole[]
) {
  const user = await getAuthenticatedUser();

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Profile lookup failed:", error);

    throw new ApiError(
      "Failed to verify user permissions.",
      500
    );
  }

  if (!profile) {
    throw new ApiError(
      "User profile not found.",
      403
    );
  }

  if (!profile.is_active) {
    throw new ApiError(
      "Your account is inactive.",
      403
    );
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new ApiError(
      "You do not have permission to perform this action.",
      403
    );
  }

  return {
    user,
    profile: profile as Pick<UserProfile, "id" | "email" | "full_name" | "role" | "is_active">,
  };
}
