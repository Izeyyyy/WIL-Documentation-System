import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/services/authorization-service";
import { getReferencePurposes } from "@/lib/services/reference-codes.service";
import { ApiError } from "@/lib/utils/api-error";

const querySchema = z.object({
  categoryCode: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    await requireRole(["admin", "staff", "viewer"]);

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      // *Id names kept for existing callers; the values are codes.
      categoryCode: searchParams.get("categoryCode") ?? searchParams.get("categoryId") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid categoryCode query parameter." },
        { status: 400 }
      );
    }

    const data = await getReferencePurposes(parsed.data.categoryCode);
    return NextResponse.json({ data, error: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected reference purposes API error:", error);
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
