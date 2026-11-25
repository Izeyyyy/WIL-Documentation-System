import { createClient } from "@/lib/supabase/server";

export async function createRepositoryClient() {
  return await createClient();
}