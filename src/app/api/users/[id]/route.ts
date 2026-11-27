
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { requireRole } from "@/lib/services/authorization-service";
import { updateUser } from "@/lib/repositories/user-repository";
import { ApiError } from "@/lib/utils/api-error";
import type { UserRole } from "@/types/database-enums";

const VALID_ROLES: UserRole[] = ["admin", "staff", "viewer"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireRole(["admin"]);
    const { id } = await params;

    if (currentUser.id === id) {
      throw new ApiError(
        "You cannot change your own role or account status.",
        403
      );
    }

    const body = await request.json();

    const updates: {
      role?: UserRole;
      is_active?: boolean;
    } = {};

    if ("role" in body) {
      if (!VALID_ROLES.includes(body.role)) {
        throw new ApiError("Invalid user role.", 400);
      }

      updates.role = body.role;
    }

    if ("is_active" in body) {
      if (typeof body.is_active !== "boolean") {
        throw new ApiError("Invalid account status.", 400);
      }

      updates.is_active = body.is_active;
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError("No valid updates provided.", 400);
    }

    const updatedUser = await updateUser(id, updates);

    return successResponse(
      updatedUser,
      "User updated successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
