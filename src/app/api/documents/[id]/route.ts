import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { getDocumentById } from "@/lib/repositories/document-repository";
import { requireRole } from "@/lib/services/authorization-service";
import { ApiError } from "@/lib/utils/api-error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin", "staff", "viewer"]);

    const { id } = await params;

    const document = await getDocumentById(id);

    if (!document) {
      throw new ApiError("Document not found.", 404);
    }

    return successResponse(
      document,
      "Document retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}