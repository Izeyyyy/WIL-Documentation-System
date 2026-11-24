
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { getDocuments } from "@/lib/repositories/document-repository";
import { requireRole } from "@/lib/services/authorization-service";

export async function GET(request: Request) {
  try {
    await requireRole(["admin", "staff", "viewer"]);

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = 25;

    if (!Number.isInteger(page) || page < 1) {
      return errorResponse("Invalid Page Number", 400);
    }

    const result = await getDocuments(page, pageSize);

    return successResponse(
      result,
      "Documents retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
