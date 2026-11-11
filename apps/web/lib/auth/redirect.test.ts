import assert from "node:assert/strict";
import test from "node:test";

import { getSafeNextPath } from "./redirect.ts";

const FALLBACK = "/onboarding";
const ORIGIN = "https://persona.test";

test("aceita somente redirecionamentos internos", () => {
  assert.equal(getSafeNextPath("/onboarding"), "/onboarding");
  assert.equal(getSafeNextPath("/app/inicio?origem=login"), "/app/inicio?origem=login");
  assert.equal(getSafeNextPath("https://example.com"), FALLBACK);
  assert.equal(getSafeNextPath("//example.com"), FALLBACK);
  assert.equal(getSafeNextPath("/\\example.com"), FALLBACK);
  assert.equal(getSafeNextPath(null), FALLBACK);
});

test("aceita caminhos internos validos", () => {
  for (const ok of [
    "/",
    "/app/inicio?x=1",
    "/onboarding",
    "/app/configuracoes/dados#apagar",
    "/a%20b",
  ]) {
    assert.equal(getSafeNextPath(ok), ok);
  }
});

test("rejeita caracteres de controle que o URL parser remove (QL7-2)", () => {
  for (const bad of [
    "/\t/evil.example.com",
    "/\n/evil.example.com",
    "/\r/evil.example.com",
    "/\0/evil.example.com",
    "/\u001f/evil.example.com",
    "/\u007f/evil.example.com",
    "/app\n",
  ]) {
    assert.equal(getSafeNextPath(bad), FALLBACK, JSON.stringify(bad));
  }
});

test("rejeita variantes codificadas, barra invertida, // e espaco inicial", () => {
  for (const bad of [
    "/%09/evil.example.com",
    "/%0a/evil.example.com",
    "/%0A/evil.example.com",
    "/%0d/evil.example.com",
    "/%00/evil.example.com",
    "/%5c/evil.example.com",
    "/%5C/evil.example.com",
    "//evil.example.com",
    "\\evil.example.com",
    "/\\evil.example.com",
    " /app",
    " //evil.example.com",
    "app/inicio",
    "",
    "javascript:alert(1)",
  ]) {
    assert.equal(getSafeNextPath(bad), FALLBACK, JSON.stringify(bad));
  }
});

test("usa o fallback informado", () => {
  assert.equal(getSafeNextPath("/\t/x.test", "/app"), "/app");
});

test("todo valor aceito mantem a origem ao resolver", () => {
  for (const v of ["/", "/app/inicio?x=1", "/onboarding", "/a%20b"]) {
    assert.equal(new URL(getSafeNextPath(v), ORIGIN).origin, ORIGIN);
  }
});
