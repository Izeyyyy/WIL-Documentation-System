
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/services/auth-service";
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { ApiError } from "@/lib/utils/api-error";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      throw new ApiError("User profile not found.", 404);
    }

    if (!profile.is_active) {
      throw new ApiError("Your account is inactive.", 403);
    }

    return successResponse(
      {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_active: profile.is_active,
      },
      "Current user retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
