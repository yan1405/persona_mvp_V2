import assert from "node:assert/strict";
import test from "node:test";

import { isDsGalleryEnabled } from "./gate.ts";

test("liga em desenvolvimento e quando NODE_ENV não está definido", () => {
  assert.equal(isDsGalleryEnabled({ NODE_ENV: "development" }), true);
  assert.equal(isDsGalleryEnabled({ NODE_ENV: "test" }), true);
  assert.equal(isDsGalleryEnabled({}), true);
});

test("qualquer sinal de produção ou de Vercel desliga", () => {
  assert.equal(isDsGalleryEnabled({ NODE_ENV: "production" }), false);
  assert.equal(isDsGalleryEnabled({ NODE_ENV: "development", VERCEL: "1" }), false);
  assert.equal(isDsGalleryEnabled({ NODE_ENV: "development", VERCEL_ENV: "preview" }), false);
  assert.equal(isDsGalleryEnabled({ VERCEL_ENV: "production" }), false);
});
