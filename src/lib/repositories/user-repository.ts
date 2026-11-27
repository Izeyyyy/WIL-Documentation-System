
import { createRepositoryClient, getPage } from "./base-repository";
import { ApiError } from "@/lib/utils/api-error";
import type { UserProfile } from "@/types/user";
import type { UserRole } from "@/types/database-enums";

const USER_COLUMNS = "id, email, full_name, role, is_active, last_login_at, created_at";

export async function getUsers(
  page: number = 1,
  pageSize: number = 25
) {
  const { rows, pagination } = await getPage<UserProfile>(
    "profiles",
    USER_COLUMNS,
    [["created_at", false], ["id", true]],
    page,
    pageSize,
    "Failed to retrieve users."
  );

  return { users: rows, pagination };
}

export async function getUserById(
  id: string
): Promise<UserProfile | null> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(USER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("User profile retrieval failed:", error);

    throw new ApiError(
      "Failed to retrieve user profile.",
      500
    );
  }

  return data as UserProfile | null;
}

export type UpdateUserData = {
  role?: UserRole;
  is_active?: boolean;
};

/** Returns null when no profile has this id. */
export async function updateUser(
  id: string,
  updates: UpdateUserData
): Promise<UserProfile | null> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select(USER_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error("User profile update failed:", error);

    throw new ApiError(
      "Failed to update user profile.",
      500
    );
  }

  return data as UserProfile | null;
}
