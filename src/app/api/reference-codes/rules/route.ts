import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/services/auth-service";
import { getReferenceRules } from "@/lib/services/reference-codes.service";
import { ApiError } from "@/lib/utils/api-error";

const querySchema = z.object({
  categoryId: z.string().trim().min(1).optional(),
  purposeId: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
  try {
    await getAuthenticatedUser();

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      categoryId: searchParams.get("categoryId") ?? undefined,
      purposeId: searchParams.get("purposeId") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid categoryId or purposeId query parameter." },
        { status: 400 }
      );
    }

    const data = await getReferenceRules({
      categoryCode: parsed.data.categoryId,
      purposeCode: parsed.data.purposeId,
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
