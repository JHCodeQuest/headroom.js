import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const require = createRequire(import.meta.url);

test("CommonJS and ESM entry points import without a browser", async () => {
  const Headroom = require("headroom.js");
  const { default: ESHeadroom } = await import("headroom.js");
  for (const Constructor of [Headroom, ESHeadroom]) {
    assert.equal(typeof Constructor, "function");
    assert.equal(Constructor.isSupported, false);
    assert.equal(Constructor.cutsTheMustard, false);
    const hr = new Constructor({ classList: { remove() {} } });
    assert.equal(hr.init(), hr);
    assert.doesNotThrow(() => hr.destroy());
    assert.doesNotThrow(() => hr.destroy());
  }
});

test("both module formats keep support flag overrides synchronized", async () => {
  const { default: ESHeadroom } = await import("headroom.js");
  for (const Constructor of [require("headroom.js"), ESHeadroom]) {
    const original = Constructor.isSupported;
    try {
      Constructor.isSupported = true;
      assert.equal(Constructor.cutsTheMustard, true);
      Constructor.cutsTheMustard = false;
      assert.equal(Constructor.isSupported, false);
      Constructor.cutsTheMustard = true;
      assert.equal(Constructor.isSupported, true);
      Constructor.isSupported = false;
      assert.equal(Constructor.cutsTheMustard, false);
    } finally {
      Constructor.isSupported = original;
    }
  }
});

test("browser bundles load with false flags when a required feature is absent", () => {
  for (const bundle of ["headroom.js", "headroom.min.js"]) {
    const source = readFileSync(new URL(`../dist/${bundle}`, import.meta.url), "utf8");
    for (const removal of [
      "delete globalThis.requestAnimationFrame",
      "Object.assign = undefined",
      "Object.keys = undefined",
      "Function.prototype.bind = undefined",
      "delete document.documentElement.classList"
    ]) {
      const context = vm.createContext({
        window: {}, document: { documentElement: { classList: {} } },
        requestAnimationFrame() {}
      });
      vm.runInContext(removal, context);
      assert.doesNotThrow(() => vm.runInContext(source, context), `${bundle}: ${removal}`);
      assert.equal(context.Headroom.isSupported, false, `${bundle}: ${removal}`);
      assert.equal(context.Headroom.cutsTheMustard, false, `${bundle}: ${removal}`);
      if (removal === "delete globalThis.requestAnimationFrame") {
        const hr = new context.Headroom({ classList: {
          add() { throw new Error("Unsupported init must not change classes"); }
        } });
        assert.equal(hr.init(), hr);
        assert.equal(hr.initialised, false);
      }
    }
  }
});

test("legacy UMD and minified package subpaths retain constructors", () => {
  assert.equal(typeof require("headroom.js/dist/headroom.js"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom.min.js"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom"), "function");
  assert.equal(typeof require("headroom.js/dist/headroom.min"), "function");
});
