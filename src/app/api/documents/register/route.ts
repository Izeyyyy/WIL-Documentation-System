import { NextResponse } from "next/server";
import { z } from "zod";
import { registerDocument } from "@/lib/services/document-registration.service";
import { requireRole } from "@/lib/services/authorization-service";
import { ApiError } from "@/lib/utils/api-error";

// TODO: driveFileId, name, mimeType and sizeBytes are trusted from the client. Fetch them
// server-side from Google Drive (by driveFileId) once the Drive client exists.
const requestSchema = z.object({
  driveFileId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  mimeType: z.string().trim().min(1),
  sizeBytes: z.number().int().nonnegative(),
  // Stored and rendered as a link, so only https Google Drive / Docs URLs (no javascript: etc).
  webViewLink: z.url({ protocol: /^https$/, hostname: /^(drive|docs)\.google\.com$/ }),
  title: z.string().trim().min(1),
  categoryCode: z.string().trim().min(1),
  purposeCode: z.string().trim().min(1),
  year: z.number().int().min(1).max(9999),
  officeCode: z.string().trim().min(1).optional(),
});

export async function POST(request: Request) {
  try {
    const user = await requireRole(["staff", "admin"]);
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { data: null, error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid document registration details." },
        { status: 400 }
      );
    }

    const data = await registerDocument(parsed.data, user.id);
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected document registration API error:", error);
    return NextResponse.json(
      { data: null, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
