import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);

test("CommonJS and ESM entry points import without a browser", async () => {
  const Headroom = require("headroom.js");
  const { default: ESHeadroom } = await import("headroom.js");
  for (const Constructor of [Headroom, ESHeadroom]) {
    assert.equal(typeof Constructor, "function");
    assert.equal(Constructor.cutsTheMustard, false);
    const hr = new Constructor({ classList: { remove() {} } });
    assert.equal(hr.init(), hr);
    assert.doesNotThrow(() => hr.destroy());
    assert.doesNotThrow(() => hr.destroy());
  }
});

test("legacy UMD and minified package subpaths retain constructors", () => {
  assert.equal(typeof require("headroom.js/dist/headroom.js"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom.min.js"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom.min"), "function");
});
