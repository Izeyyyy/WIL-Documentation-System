
import { createRepositoryClient } from "./base-repository";
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
  const supabase = await createRepositoryClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Audit log retrieval failed:", error);

    throw new ApiError(
      "Failed to retrieve audit logs.",
      500
    );
  }

  const totalCount = count ?? 0;

  return {
    auditLogs: (data ?? []) as AuditLog[],
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
