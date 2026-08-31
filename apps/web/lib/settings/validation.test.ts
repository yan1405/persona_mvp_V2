import assert from "node:assert/strict";
import test from "node:test";

import { validateSettingsProfile } from "./validation.ts";

function validFormData() {
  const formData = new FormData();
  formData.set("displayName", "Yan Silva");
  formData.set("professionalMoment", "inicio-carreira");
  formData.set("mainObjective", "Organizar experiências para entrevistas.");
  return formData;
}

test("accepts valid settings without optional preferences", () => {
  const result = validateSettingsProfile(validFormData());

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.reminderEnabled, false);
    assert.equal(result.data.reminderTime, null);
    assert.equal(result.data.communicationsConsent, false);
  }
});

test("rejects invalid profile fields and reminder time", () => {
  const formData = validFormData();
  formData.set("displayName", "Y");
  formData.set("professionalMoment", "inventado");
  formData.set("mainObjective", "Curto");
  formData.set("reminderEnabled", "on");
  formData.set("reminderTime", "25:90");

  const result = validateSettingsProfile(formData);

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.fieldErrors.displayName, /2 e 80/);
    assert.match(result.fieldErrors.professionalMoment, /momento/);
    assert.match(result.fieldErrors.mainObjective, /8 a 180/);
    assert.match(result.fieldErrors.reminderTime, /horário válido/);
  }
});
