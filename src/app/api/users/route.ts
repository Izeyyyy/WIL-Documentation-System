
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { requireRole } from "@/lib/services/authorization-service";
import { createRepositoryClient } from "@/lib/repositories/base-repository";
import type { UserProfile } from "@/types/user";
import { ApiError } from "@/lib/utils/api-error";

export async function GET() {
  try {
    await requireRole(["admin"]);

    const supabase = await createRepositoryClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new ApiError("Failed to retrieve users.", 500);
    }

    return successResponse(
      data as UserProfile[],
      "Users retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
