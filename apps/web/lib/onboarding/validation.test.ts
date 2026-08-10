import assert from "node:assert/strict";
import test from "node:test";

import { validateOnboarding } from "./validation.ts";

function validFormData() {
  const formData = new FormData();
  formData.set("displayName", "Yan Silva");
  formData.set("professionalMoment", "inicio-carreira");
  formData.set("mainObjective", "Organizar experiências para entrevistas.");
  formData.set("productConsent", "on");
  formData.set("dailyLogContent", "Conduzi uma revisão técnica e documentei as decisões do projeto.");
  return formData;
}

test("accepts a complete onboarding without an optional reminder", () => {
  const result = validateOnboarding(validFormData());

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.reminderEnabled, false);
    assert.equal(result.data.reminderTime, null);
  }
});

test("requires consent and a sufficiently detailed first Daily Log", () => {
  const formData = validFormData();
  formData.delete("productConsent");
  formData.set("dailyLogContent", "Texto curto");

  const result = validateOnboarding(formData);

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.fieldErrors.productConsent, /necessário/);
    assert.match(result.fieldErrors.dailyLogContent, /40/);
  }
});

test("requires a valid time only when the reminder is enabled", () => {
  const formData = validFormData();
  formData.set("reminderEnabled", "on");
  formData.set("reminderTime", "25:90");

  const result = validateOnboarding(formData);

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.fieldErrors.reminderTime, /horário válido/);
  }
});
