import {
  getDriveConfig,
  createDriveConfig,
  updateDriveConfig,
} from "@/lib/repositories/drive-config-repository";
import { ApiError } from "@/lib/utils/api-error";
import { logAudit } from "@/lib/services/audit.service";

import type {
  CreateDriveConfigData,
  UpdateDriveConfigData,
} from "@/lib/repositories/drive-config-repository";

export async function fetchDriveConfig() {
  return await getDriveConfig();
}

export async function configureDrive(
  configData: Omit<CreateDriveConfigData, "configured_by">,
  actorId: string
) {
  const existingConfig = await getDriveConfig();

  if (existingConfig) {
    throw new ApiError(
        "Drive configuration already exists.",
        409
    );
}

  const config = await createDriveConfig({
    ...configData,
    configured_by: actorId,
  });

  await logAudit({
    actorId,
    action: "DRIVE_CONFIG_CREATED",
    entityType: "drive_config",
    entityId: String(config.id),
    newValues: config,
  });

  return config;
}

export async function modifyDriveConfig(
  configData: UpdateDriveConfigData,
  actorId: string
) {
  const existingConfig = await getDriveConfig();

  if (!existingConfig) {
    throw new ApiError(
      "Drive configuration has not been created yet.",
      404
    );
  }

  const updates: UpdateDriveConfigData = { ...configData };

  // A different Drive invalidates the old Drive's change token and sync time.
  if (
    updates.shared_drive_id !== undefined &&
    updates.shared_drive_id !== existingConfig.shared_drive_id
  ) {
    updates.start_page_token = null;
    updates.last_synced_at = null;
  }

  const config = await updateDriveConfig(updates);

  await logAudit({
    actorId,
    action: "DRIVE_CONFIG_UPDATED",
    entityType: "drive_config",
    entityId: String(config.id),
    oldValues: existingConfig,
    newValues: config,
  });

  return config;
}