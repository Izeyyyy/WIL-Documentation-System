import { test, mock } from "node:test";
import assert from "node:assert/strict";

const rpcResult = { data: null, error: { message: "boom" } };
const deletedDriveFiles: string[] = [];

const fakeSupabase = {
  from: (table: string) => ({
    select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { code: "X" }, error: null }) }) }) }),
    insert: async () => ({ error: null }),
    delete: () => ({
      eq: async (_column: string, value: string) => {
        if (table === "drive_files") deletedDriveFiles.push(value);
        return { error: null };
      },
    }),
  }),
  rpc: async () => rpcResult,
};

mock.module("@/lib/supabase/server", { namedExports: { createClient: async () => fakeSupabase } });
mock.module("@/lib/services/authorization-service", { namedExports: { requireRole: async () => ({ id: "staff-1" }) } });

const { registerDocument } = await import("@/lib/services/document-registration.service");
const { POST } = await import("@/app/api/documents/register/route");

const input = {
  driveFileId: "drive-1", name: "a.pdf", mimeType: "application/pdf", sizeBytes: 10,
  webViewLink: "https://drive.google.com/file/d/drive-1/view", title: "A",
  categoryCode: "CAT", purposeCode: "PUR", year: 2026,
};

test("Drive row is removed when code generation fails", async () => {
  const errorLog = mock.method(console, "error", () => {});
  await assert.rejects(registerDocument(input, "staff-1"), { statusCode: 500 });
  errorLog.mock.restore();
  assert.deepEqual(deletedDriveFiles, ["drive-1"]);
});

function post(webViewLink: string) {
  return POST(new Request("https://app.test/api/documents/register", {
    method: "POST",
    body: JSON.stringify({ ...input, webViewLink }),
  }));
}

test("webViewLink must be an https Google Drive/Docs URL", async () => {
  for (const bad of [
    "javascript:alert(1)",
    "http://drive.google.com/file/d/x",
    "https://evil.com/drive.google.com",
    "https://drive.google.com.evil.com/x",
  ]) {
    assert.equal((await post(bad)).status, 400, bad);
  }
  // A valid link passes validation (it then fails later at the mocked code generator, not with 400).
  const errorLog = mock.method(console, "error", () => {});
  assert.notEqual((await post("https://docs.google.com/document/d/x/edit")).status, 400);
  errorLog.mock.restore();
});
