
import type { AuthMode } from "./database-enums";

export type DriveConfig = {
  id: number;
  shared_drive_id: string | null;
  shared_drive_name: string | null;
  auth_mode: AuthMode | null;
  start_page_token: string | null;
  poll_interval_minutes: number;
  last_synced_at: string | null;
  status: string | null;
  configured_by: string | null;
};
