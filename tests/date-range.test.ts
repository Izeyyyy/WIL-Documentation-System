import { test } from "node:test";
import assert from "node:assert/strict";
import { toTimestampRange } from "@/lib/utils/date-range";

test("date-only bounds cover the whole day, datetimes pass through", () => {
  assert.deepEqual(toTimestampRange("2026-11-01", "2026-11-30"), {
    from: "2026-11-01T00:00:00.000Z",
    to: "2026-11-30T23:59:59.999Z",
  });
  assert.deepEqual(toTimestampRange("2026-11-01T08:00:00+08:00", "2026-11-30T17:00:00Z"), {
    from: "2026-11-01T08:00:00+08:00",
    to: "2026-11-30T17:00:00Z",
  });
  assert.deepEqual(toTimestampRange(undefined, undefined), { from: undefined, to: undefined });
});
