import assert from "node:assert/strict";
import test from "node:test";

import { QA_LOGIN_DESTINATION, qaRedirectOrigin } from "./origin.ts";

test("a origem segue o Host da requisição, não o localhost da URL interna", () => {
  assert.equal(qaRedirectOrigin("http://localhost:3000/auth/qa-entrar", "127.0.0.1:3100"), "http://127.0.0.1:3100");
  assert.equal(qaRedirectOrigin("http://localhost:3000/auth/qa-entrar", "localhost:3199"), "http://localhost:3199");
  assert.equal(qaRedirectOrigin("http://localhost:3000/auth/qa-entrar", "[::1]:3000"), "http://[::1]:3000");
});

test("sem Host usa o host da URL, e o protocolo vem da requisição", () => {
  assert.equal(qaRedirectOrigin("http://localhost:3000/x", null), "http://localhost:3000");
  assert.equal(qaRedirectOrigin("https://localhost:3000/x", "localhost:3000"), "https://localhost:3000");
});

test("o destino do login de QA é /onboarding", () => {
  assert.equal(QA_LOGIN_DESTINATION, "/onboarding");
  assert.equal(new URL(QA_LOGIN_DESTINATION, qaRedirectOrigin("http://localhost:3000/x", "127.0.0.1:3100")).href, "http://127.0.0.1:3100/onboarding");
});
