import { getAuthenticatedUser } from "@/lib/services/auth-service";
import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/utils/api-error";
import type { UserRole } from "@/types/database-enums";

export async function requireRole(
  allowedRoles: UserRole[]
) {
  const user = await getAuthenticatedUser();

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
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

  return user;
}