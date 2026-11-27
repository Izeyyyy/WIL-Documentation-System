import { test, mock } from "node:test";
import assert from "node:assert/strict";

type Profile = { role: string; is_active: boolean } | null;
let user: { id: string } | null = { id: "u1" };
let profileResult: { data: Profile; error: unknown } = { data: null, error: null };

mock.module("@/lib/supabase/server", {
  namedExports: {
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user }, error: null }) },
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => profileResult }) }) }),
    }),
  },
});

const { requireRole } = await import("@/lib/services/authorization-service");

async function statusOf(roles: ("admin" | "staff" | "viewer")[]) {
  try {
    await requireRole(roles);
    return 200;
  } catch (error) {
    return (error as { statusCode: number }).statusCode;
  }
}

test("requireRole", async (t) => {
  await t.test("not logged in -> 401", async () => {
    user = null;
    assert.equal(await statusOf(["admin"]), 401);
    user = { id: "u1" };
  });
  await t.test("no profile -> 403", async () => {
    profileResult = { data: null, error: null };
    assert.equal(await statusOf(["admin"]), 403);
  });
  await t.test("profile query fails -> 500", async () => {
    profileResult = { data: null, error: { message: "down" } };
    const errorLog = mock.method(console, "error", () => {});
    assert.equal(await statusOf(["admin"]), 500);
    errorLog.mock.restore();
  });
  await t.test("inactive account -> 403", async () => {
    profileResult = { data: { role: "admin", is_active: false }, error: null };
    assert.equal(await statusOf(["admin"]), 403);
  });
  await t.test("wrong role -> 403", async () => {
    profileResult = { data: { role: "viewer", is_active: true }, error: null };
    assert.equal(await statusOf(["admin"]), 403);
  });
  await t.test("allowed role -> user", async () => {
    profileResult = { data: { role: "staff", is_active: true }, error: null };
    assert.deepEqual(await requireRole(["admin", "staff"]), { id: "u1" });
  });
});
