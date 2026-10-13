import { test } from "node:test";
import assert from "node:assert/strict";
import { detectLocale, LOCALES, messages, t } from "../js/i18n.js";

test("todos los idiomas tienen exactamente las mismas claves", () => {
  const [base, ...others] = LOCALES;
  const expected = Object.keys(messages[base]).sort();
  for (const locale of others) {
    assert.deepEqual(Object.keys(messages[locale]).sort(), expected, locale);
  }
});

test("ningún texto está vacío", () => {
  for (const locale of LOCALES) {
    for (const [key, value] of Object.entries(messages[locale])) {
      assert.ok(value.trim().length > 0, `${locale}.${key}`);
    }
  }
});

test("la preferencia guardada manda sobre el navegador", () => {
  assert.equal(detectLocale("en", "es-ES"), "en");
});

test("sin preferencia, usa el idioma del navegador", () => {
  assert.equal(detectLocale(null, "es-MX"), "es");
  assert.equal(detectLocale(null, "en-US"), "en");
  assert.equal(detectLocale(null, "fr-FR"), "en");
});

test("una preferencia desconocida se ignora", () => {
  assert.equal(detectLocale("de", "es-CO"), "es");
});

test("sin datos, español", () => {
  assert.equal(detectLocale(null, undefined), "es");
});

test("t sustituye parámetros", () => {
  assert.equal(
    t("es", "status.newRecord", { score: 42 }),
    "¡Nuevo récord: 42!",
  );
  assert.equal(t("en", "hud.score"), "Score");
});
