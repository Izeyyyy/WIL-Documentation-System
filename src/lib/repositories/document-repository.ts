
import { createRepositoryClient } from "./base-repository";
import type { Document } from "@/types/document";
import { ApiError } from "@/lib/utils/api-error";

export async function getDocuments(
  page: number = 1,
  pageSize: number = 25
) {
  const supabase = await createRepositoryClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("documents")
    .select("*", { count: "exact" })
    .order("registered_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new ApiError(
      "Failed to retrieve documents.",
      500
    );
  }

  const totalCount = count ?? 0;

  return {
    documents: data as Document[],
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
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
    throw new ApiError(
        "Failed to retrieve documents.",
        500
    );
  }

  return data as Document | null;
}
