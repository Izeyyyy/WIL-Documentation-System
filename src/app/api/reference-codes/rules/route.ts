import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/services/authorization-service";
import { getReferenceRules } from "@/lib/services/reference-codes.service";
import { ApiError } from "@/lib/utils/api-error";

const querySchema = z.object({
  categoryCode: z.string().trim().min(1).optional(),
  purposeCode: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    await requireRole(["admin", "staff", "viewer"]);

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      // *Id names kept for existing callers; the values are codes.
      categoryCode: searchParams.get("categoryCode") ?? searchParams.get("categoryId") ?? undefined,
      purposeCode: searchParams.get("purposeCode") ?? searchParams.get("purposeId") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid categoryCode or purposeCode query parameter." },
        { status: 400 }
      );
    }

    const data = await getReferenceRules({
      categoryCode: parsed.data.categoryCode,
      purposeCode: parsed.data.purposeCode,
    });
    return NextResponse.json({ data, error: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected reference rules API error:", error);
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
