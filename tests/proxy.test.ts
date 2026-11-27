import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

const noCache = { "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0", Expires: "0", Pragma: "no-cache" };

mock.module("@supabase/ssr", {
  namedExports: {
    createServerClient: (_url: string, _key: string, { cookies }: { cookies: { setAll: (cookies: object[], headers: Record<string, string>) => void } }) => ({
      auth: {
        getClaims: async () => cookies.setAll([{ name: "sb-token", value: "abc", options: {} }], noCache),
      },
    }),
  },
});

const { updateSession } = await import("@/lib/supabase/proxy");

test("updateSession copies Supabase no-cache headers onto the response", async () => {
  const response = await updateSession(new NextRequest("https://example.test/"));
  for (const [key, value] of Object.entries(noCache)) assert.equal(response.headers.get(key), value);
  assert.equal(response.cookies.get("sb-token")?.value, "abc");
});
