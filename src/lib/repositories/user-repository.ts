
import { createRepositoryClient } from "./base-repository";
import { ApiError } from "@/lib/utils/api-error";
import type { UserProfile } from "@/types/user";
import type { UserRole } from "@/types/database-enums";

export async function getUserById(
  id: string
): Promise<UserProfile | null> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
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

export async function updateUser(
  id: string,
  updates: UpdateUserData
): Promise<UserProfile> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new ApiError(
      "Failed to update user profile.",
      500
    );
  }

  return data as UserProfile;
}
