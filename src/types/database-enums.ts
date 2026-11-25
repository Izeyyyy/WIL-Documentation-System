export type UserRole =
  | "admin"
  | "staff"
  | "viewer";

export type RecordStatus =
  | "complete"
  | "incomplete"
  | "archived";

export type RegistrationStatus =
  | "unregistered"
  | "registered"
  | "ignored";

export type SyncTrigger =
  | "manual"
  | "scheduled"
  | "webhook";

export type AuthMode =
  | "oauth"
  | "service_account";

export type MatchTarget =
  | "filename"
  | "folder_path"
  | "ocr_text";

export type FieldSource =
  | "user_input"
  | "document"
  | "ocr"
  | "system";