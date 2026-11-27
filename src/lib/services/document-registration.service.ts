import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/services/audit.service";
import { ApiError } from "@/lib/utils/api-error";
import type { Database } from "../../../types/database.types";

type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DriveFileInsert = Database["public"]["Tables"]["drive_files"]["Insert"];
type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];

export type RegisterDocumentInput = {
  driveFileId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  webViewLink: string;
  title: string;
  categoryCode: string;
  purposeCode: string;
  year: number;
  officeCode?: string;
};

async function removeDriveFile(
  driveFileId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<void> {
  try {
    const { error } = await supabase
      .from("drive_files")
      .delete()
      .eq("drive_file_id", driveFileId);

    if (error) {
      console.error("Failed to clean up Drive file after registration failure:", error);
    }
  } catch (error) {
    console.error("Failed to clean up Drive file after registration failure:", error);
  }
}

export async function registerDocument(
  input: RegisterDocumentInput,
  actorId: string
): Promise<DocumentRecord> {
  const supabase = await createClient();

  const [categoryResult, purposeResult] = await Promise.all([
    supabase
      .from("categories")
      .select("code")
      .eq("code", input.categoryCode)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("purposes")
      .select("code")
      .eq("code", input.purposeCode)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (categoryResult.error || purposeResult.error) {
    throw new ApiError("Failed to validate document category and purpose.", 500);
  }

  if (!categoryResult.data || !purposeResult.data) {
    throw new ApiError("Category or purpose is missing or inactive.", 400);
  }

  const driveFile: DriveFileInsert = {
    drive_file_id: input.driveFileId,
    name: input.name,
    mime_type: input.mimeType,
    size_bytes: input.sizeBytes,
    web_view_link: input.webViewLink,
    registration_status: "registered",
  };
  const { error: driveInsertError } = await supabase
    .from("drive_files")
    .insert(driveFile);

  if (driveInsertError) {
    if (driveInsertError.code === "23505") {
      throw new ApiError("This Drive file is already registered.", 409);
    }

    console.error("Failed to insert Drive file during document registration:", driveInsertError);
    throw new ApiError("Failed to register Drive file.", 500);
  }

  try {
    const rpcArguments = {
      p_category: input.categoryCode,
      p_purpose: input.purposeCode,
      p_year: input.year,
      ...(input.officeCode ? { p_office: input.officeCode } : {}),
    };
    const { data: generatedCodes, error: codeError } = await supabase.rpc(
      "generate_document_code",
      rpcArguments
    );

    if (codeError || !generatedCodes?.[0]) {
      if (codeError) {
        console.error("Failed to generate document code:", codeError);
      }
      throw new ApiError("Failed to generate document code.", 500);
    }

    const generatedCode = generatedCodes[0];
    const document: DocumentInsert = {
      drive_file_id: input.driveFileId,
      title: input.title,
      category_code: input.categoryCode,
      purpose_code: input.purposeCode,
      doc_year: input.year,
      office_code: input.officeCode ?? null,
      document_code: generatedCode.code,
      sequence_no: generatedCode.seq,
      code_status: "confirmed",
      registered_by: actorId,
    };
    const { data, error: documentInsertError } = await supabase
      .from("documents")
      .insert(document)
      .select("*")
      .single();

    if (documentInsertError || !data) {
      if (documentInsertError) {
        console.error("Failed to insert document record:", documentInsertError);
      }
      throw new ApiError("Failed to register document.", 500);
    }

    await logAudit({
      actorId,
      action: "DOCUMENT_REGISTERED",
      entityType: "document",
      entityId: data.id,
      newValues: data,
    });

    return data;
  } catch (error) {
    await removeDriveFile(input.driveFileId, supabase);
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Unexpected document registration service error:", error);
    throw new ApiError("Failed to register document.", 500);
  }
}
