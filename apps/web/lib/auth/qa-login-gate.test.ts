import assert from "node:assert/strict";
import test from "node:test";

import { isQaPasswordLoginEnabled } from "./qa-login-gate.ts";

const on = { PERSONA_QA_PASSWORD_LOGIN: "1", NODE_ENV: "development" };

test("liga só com todas as condições", () => {
  assert.equal(isQaPasswordLoginEnabled(on, "localhost:3100"), true);
  assert.equal(isQaPasswordLoginEnabled(on, "localhost"), true);
  assert.equal(isQaPasswordLoginEnabled({ ...on, NODE_ENV: undefined }, "127.0.0.1:3100"), true);
  assert.equal(isQaPasswordLoginEnabled(on, "[::1]:3100"), true);
});

test("cada condição isolada desliga", () => {
  assert.equal(isQaPasswordLoginEnabled({ ...on, PERSONA_QA_PASSWORD_LOGIN: undefined }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled({ ...on, PERSONA_QA_PASSWORD_LOGIN: "true" }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled({ ...on, PERSONA_QA_PASSWORD_LOGIN: "0" }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled({ ...on, NODE_ENV: "production" }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled({ ...on, VERCEL: "1" }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled({ ...on, VERCEL_ENV: "preview" }, "localhost"), false);
  assert.equal(isQaPasswordLoginEnabled(on, null), false);
  assert.equal(isQaPasswordLoginEnabled(on, undefined), false);
});

test("host precisa ser exatamente local", () => {
  for (const host of ["example.com", "localhost.evil.com", "evil-localhost", "localhost:abc", "localhost:3100/x", "127.0.0.2", "0.0.0.0", "[::2]", "::1", "localhost@evil.com", "LOCALHOST", " localhost", "", "persona.vercel.app"]) {
    assert.equal(isQaPasswordLoginEnabled(on, host), false, host);
  }
});
