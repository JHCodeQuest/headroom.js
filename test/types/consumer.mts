import Headroom from "headroom.js";

const element = document.createElement("header");
const options: Headroom.Options = {
  tolerance: { up: 2, down: 5 },
  offset: 40,
  scroller: window,
  classes: { pinned: "header-visible" },
  onPin() { this.freeze(); }
};
const instance: Headroom = new Headroom(element, options).init();
instance.destroy();
// @ts-expect-error A numeric tolerance is required.
new Headroom(element, { tolerance: "5" });
// @ts-expect-error The widget requires an element, not a selector string.
new Headroom("header");
// @ts-expect-error Custom classes must use a known state name.
new Headroom(element, { classes: { unknown: "header" } });
