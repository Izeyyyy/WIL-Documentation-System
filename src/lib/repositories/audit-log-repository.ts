
import { createRepositoryClient, getPage } from "./base-repository";
import { ApiError } from "@/lib/utils/api-error";
import type {
  AuditLog,
  CreateAuditLogData,
} from "@/types/audit-log";

export async function createAuditLog(
  auditData: CreateAuditLogData
): Promise<AuditLog> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .insert(auditData)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Audit log creation failed:", error);

    throw new ApiError(
      "Failed to create audit log.",
      500
    );
  }

  return data as AuditLog;
}


export async function getAuditLogs(
  page: number = 1,
  pageSize: number = 20
) {
  const { rows, pagination } = await getPage<AuditLog>(
    "audit_logs",
    "*",
    [["created_at", false], ["id", false]],
    page,
    pageSize,
    "Failed to retrieve audit logs."
  );

  return { auditLogs: rows, pagination };
}
