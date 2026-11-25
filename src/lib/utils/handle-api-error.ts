import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  console.error("Unexpected API error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "An unexpected error occurred.",
    },
    { status: 500 }
  );
}