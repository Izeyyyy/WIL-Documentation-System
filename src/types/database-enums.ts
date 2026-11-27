import type { Database } from "@/types/database.types";

// Derived from the generated Supabase types so they cannot drift from the database.
type DbEnums = Database["public"]["Enums"];

export type UserRole = DbEnums["user_role"];
export type RecordStatus = DbEnums["record_status"];
export type RegistrationStatus = DbEnums["reg_status"];
export type CodeStatus = DbEnums["code_status"];
export type SyncTrigger = DbEnums["sync_trigger"];
export type AuthMode = DbEnums["auth_mode"];
export type MatchTarget = DbEnums["match_target"];
export type FieldSource = DbEnums["field_source"];
