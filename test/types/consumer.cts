import Headroom = require("headroom.js");
import LegacyHeadroom = require("headroom.js/dist/headroom.js");
import MinifiedHeadroom = require("headroom.js/dist/headroom.min.js");

const supported: boolean = Headroom.isSupported;
const legacySupported: boolean = Headroom.cutsTheMustard;
Headroom.isSupported = supported;
Headroom.cutsTheMustard = legacySupported;
const legacyPathSupported: boolean = LegacyHeadroom.isSupported;
MinifiedHeadroom.isSupported = legacyPathSupported;
// @ts-expect-error The support flag is a boolean, not a function.
Headroom.isSupported();
// @ts-expect-error Only boolean support overrides are accepted.
Headroom.isSupported = "true";

new LegacyHeadroom(document.createElement("header")).init().destroy();
new MinifiedHeadroom(document.createElement("header")).init().destroy();

const hr = new Headroom(document.createElement("header"), {
  scroller: document.createElement("main"),
  offset: { up: 20, down: 50 },
  onUnpin() { this.pin(); }
});
hr.init().destroy();
// @ts-expect-error Both scroll directions are required.
new Headroom(document.createElement("header"), { offset: { up: 2 } });
