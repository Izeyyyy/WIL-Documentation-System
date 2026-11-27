import { createClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/utils/api-error";
import type {
  CategoryReferenceCode,
  ClassificationRuleReference,
  PurposeReferenceCode,
} from "@/types/reference-codes";

export async function getReferenceCategories(): Promise<CategoryReferenceCode[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("code,name,description,is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new ApiError("Failed to retrieve reference categories.", 500);
  }

  return data;
}

export async function getReferencePurposes(
  categoryCode?: string
): Promise<PurposeReferenceCode[]> {
  const supabase = await createClient();

  if (categoryCode) {
    const { data: rules, error: rulesError } = await supabase
      .from("classification_rules")
      .select("purpose_code")
      .eq("is_active", true)
      .eq("category_code", categoryCode)
      .not("purpose_code", "is", null);

    if (rulesError) {
      throw new ApiError("Failed to retrieve reference purposes.", 500);
    }

    const purposeCodes = [
      ...new Set(
        rules
          .map((rule) => rule.purpose_code)
          .filter((code): code is string => code !== null)
      ),
    ];

    if (purposeCodes.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("purposes")
      .select("code,name,description,is_active")
      .eq("is_active", true)
      .in("code", purposeCodes)
      .order("name", { ascending: true });

    if (error) {
      throw new ApiError("Failed to retrieve reference purposes.", 500);
    }

    return data;
  }

  const { data, error } = await supabase
    .from("purposes")
    .select("code,name,description,is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new ApiError("Failed to retrieve reference purposes.", 500);
  }

  return data;
}

export async function getReferenceRules(filters: {
  categoryCode?: string;
  purposeCode?: string;
}): Promise<ClassificationRuleReference[]> {
  const supabase = await createClient();
  let query = supabase
    .from("classification_rules")
    .select("id,category_code,purpose_code,match_on,pattern,priority,is_active")
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .order("id", { ascending: true });

  if (filters.categoryCode) {
    query = query.eq("category_code", filters.categoryCode);
  }

  if (filters.purposeCode) {
    query = query.eq("purpose_code", filters.purposeCode);
  }

  const { data, error } = await query;

  if (error) {
    throw new ApiError("Failed to retrieve reference rules.", 500);
  }

  return data;
}
