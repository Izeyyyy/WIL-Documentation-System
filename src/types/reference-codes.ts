import type { Database } from "@/types/database.types";

export type CategoryReferenceCode =
  Database["public"]["Tables"]["categories"]["Row"];

export type PurposeReferenceCode =
  Database["public"]["Tables"]["purposes"]["Row"];

export type ClassificationRuleReference =
  Database["public"]["Tables"]["classification_rules"]["Row"];
