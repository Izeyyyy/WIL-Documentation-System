import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/utils/api-error";
import type { Database } from "@/types/database.types";

type TableName = keyof Database["public"]["Tables"];

export async function createRepositoryClient() {
  return await createClient();
}

/** Orders as [column, ascending]; the last one should be a unique tie-breaker. */
export async function getPage<T>(
  table: TableName,
  columns: string,
  orders: [string, boolean][],
  page: number,
  pageSize: number,
  errorMessage: string
) {
  const supabase = await createRepositoryClient();
  const from = (page - 1) * pageSize;

  let query = supabase.from(table).select(columns, { count: "exact" });
  for (const [column, ascending] of orders) {
    query = query.order(column, { ascending });
  }

  const result = await query.range(from, from + pageSize - 1);
  let { data, error, count } = result;

  // PostgREST answers 416 when the page starts past the last row: return no rows, keep the real total.
  if (error && (result.status === 416 || error.code === "PGRST103")) {
    ({ error, count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true }));
    data = [];
  }

  if (error) {
    console.error(`${errorMessage}:`, error);
    throw new ApiError(errorMessage, 500);
  }

  const totalCount = count ?? 0;

  return {
    rows: (data ?? []) as T[],
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}
