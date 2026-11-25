import { NextResponse } from "next/server";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@/types/api-response";

export function successResponse<T>(
  data: T,
  message: string = "Request completed successfully.",
  status: number = 200
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(
  message: string,
  status: number = 500
) {
  const response: ApiErrorResponse = {
    success: false,
    message,
  };

  return NextResponse.json(response, { status });
}