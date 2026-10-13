import { test } from "node:test";
import assert from "node:assert/strict";
import {
  loadLocale,
  loadRecord,
  saveLocale,
  saveRecord,
} from "../js/storage.js";

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

const brokenStorage = {
  getItem() {
    throw new Error("SecurityError");
  },
  setItem() {
    throw new Error("QuotaExceededError");
  },
};

test("sin récord guardado, el récord es 0", () => {
  assert.equal(loadRecord(memoryStorage()), 0);
});

test("guarda la puntuación solo si supera el récord", () => {
  const storage = memoryStorage({ "snake-app:record": "10" });
  assert.equal(saveRecord(storage, 7), 10);
  assert.equal(loadRecord(storage), 10);
  assert.equal(saveRecord(storage, 12), 12);
  assert.equal(loadRecord(storage), 12);
});

test("un valor corrupto se trata como 0", () => {
  for (const value of ["abc", "-5", ""]) {
    assert.equal(
      loadRecord(memoryStorage({ "snake-app:record": value })),
      0,
      value,
    );
  }
});

test("un almacén que lanza excepciones no rompe nada", () => {
  assert.equal(loadRecord(brokenStorage), 0);
  assert.equal(saveRecord(brokenStorage, 5), 5);
  assert.equal(loadLocale(brokenStorage), null);
  assert.doesNotThrow(() => saveLocale(brokenStorage, "en"));
});

test("sin almacén disponible tampoco rompe", () => {
  assert.equal(loadRecord(undefined), 0);
  assert.equal(saveRecord(undefined, 3), 3);
});

test("el idioma se guarda y se lee", () => {
  const storage = memoryStorage();
  assert.equal(loadLocale(storage), null);
  saveLocale(storage, "en");
  assert.equal(loadLocale(storage), "en");
});
