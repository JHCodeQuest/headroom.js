# Maintained fork

This repository maintains the existing Headroom.js 0.12 API. It is based on
[upstream](https://github.com/WickyNilliams/headroom.js) commit `0f53fc7`.
The original MIT licence and authorship are retained.

## Changes in this update

- Current Rollup, ESLint, Cypress and TypeScript development tools, with an npm lockfile.
- Native ESM and strict TypeScript declarations, preserving CommonJS/UMD and legacy bundle paths.
- Safe cleanup before initialisation, during the deferred setup window, and on repeated calls.
- Cancellation of pending setup and animation work, with listener removal on destruction.
- Callback-triggered destruction/re-initialisation cannot finish an obsolete state update.
- A runnable TypeScript example with explicit lifecycle cleanup and reduced-motion CSS.
- Read-only CI on Node 22 and 24, with actions pinned to verified release commits.

There are no runtime dependencies. The upstream npm package name is unchanged
for compatibility, but `private: true` prevents accidental npm publication.
There is no published npm version, hosted demo or new version tag for this update.

## Upstream report triage

The upstream open issue list was inspected on 20 October 2026. These statuses
describe this fork; they do not close issues in the upstream project.

| Upstream report | Status in this fork |
| --- | --- |
| [#367: early destroy exception](https://github.com/WickyNilliams/headroom.js/issues/367) | Fixed with browser regressions covering the deferred setup window. |
| [#377: directional offset classes](https://github.com/WickyNilliams/headroom.js/issues/377) | Not reproduced in current Chrome. Both offset orderings have explicit browser coverage; no speculative runtime change made. |
| [#361: changing offsets dynamically](https://github.com/WickyNilliams/headroom.js/issues/361) | Reconfiguration API not added. Destroy the old instance and create a new one with the desired options. |
| [#393: partially freezing state](https://github.com/WickyNilliams/headroom.js/issues/393) | Feature request deferred. Existing freeze behaviour still freezes all scroll-driven state. |
| [#396: Locomotive Scroll](https://github.com/WickyNilliams/headroom.js/issues/396) | Virtual-scroll integration is outside this update. The scroller must expose native scroll position and events. |
| [#333: Angular directive](https://github.com/WickyNilliams/headroom.js/issues/333) | Legacy adapter source retained, unverified; no Angular 2+ component is provided. |
| [#140: jQuery modules](https://github.com/WickyNilliams/headroom.js/issues/140) | Legacy adapter source retained, unverified; no adapter packaging changes are claimed. |
| [#255: React component](https://github.com/WickyNilliams/headroom.js/issues/255) | No framework wrapper added. Core setup/cleanup can be integrated with a component's mount/unmount lifecycle. |
| [#307](https://github.com/WickyNilliams/headroom.js/issues/307), [#278](https://github.com/WickyNilliams/headroom.js/issues/278), [#271](https://github.com/WickyNilliams/headroom.js/issues/271): older iOS behaviours | Unverified. Physical iOS testing is required before claiming a fix. |
| [#347](https://github.com/WickyNilliams/headroom.js/issues/347), [#102](https://github.com/WickyNilliams/headroom.js/issues/102): API redesign | Deferred; this update preserves the 0.12 constructor, methods, classes and callbacks. |

## Validation and limits

Run `npm ci` and `npm run check` with supported Node and an installed Chrome.
The check builds all artifacts, runs package-import and strict type checks,
then tests scroll direction, both offset orderings, tolerance, callbacks, freeze,
custom containers, iframe windows, lifecycle cleanup and the ESM example.

Local verification uses Windows, Node 24 and Chrome. GitHub Actions separately
checks Linux on Node 22 and 24; only a successful run for the exact commit is
evidence for those environments. Safari, Firefox and physical mobile devices
are not covered by these checks. This update does not claim every historical
upstream report is fixed. See [the security review](SECURITY-REVIEW.md) for its scope.
