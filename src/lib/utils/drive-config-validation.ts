import { z } from "zod";

export const createDriveConfigSchema = z.strictObject({
  shared_drive_id: z.string().trim().min(1, "Shared Drive ID is required."),
  shared_drive_name: z.string().trim().min(1, "Shared Drive name is required."),
  auth_mode: z.enum(["oauth", "service_account"]),
});

export const updateDriveConfigSchema = z.strictObject({
  shared_drive_id: z.string().trim().min(1).optional(),
  shared_drive_name: z.string().trim().min(1).optional(),
  auth_mode: z.enum(["oauth", "service_account"]).optional(),
  poll_interval_minutes: z.number().int().min(5).max(1440).optional(), // 5 min to 1 day
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one configuration field must be provided."
);