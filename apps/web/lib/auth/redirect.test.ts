import assert from "node:assert/strict";
import test from "node:test";

import { getSafeNextPath } from "./redirect.ts";

test("aceita somente redirecionamentos internos", () => {
  assert.equal(getSafeNextPath("/onboarding"), "/onboarding");
  assert.equal(getSafeNextPath("/app/inicio?origem=login"), "/app/inicio?origem=login");
  assert.equal(getSafeNextPath("https://example.com"), "/onboarding");
  assert.equal(getSafeNextPath("//example.com"), "/onboarding");
  assert.equal(getSafeNextPath("/\\example.com"), "/onboarding");
  assert.equal(getSafeNextPath(null), "/onboarding");
});
