import { NextResponse } from "next/server";
import { requireRole } from "@/lib/services/authorization-service";
import { fetchDriveConfig, configureDrive, modifyDriveConfig,} from "@/lib/services/drive-config-service";
import { handleApiError } from "@/lib/utils/handle-api-error";
import {
  createDriveConfigSchema,
  updateDriveConfigSchema,
} from "@/lib/utils/drive-config-validation";

import { ApiError } from "@/lib/utils/api-error";

async function parseRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(
      "Request body must contain valid JSON.",
      400
    );
  }
}

export async function GET() {
  try {
    await requireRole(["admin"]);

    const config = await fetchDriveConfig();

    return NextResponse.json({
      data: config,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(["admin"]);

    const body = await parseRequestBody(request);

    const validation = createDriveConfigSchema.safeParse(body);

    if (!validation.success) {
      throw new ApiError(
        validation.error.issues
          .map((issue) => issue.message)
          .join(" "),
        400
      );
    }

    const config = await configureDrive(validation.data);

    return NextResponse.json(
      { data: config },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireRole(["admin"]);

    const body = await parseRequestBody(request);

    const validation = updateDriveConfigSchema.safeParse(body);

    if (!validation.success) {
      throw new ApiError(
        validation.error.issues
          .map((issue) => issue.message)
          .join(" "),
        400
      );
    }

    const config = await modifyDriveConfig(validation.data);

    return NextResponse.json({
      data: config,
    });
  } catch (error) {
    return handleApiError(error);
  }
}