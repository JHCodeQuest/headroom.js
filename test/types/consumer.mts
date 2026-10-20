import Headroom from "headroom.js";

const supported: boolean = Headroom.isSupported;
const legacySupported: boolean = Headroom.cutsTheMustard;
Headroom.isSupported = supported;
Headroom.cutsTheMustard = legacySupported;
// @ts-expect-error The support flag is a boolean, not a function.
Headroom.isSupported();
// @ts-expect-error Only boolean support overrides are accepted.
Headroom.isSupported = "true";

const element = document.createElement("header");
const options: Headroom.Options = {
  tolerance: { up: 2, down: 5 },
  offset: 40,
  scroller: window,
  classes: { pinned: "header-visible" }
};
const instance: Headroom = new Headroom(element, options).init();
instance.destroy();
// @ts-expect-error A numeric tolerance is required.
new Headroom(element, { tolerance: "5" });
// @ts-expect-error The widget requires an element, not a selector string.
new Headroom("header");
// @ts-expect-error Custom classes must use a known state name.
new Headroom(element, { classes: { unknown: "header" } });

const onPin = (event: Headroom.EventMap["headroom:pin"]) => {
  const owner: Headroom = event.detail.headroom;
  owner.freeze();
  // @ts-expect-error The event has no invented scroll-position payload.
  event.detail.scrollY;
};
element.addEventListener("headroom:pin", onPin);
element.removeEventListener("headroom:pin", onPin);
document.addEventListener("headroom:not-top", event => {
  const detail: Headroom.EventDetail = event.detail;
  detail.headroom.destroy();
});
// @ts-expect-error Callback options were replaced by element events.
new Headroom(element, { onPin() {} });
