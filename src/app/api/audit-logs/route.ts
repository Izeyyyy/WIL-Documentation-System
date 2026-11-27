
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/services/authorization-service";
import { getAuditLogs } from "@/lib/repositories/audit-log-repository";
import { handleApiError } from "@/lib/utils/handle-api-error";

export async function GET(request: Request) {
  try {
    await requireRole(["admin", "staff", "viewer"]);

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("pageSize")) || 20
      )
    );

    const result = await getAuditLogs(page, pageSize);

    return NextResponse.json({
      success: true,
      data: result.auditLogs,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
