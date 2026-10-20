# Current API reference

This describes the maintained 0.12 API as implemented in `src/Headroom.js` and its
scroll tracker. It does not describe the proposed v1 API. See the
[roadmap](ROADMAP.md) for planned changes.

## Constructor and feature detection

```js
const headroom = new Headroom(element, options);
```

Pass an existing `HTMLElement`, not a selector string. `options` is optional.
Construction stores options; it does not start tracking. Call `init()` after the
element and its scroll container exist in the browser.

`Headroom.isSupported` is a static **boolean**, not a function. Its initial value
is computed when the module loads. The feature check uses `classList`,
`Function.prototype.bind`, `Object.assign`, `Object.keys` and a callable
`requestAnimationFrame`. A missing animation-frame API reports false instead
of throwing while the module loads. The package can be imported on the server
without a DOM, where the flag is false and the default scroller is null. Header
behaviour belongs in the browser, not during server rendering.

The legacy name `Headroom.cutsTheMustard` remains as a deprecated getter/setter
alias: both names read and write the same value. Existing consumers can continue
using it; new code should use `Headroom.isSupported`. There is no scheduled
removal or runtime deprecation warning in this maintenance update.

`init()` reads the current `isSupported` value. Setting either name to false
disables subsequent initialisation attempts, but does not destroy instances
already tracking. Re-enable the flag and call `init()` to start an instance whose
initialisation was skipped. The flag is a module-load snapshot, not a live test:
installing polyfills later does not automatically update it, and forcing it true
does not supply missing browser APIs. Perform detection/polyfill setup before
loading the module. Do not force it true during server rendering.

The [browser support policy](BROWSER-SUPPORT.md) defines maintenance version
targets and verified environments separately. A true flag does not establish
platform compatibility; it does not test every runtime API, CSS or mobile behaviour.

## Options and defaults

`Headroom.options` exposes the defaults. Configure an individual instance through
its constructor; changing defaults before construction affects later instances.
The defaults in a browser are:

```js
{
  offset: 0,
  tolerance: { up: 0, down: 0 },
  scroller: window,
  classes: {
    initial: "headroom",
    frozen: "headroom--frozen",
    pinned: "headroom--pinned",
    unpinned: "headroom--unpinned",
    top: "headroom--top",
    notTop: "headroom--not-top",
    bottom: "headroom--bottom",
    notBottom: "headroom--not-bottom"
  }
}
```

No callbacks are configured by default.

| Option | Accepted value | Behaviour |
| --- | --- | --- |
| `offset` | Number, or `{ up: number, down: number }` | Pixel boundary for top/not-top state, using the current scroll direction's value. A position at or below that value is `top`. |
| `tolerance` | Number, or `{ up: number, down: number }` | Minimum movement for a direction-driven pin change. The measured distance must be **greater than** the direction's tolerance. Top state can still pin the header. |
| `scroller` | `Window` or `HTMLElement` | Event source and scroll-position provider; defaults to the browser window. Element scrollers must actually overflow and emit native scroll events. An iframe's window is also supported by the existing Chrome tests. |
| `classes` | Partial object using the eight keys above | Overrides individual default class names; unspecified keys retain their defaults. Use non-empty names, with single spaces between multiple class tokens. |
| `onPin`, `onUnpin`, `onTop`, `onNotTop`, `onBottom`, `onNotBottom` | Functions | Called on the corresponding state transition; details below. |

Supply finite, non-negative pixel values and both `up` and `down` when using an
object. This is a caller requirement; the runtime does not provide comprehensive
option validation or merge missing directional keys with defaults. A numeric
value is normalised to both directions.

Scroll work is batched with animation frames. Tolerance compares each processed
position with the previously processed position; it is not a cumulative travel
distance since the last pin/unpin. Top and bottom classes can change even when
the pin tolerance is not exceeded.

For a custom container:

```js
const scroller = document.querySelector(".scroller");
const header = document.querySelector("header");
if (scroller && header && Headroom.isSupported) {
  const headroom = new Headroom(header, {
    scroller,
    offset: { up: 20, down: 80 },
    tolerance: 5,
    classes: { pinned: "header-visible", unpinned: "header-hidden" }
  }).init();
  // Call headroom.destroy() during the owning view's cleanup.
}
```

