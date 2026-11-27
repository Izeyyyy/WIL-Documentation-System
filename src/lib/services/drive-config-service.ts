import {
  getDriveConfig,
  createDriveConfig,
  updateDriveConfig,
} from "@/lib/repositories/drive-config-repository";
import { ApiError } from "@/lib/utils/api-error";
import { getAuthenticatedUser } from "@/lib/services/auth-service";

import type {
  CreateDriveConfigData,
  UpdateDriveConfigData,
} from "@/lib/repositories/drive-config-repository";

export async function fetchDriveConfig() {
  return await getDriveConfig();
}

export async function configureDrive(
  configData: Omit<CreateDriveConfigData, "configured_by">
) {
  const user = await getAuthenticatedUser();

  const existingConfig = await getDriveConfig();

  if (existingConfig) {
    throw new ApiError(
        "Drive configuration already exists.",
        409
    );
}

  return await createDriveConfig({
    ...configData,
    configured_by: user.id,
  });
}

export async function modifyDriveConfig(
  configData: UpdateDriveConfigData
) {
  const existingConfig = await getDriveConfig();

  if (!existingConfig) {
    throw new ApiError(
      "Drive configuration has not been created yet.",
      404
    );
  }

  return await updateDriveConfig(configData);
}