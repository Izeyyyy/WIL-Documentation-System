
import { getAuthenticatedUser } from "@/lib/services/auth-service";
import { createAuditLog } from "@/lib/repositories/audit-log-repository";
import type { CreateAuditLogData } from "@/types/audit-log";

export async function logAuditEvent(
  auditData: Omit<CreateAuditLogData, "actor_id">
) {
  const user = await getAuthenticatedUser();

  return await createAuditLog({
    ...auditData,
    actor_id: user.id,
  });
}
