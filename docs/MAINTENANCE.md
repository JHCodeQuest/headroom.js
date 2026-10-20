# Maintained fork

This repository maintains the Headroom.js 0.12 API, based on
[upstream](https://github.com/WickyNilliams/headroom.js) commit `0f53fc7`.
The original MIT licence and authorship are retained. The [API guide](API.md)
documents current behaviour; the [roadmap](ROADMAP.md) describes proposed work.

## Maintenance baseline

- Updated Rollup, ESLint, Cypress and TypeScript development tools, with an npm lockfile.
- Native ESM and strict TypeScript declarations, preserving CommonJS/UMD and legacy core bundle paths.
- Safe cleanup before initialisation, during deferred setup, and on repeated calls.
- Cancellation of pending setup and animation work, with listener removal on destruction.
- Callback-triggered destruction/re-initialisation cannot finish an obsolete state update.
- Runnable TypeScript example with lifecycle cleanup and reduced-motion CSS.
- Read-only CI on Node 22 and 24, with actions pinned to release commits.

There are no runtime dependencies. The upstream npm package name and version
are retained for compatibility, but `private: true` prevents accidental npm
publication. This maintenance update has no published npm release, hosted demo
or new version tag. Use the [local package installation guide](INSTALLATION.md)
to consume this fork rather than the upstream registry package.

The documentation update covers installation, the actual options and lifecycle,
adapter limitations, planned migrations and testing prerequisites. It does not
implement the roadmap or change runtime behaviour.

## Support-flag migration

The subsequent support-flag update adds the preferred static boolean
`Headroom.isSupported` and retains `cutsTheMustard` as a deprecated, synchronized
alias. Existing overrides through either name control future `init()` attempts.
Missing `requestAnimationFrame` now produces a false flag without an import-time
exception. This is an additive API change; it does not define a new browser
support policy. See the [API reference](API.md#constructor-and-feature-detection).

## Upstream report triage

The upstream open issues were inspected on 20 October 2026. These statuses
describe this fork; they do not close issues in the upstream project.

| Upstream report | Status and follow-up in this fork |
| --- | --- |
| [#367: early destroy exception](https://github.com/WickyNilliams/headroom.js/issues/367) | Fixed with browser regressions covering deferred setup and repeated cleanup. |
| [#377: directional offset classes](https://github.com/WickyNilliams/headroom.js/issues/377) | Not reproduced in current Chrome; both offset orderings have coverage. Investigation remains tracked in [#21](https://github.com/JHCodeQuest/headroom.js/issues/21). |
| [#361: dynamic offsets](https://github.com/WickyNilliams/headroom.js/issues/361) | No reconfiguration API yet; destroy/recreate with new options. Planned in [#10](https://github.com/JHCodeQuest/headroom.js/issues/10). |
| [#393: partial freeze](https://github.com/WickyNilliams/headroom.js/issues/393) | Freeze still stops all scroll-driven states. Pin-only freeze is planned in [#8](https://github.com/JHCodeQuest/headroom.js/issues/8). |
| [#396: Locomotive Scroll](https://github.com/WickyNilliams/headroom.js/issues/396) | Native scroll events/position remain required. Integration planned in [#9](https://github.com/JHCodeQuest/headroom.js/issues/9). |
| [#333: Angular directive](https://github.com/WickyNilliams/headroom.js/issues/333) | Legacy AngularJS adapter source retained, unverified. Reproduction in [#20](https://github.com/JHCodeQuest/headroom.js/issues/20); modern Angular work is separate in [#15](https://github.com/JHCodeQuest/headroom.js/issues/15). |
| [#140: jQuery modules](https://github.com/WickyNilliams/headroom.js/issues/140) | Legacy adapter source retained, without a supported current build. Strategy [#6](https://github.com/JHCodeQuest/headroom.js/issues/6) and module bug [#19](https://github.com/JHCodeQuest/headroom.js/issues/19) remain planned. |
| [#255: React](https://github.com/WickyNilliams/headroom.js/issues/255) | No packaged wrapper; optional integration planned in [#18](https://github.com/JHCodeQuest/headroom.js/issues/18). |
| [#307](https://github.com/WickyNilliams/headroom.js/issues/307), [#278](https://github.com/WickyNilliams/headroom.js/issues/278), [#271](https://github.com/WickyNilliams/headroom.js/issues/271): older iOS behaviours | Unverified. Reproduction and Simulator/device validation are tracked in [#16](https://github.com/JHCodeQuest/headroom.js/issues/16); the Mac/Xcode environment blocker is [#13](https://github.com/JHCodeQuest/headroom.js/issues/13). |
| [#347](https://github.com/WickyNilliams/headroom.js/issues/347), [#102](https://github.com/WickyNilliams/headroom.js/issues/102): API redesign | This fork preserves constructor, methods, classes and callbacks. Proposed changes and their dependencies are in the [roadmap](ROADMAP.md). |

## Verification evidence

Run `npm ci` and `npm run check` with supported Node and installed Chrome.
The check lints, builds all artifacts, runs four package tests and strict
ESM/CommonJS type-consumer checks, then runs 24 Chrome browser tests. Coverage
includes scroll direction, both offset orderings, tolerance, callbacks, freeze,
custom containers, iframe windows, lifecycle cleanup and the ESM example.
The support-flag checks cover SSR imports, alias writes in both module formats,
isolated missing-feature environments and browser initialisation overrides.

The maintained runtime revision
[`a3eb455`](https://github.com/JHCodeQuest/headroom.js/commit/a3eb455a737a26e2731993e9862e1aefadcd2825)
passed [Linux CI on Node 22 and 24](https://github.com/JHCodeQuest/headroom.js/actions/runs/39452518979),
including all 24 Chrome tests. Local Chrome checks used Windows and Node 24.
These results apply to their recorded revision; use the current PR's checks for
subsequent changes.

While defining the policy, the existing 24 browser tests also passed locally in
Edge 155 on Windows against the same unchanged runtime. This adds desktop
automation evidence, not visual, mobile or full-matrix verification. The exact
version and limits are recorded in the policy's evidence table.

The [browser support policy](BROWSER-SUPPORT.md) now defines rolling version
targets, exact environment evidence and required desktop/mobile checks. It does
not turn untested Firefox, Safari or mobile targets into passing results.
Development Node versions do not define browser runtime support. Follow the
[mobile validation plan](ROADMAP.md#mobile-validation-plan) before claiming an
iOS fix; desktop emulation does not replace Simulator/device evidence.

The [security review](SECURITY-REVIEW.md) records its baseline scope and limits.
It is not a security guarantee or evidence that every historical report is fixed.
