import { NextResponse } from "next/server";
import { requireRole } from "@/lib/services/authorization-service";
import { getReferenceCategories } from "@/lib/services/reference-codes.service";
import { ApiError } from "@/lib/utils/api-error";

export async function GET() {
  try {
    await requireRole(["admin", "staff", "viewer"]);
    const data = await getReferenceCategories();

    return NextResponse.json({ data, error: null });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected reference categories API error:", error);
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
