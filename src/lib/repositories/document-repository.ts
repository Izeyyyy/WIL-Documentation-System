
import { createRepositoryClient, getPage } from "./base-repository";
import type { Document } from "@/types/document";
import { ApiError } from "@/lib/utils/api-error";

export async function getDocuments(
  page: number = 1,
  pageSize: number = 25
) {
  const { rows, pagination } = await getPage<Document>(
    "documents",
    "*",
    [["registered_at", false], ["id", true]],
    page,
    pageSize,
    "Failed to retrieve documents."
  );

  return { documents: rows, pagination };
}

export async function getDocumentById(
  id: string
): Promise<Document | null> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Document retrieval failed:", error);

    throw new ApiError(
        "Failed to retrieve document.",
        500
    );
  }

  return data as Document | null;
}
