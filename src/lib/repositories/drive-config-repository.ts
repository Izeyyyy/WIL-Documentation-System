
import { createRepositoryClient } from "./base-repository";
import { ApiError } from "@/lib/utils/api-error";
import type { DriveConfig } from "@/types/drive-config";

export type CreateDriveConfigData = Pick<
  DriveConfig,
  | "shared_drive_id"
  | "shared_drive_name"
  | "auth_mode"
  | "configured_by"
>;

export type UpdateDriveConfigData = Partial<
  Pick<
    DriveConfig,
    | "shared_drive_id"
    | "shared_drive_name"
    | "auth_mode"
    | "poll_interval_minutes"
    | "start_page_token"
    | "last_synced_at"
  >
>;

export async function getDriveConfig(): Promise<DriveConfig | null> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("drive_config")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Drive configuration retrieval failed:", error);

    throw new ApiError(
      "Failed to retrieve drive configuration.",
      500
    );
  }

  return data as DriveConfig | null;
}

export async function createDriveConfig(
  configData: CreateDriveConfigData
): Promise<DriveConfig> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("drive_config")
    .insert(configData)
    .select("*")
    .single();

  if (error || !data) {
  console.error("Drive configuration creation failed:", error);

  if (error?.code === "23505") {
    throw new ApiError(
      "Drive configuration already exists.",
      409
    );
  }

  throw new ApiError(
    "Failed to create drive configuration.",
    500
  );
}

  return data as DriveConfig;
}

export async function updateDriveConfig(
  configData: UpdateDriveConfigData
): Promise<DriveConfig> {
  const supabase = await createRepositoryClient();

  const { data, error } = await supabase
    .from("drive_config")
    .update(configData)
    .eq("id", 1)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Drive configuration update failed:", error);

    throw new ApiError(
      "Failed to update drive configuration.",
      500
    );
  }

  return data as DriveConfig;
}
