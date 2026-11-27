
import { requireActiveProfile } from "@/lib/services/authorization-service";
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";

export async function GET() {
  try {
    const { profile } = await requireActiveProfile(["admin", "staff", "viewer"]);

    return successResponse(
      profile,
      "Current user retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
