import { test, mock } from "node:test";
import assert from "node:assert/strict";

const existing = { id: 1, shared_drive_id: "old", start_page_token: "tok", last_synced_at: "2026-01-01" };
const updateCalls: Record<string, unknown>[] = [];
const auditCalls: Record<string, unknown>[] = [];

mock.module("@/lib/repositories/drive-config-repository", {
  namedExports: {
    getDriveConfig: async () => existing,
    createDriveConfig: async () => existing,
    updateDriveConfig: async (updates: Record<string, unknown>) => {
      updateCalls.push(updates);
      return { ...existing, ...updates };
    },
  },
});
mock.module("@/lib/services/audit.service", {
  namedExports: { logAudit: async (input: Record<string, unknown>) => void auditCalls.push(input) },
});

const { modifyDriveConfig } = await import("@/lib/services/drive-config-service");
const { updateDriveConfigSchema } = await import("@/lib/utils/drive-config-validation");

test("poll interval is bounded to 5..1440 minutes", () => {
  for (const ok of [5, 60, 1440]) assert.ok(updateDriveConfigSchema.safeParse({ poll_interval_minutes: ok }).success);
  for (const bad of [0, 4, 1441, 10_000_000, 7.5]) assert.ok(!updateDriveConfigSchema.safeParse({ poll_interval_minutes: bad }).success);
});

test("changing the shared drive resets sync state and is audited", async () => {
  await modifyDriveConfig({ shared_drive_id: "new" }, "admin-1");
  assert.deepEqual(updateCalls.at(-1), { shared_drive_id: "new", start_page_token: null, last_synced_at: null });
  assert.equal(auditCalls.at(-1)?.action, "DRIVE_CONFIG_UPDATED");
  assert.equal(auditCalls.at(-1)?.actorId, "admin-1");
});

test("other updates keep sync state", async () => {
  await modifyDriveConfig({ shared_drive_name: "Renamed", shared_drive_id: "old" }, "admin-1");
  assert.deepEqual(updateCalls.at(-1), { shared_drive_name: "Renamed", shared_drive_id: "old" });
});
