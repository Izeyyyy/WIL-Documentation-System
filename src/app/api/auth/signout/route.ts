import { createClient } from "@/lib/supabase/server";
import { successResponse } from "@/lib/utils/api-response";
import { handleApiError } from "@/lib/utils/handle-api-error";

// POST only, so another site cannot sign users out with a plain link or image.
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return successResponse(null, "Signed out.");
  } catch (error) {
    return handleApiError(error);
  }
}
