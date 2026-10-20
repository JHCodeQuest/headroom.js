import Headroom = require("headroom.js");
import LegacyHeadroom = require("headroom.js/dist/headroom.js");
import MinifiedHeadroom = require("headroom.js/dist/headroom.min.js");

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
