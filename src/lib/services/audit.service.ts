import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/utils/api-error";
import type { Json } from "../../../types/database.types";
import type { AuditAction, AuditLog } from "@/types/audit";

export type LogAuditInput = {
  actorId: string | null;
  action: AuditAction;
  entityType: string | null;
  entityId: string | null;
  oldValues?: Json | null;
  newValues?: Json | null;
};

export type AuditLogFilters = {
  actorId?: string;
  action?: string;
  entityType?: string;
  from?: string;
  to?: string;
};

export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: input.actorId,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      old_values: input.oldValues ?? null,
      new_values: input.newValues ?? null,
    });

    if (error) {
      console.error("Failed to write audit log:", error);
    }
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

export async function getAuditLogs(
  page: number,
  pageSize: number,
  filters: AuditLogFilters
): Promise<{
  logs: AuditLog[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}> {
  const supabase = await createClient();
  const fromIndex = (page - 1) * pageSize;
  let query = supabase
    .from("audit_logs")
    .select(
      "id,actor_id,action,entity_type,entity_id,old_values,new_values,created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(fromIndex, fromIndex + pageSize - 1);

  if (filters.actorId) {
    query = query.eq("actor_id", filters.actorId);
  }
  if (filters.action) {
    query = query.eq("action", filters.action);
  }
  if (filters.entityType) {
    query = query.eq("entity_type", filters.entityType);
  }
  if (filters.from) {
    query = query.gte("created_at", filters.from);
  }
  if (filters.to) {
    query = query.lte("created_at", filters.to);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError("Failed to retrieve audit logs.", 500);
  }

  const totalCount = count ?? 0;
  return {
    logs: data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
