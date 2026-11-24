import type { RecordStatus } from "./database-enums";

export type Document = {
  id: string;
  document_code: string | null;
  drive_file_id: string;
  office_code: string | null;
  category_code: string | null;
  purpose_code: string | null;
  sequence_no: number | null;
  title: string | null;
  description: string | null;
  document_date: string | null;
  record_status: RecordStatus;
  missing_fields: string[];
  registered_by: string;
  registered_at: string;
  updated_at: string;
};