
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";
import { requireRole } from "@/lib/services/authorization-service";
import { getUserById, updateUser } from "@/lib/repositories/user-repository";
import { logAuditEvent } from "@/lib/services/audit-log-service";
import { isUuid } from "@/lib/utils/is-uuid";
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

    if (!isUuid(id)) {
      throw new ApiError("Invalid user ID.", 400);
    }

    if (currentUser.id === id) {
      throw new ApiError(
        "You cannot change your own role or account status.",
        403
      );
    }

    const body = await request.json().catch(() => null);

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new ApiError("Request body must be a JSON object.", 400);
    }

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

    // No last-admin check needed: the caller is an active admin and cannot edit themselves,
    // so one active admin always remains. Concurrent mutual demotion needs a DB trigger.
    const existingUser = await getUserById(id);
    const updatedUser = existingUser && (await updateUser(id, updates));

    if (!existingUser || !updatedUser) {
      throw new ApiError("User not found.", 404);
    }

    // Best-effort: the change is already saved, so a logging failure must not fail the request.
    try {
      await logAuditEvent({
        action: "user.update",
        entity_type: "profile",
        entity_id: id,
        old_values: Object.fromEntries(
          Object.keys(updates).map((key) => [key, existingUser[key as keyof typeof updates]])
        ),
        new_values: updates,
      });
    } catch (auditError) {
      console.error("Audit logging failed for user update:", auditError);
    }

    return successResponse(
      updatedUser,
      "User updated successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
