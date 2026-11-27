import type { Database } from "../../types/database.types";

export type AuditAction =
  | "DOCUMENT_REGISTERED"
  | "DOCUMENT_UPDATED"
  | "DOCUMENT_VIEWED"
  | "TEMPLATE_CREATED"
  | "TEMPLATE_UPDATED"
  | "TEMPLATE_DELETED";

export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
