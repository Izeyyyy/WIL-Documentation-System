
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { requireRole } from "@/lib/services/authorization-service";
import { getUsers } from "@/lib/repositories/user-repository";

export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = 25;

    if (!Number.isInteger(page) || page < 1) {
      return errorResponse("Invalid Page Number", 400);
    }

    const result = await getUsers(page, pageSize);

    return successResponse(
      result,
      "Users retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