A virtual scrolling system that translates content without native scroll
position/events is not supported merely by passing its container. Locomotive
Scroll integration is tracked in [#9](https://github.com/JHCodeQuest/headroom.js/issues/9).

## Callbacks and class transitions

Callbacks receive no arguments. A regular function's `this` is the Headroom
instance. An arrow function keeps its lexical `this` and should not be used when
the callback needs the instance binding.

```ts
import Headroom from "headroom.js";

const header = document.querySelector<HTMLElement>("header");
if (header && Headroom.isSupported) {
  const options: Headroom.Options = {
    onUnpin() { console.log(this.initialised); },
    onTop() { console.log("At the current direction's top boundary"); }
  };
  const headroom = new Headroom(header, options).init();
  window.addEventListener("pagehide", event => {
    if (!event.persisted) headroom.destroy();
  });
}
```

| Callback | State class added | Opposite class removed |
| --- | --- | --- |
| `onPin` | `pinned` | `unpinned` |
| `onUnpin` | `unpinned` | `pinned` |
| `onTop` | `top` | `notTop` |
| `onNotTop` | `notTop` | `top` |
| `onBottom` | `bottom` | `notBottom` |
| `onNotBottom` | `notBottom` | `bottom` |

The names in this table are keys in `classes`. Classes are updated before the
callback. Repeated requests for an unchanged state do not repeatedly call that
state's callback. Initial scroll evaluation can invoke top/not-top and
bottom/not-bottom callbacks. It does not guarantee an initial `onPin` call or
that a pinned/unpinned class has already been added.

During a scroll update, top state is evaluated first, bottom state next, and pin
state last. Destruction in a state callback cancels tracking and stops the
obsolete update from applying later states, including when that callback
immediately re-initialises the instance. Callback exceptions are not caught by
the library; keep callback handling appropriate to the application.

The core currently emits **no DOM events** for these transitions. Callback
replacement is planned in [#5](https://github.com/JHCodeQuest/headroom.js/issues/5).

## Lifecycle

| Method | Return | Current contract |
| --- | --- | --- |
| `init()` | The instance | If supported and not already initialised, adds `classes.initial` immediately and defers listener registration/initial scroll evaluation by about 100 ms, allowing browser-restored scroll positions to settle. Calling it twice does not add another tracker. |
| `destroy()` | `undefined` | Cancels deferred setup, removes the scroll listener and queued animation frame, and removes all configured Headroom classes. Safe before initialisation, immediately after it, and when repeated. It does not remove the element or application-owned event listeners. |
| `unpin()` | `undefined` | Enters the unpinned state and calls `onUnpin` when that state changes. Can enter it from the initial state. |
| `pin()` | `undefined` | Changes an already-unpinned element to pinned and calls `onPin`. It does not add the pinned class to an element that has never entered the unpinned state. |
| `freeze()` | `undefined` | Sets `frozen` and adds its class. All scroll-driven top/bottom/pin updates stop. |
| `unfreeze()` | `undefined` | Clears `frozen` and its class. Tracking can update state on subsequent scroll events; it does not force an immediate state recalculation. |

Manual `pin()`/`unpin()` calls still work while frozen. There is no separate
pin-only freeze mode yet; see [#8](https://github.com/JHCodeQuest/headroom.js/issues/8).

An instance can be initialised after destruction. Its supplied options and
`frozen` flag are not reset to defaults by `destroy()`; call `unfreeze()` if the
reused instance should stop being frozen. Do not use `initialised` as a signal
that the deferred listener registration has finished: it becomes true earlier.

There is no supported reconfiguration method yet. To change offsets or other
options through the documented interface, destroy the old instance and create a
new one. Dynamic offset support is planned in
[#10](https://github.com/JHCodeQuest/headroom.js/issues/10).

## Other exposed helpers

The declarations also expose `top()`, `notTop()`, `bottom()` and `notBottom()`.
They apply those class transitions and callbacks directly. They do not measure
scroll position, and manual calls do not obey the scroll-update freeze guard.

`addClass(key)`, `removeClass(key)` and `hasClass(key)` use a key from
`Headroom.Classes`, not an arbitrary CSS class name. `shouldPin(details)`,
`shouldUnpin(details)` and `update(details)` consume a complete
`Headroom.ScrollDetails` object. These are low-level state helpers; normal
integrations should let the tracker supply its measured details rather than
fabricate partial updates. Internal tracker/timer/generation fields are not a
supported reconfiguration or framework integration API.

## CSS and accessibility

The core adds classes but does not supply header layout or animation styles. See
the [README CSS](../README.md#quick-start-in-a-consumer-application) and the
[runnable example](../examples/typescript/index.html). Keep focused header controls
visible and respect `prefers-reduced-motion`. Applications remain responsible for
keyboard navigation, focus and announcements appropriate to their interface.

For same-page anchor navigation, CSS `scroll-padding-top` on the scroll container
can reserve space for the fixed header. Verify the chosen value with the
application's actual header size and responsive layout.
