import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuditLogs } from "@/lib/services/audit.service";
import { requireRole } from "@/lib/services/authorization-service";
import { ApiError } from "@/lib/utils/api-error";

const dateSchema = z.union([
  z.iso.date(),
  z.iso.datetime({ offset: true }),
]);

const querySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(25),
    actorId: z.uuid().optional(),
    action: z.string().trim().min(1).max(100).optional(),
    entityType: z.string().trim().min(1).max(100).optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  })
  .refine(
    ({ from, to }) => !from || !to || new Date(from) <= new Date(to),
    { message: "from must be earlier than or equal to to." }
  );

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      actorId: searchParams.get("actorId") ?? undefined,
      action: searchParams.get("action") ?? undefined,
      entityType: searchParams.get("entityType") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid audit log query parameters." },
        { status: 400 }
      );
    }

    const { page, pageSize, from, to, ...filters } = parsed.data;
    const data = await getAuditLogs(page, pageSize, {
      ...filters,
      from: from
        ? isDateOnly(from)
          ? `${from}T00:00:00.000Z`
          : from
        : undefined,
      to: to
        ? isDateOnly(to)
          ? `${to}T23:59:59.999Z`
          : to
        : undefined,
    });

    return NextResponse.json({ data, error: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected audit logs API error:", error);
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
