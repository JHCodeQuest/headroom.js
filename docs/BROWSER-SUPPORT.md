# Browser support and verification policy

This policy applies to this fork's core library. It defines maintenance targets
and the checks needed to claim compatibility. A target is not a passing result:
the evidence table below records what has actually been tested. The legacy
jQuery/AngularJS adapters and proposed framework wrappers need their own checks.

## Browser and version targets

Use the following rolling window when planning compatibility work:

| Browser/platform | Target versions | Current coverage |
| --- | --- | --- |
| Chrome desktop on vendor-supported Windows, macOS and Linux | Latest two stable major browser versions. | Event update: 34 Chrome 155 checks passed on Windows. Linux evidence below predates that update; macOS and the rest of the window unverified. |
| Edge desktop on vendor-supported Windows, macOS and Linux | Latest two stable major browser versions. | Event update: 34 Edge 155 checks passed on Windows; manual checks and other combinations unverified. |
| Firefox desktop on vendor-supported Windows, macOS and Linux | Latest two stable major browser versions on the standard release channel. | Unverified; not installed in the current workspace. |
| Safari on vendor-supported macOS | Current and previous stable Safari major versions, on macOS versions that can run them. | Unverified; an accessible Mac is required. |
| Safari on iPhone/iOS | Current and previous stable iOS major releases, using their available Safari versions. | Blocked locally by [#13](https://github.com/JHCodeQuest/headroom.js/issues/13); Simulator/device checks required. |
| Safari on iPad/iPadOS | Current and previous stable iPadOS major releases, using their available Safari versions. | Same environment blocker; iPad checks are separate from iPhone checks. |
| Chrome on vendor-supported Android | Latest two stable Chrome major versions. | Unverified; desktop Chrome does not verify Android behaviour. |

“Latest two” means the stable major at the date a candidate's matrix is recorded
and its immediately preceding stable major, using the latest available patch
for each selected major. For Safari/iOS/iPadOS, resolve the majors from Apple's
stable releases available at that date; do not invent an unavailable OS/browser
pair. Prerelease channels do not move the window. Record exact browser and OS
versions before testing so that a rolling target never becomes a vague result.
This policy does not assert that the tested browser major is today's latest.

Older releases, Internet Explorer, legacy EdgeHTML, Firefox ESR, embedded webviews,
in-app browsers, other Chromium derivatives and alternate iOS browsers are outside
this matrix. Reduced reproductions are welcome, but they receive no compatibility
commitment under this policy. A shared engine alone does not establish coverage.
Adding a platform or extending the window requires a documented policy change
and a repeatable validation route; removing a target requires a migration note.

## Evidence, not inferred coverage

Evidence snapshot: 20 October 2026. A pass applies only to its recorded revision,
environment and checks. It does not verify every version in a target row.

| Revision/environment | Evidence | Limits |
| --- | --- | --- |
| [`a3eb455`](https://github.com/JHCodeQuest/headroom.js/commit/a3eb455a737a26e2731993e9862e1aefadcd2825), Ubuntu 24.04, Chrome 155 (setup installed Chrome for Testing 155.0.8059.84), Node 22.23.3 and 24.22.0 | [Successful master CI](https://github.com/JHCodeQuest/headroom.js/actions/runs/39452518979): lint, build, four package tests, strict type checks and 24 browser tests in each job. | Headless desktop Chrome only; two Node jobs do not add another browser engine. Cypress reports the browser major; the setup step records the installed full version. |
| Task #4 source `431c553`, Windows 11, Node 24.11, Chrome 155 | Local `npm run check` passed, including all 24 browser tests. | Recorded maintenance evidence; not a mobile, visual or accessibility certification. |
| Task #7 documentation working tree based on `a3eb455` (runtime unchanged), Windows 11 Home 10.0.26300, Node 24.11.0, Edge 155.0.4283.62 stable | Local build and `npx --no-install cypress run --browser edge` passed all 24 existing browser tests. | Headless desktop automation only; visual/accessibility, physical-device and real cache-restoration checks not performed. |
| Element-event working tree based on `1c45a25`, Windows 11, Node 24.11.0, Chrome 155.0.8059.85 and Edge 155.0.4283.62 | `npm run check` passed, including 34 Chrome tests and five package tests. The same 34 browser regressions plus four temporary packed-consumer documentation checks passed in Edge. | Runtime changed from the older baseline rows. Linux event-API CI is pending publication; mobile, visual and real cache-restoration checks remain unverified. |
| Firefox, Safari, Android and iOS/iPadOS | No passing result claimed here until a run is recorded. | A configured tool, installed browser or true support flag is not a passing test. |

The current [CI workflow](../.github/workflows/ci.yml) runs on `ubuntu-latest`
with Node 22 and 24 and launches Chrome via `npm run check`. The runner image
and browser can change between runs. Preserve the exact run URL and its version
output; the green status is evidence for that run, not a permanent matrix result.
There is no Firefox, Edge, Safari, macOS or mobile CI job in this workflow.

## Runtime requirements versus development tools

The browser core needs DOM elements and class manipulation, native scroll events,
window or element scroll measurements, `Function.prototype.bind`, `Object.assign`,
`Object.keys`, `Object.defineProperty`, `requestAnimationFrame` and
`cancelAnimationFrame`, plus `CustomEvent` construction and element `dispatchEvent`.
The passive-listener probe falls back to a boolean event
option when options objects are unavailable. Page layout and CSS remain the
consumer's responsibility.

`Headroom.isSupported` is a limited feature-detection snapshot, not a complete
platform test or browser-version policy. It checks a subset of those APIs and
does not verify animation cancellation, module loading, CSS, touch behaviour or
framework adapters. Guard construction with it; do not force the flag true to
work around missing APIs. See the [flag and alias contract](API.md#constructor-and-feature-detection).
No polyfills are bundled. A UMD build is a module format, not an assurance of
compatibility with every legacy browser.

Native ESM needs browser module loading; CommonJS needs an appropriate bundler
when used in a browser. Classic scripts use the UMD global. Consumer CSS must be
checked too: the examples use transforms/transitions, `:focus-within` and reduced
motion preferences; the core adding a class does not prove the header is visible
or keyboard accessible. See the [installation examples](INSTALLATION.md).

Development tooling accepts Node `^22.13.0 || ^24.0.0 || >=26.0.0`, as declared in
`package.json`. CI currently exercises only Node 22 and 24. That engine range
does not promise tests on every later Node release. Server-side package-import
and type checks verify module consumption; Node does not provide the browser DOM
needed for header behaviour. Browser versions are independent of Node versions.

## Required desktop checks

For a compatibility claim, resolve the exact candidate matrix and exercise each
selected browser/OS/version combination. Record unavailable combinations as
unverified or blocked with a reason; one tested Windows version does not cover
macOS/Linux. Do not silently reduce the target window to match installed tools.

From a checkout with `npm ci` completed and the relevant browser installed:

```bash
npm run check
```

This builds and runs the configured Chrome checks. To run the same browser suite
in another installed browser after building, use explicit commands:

```bash
npm run build
npx --no-install cypress run --browser edge
npx --no-install cypress run --browser firefox
```

These are separate browser selections; run only when that browser is available.
The [Cypress browser-launch documentation](https://docs.cypress.io/app/references/launching-browsers)
describes supported launch targets and test-runner version constraints. A runner
limitation must be recorded and addressed with an authorised compatible test
route; it is not grounds to mark a browser as passed. Experimental WebKit is not
a Safari result. Use actual Safari on an accessible Mac for the Safari matrix.

Require both the automated regressions where supported and manual checks:

- Verify down/up pin changes, both directional offset orderings, exact top/bottom
  boundaries, tolerance, element events and frozen state. Match the current
  [API contract](API.md), including the absence of an initial pinned class.
- Exercise window, overflowing element and same-origin iframe scroll sources;
  confirm cleanup before/after deferred setup, repeated destruction,
  re-initialisation and reentrant listeners do not leave tracking behind.
- Load native ESM and classic UMD examples over HTTP; check the bundled consumer
  path and declaration/package checks. Confirm no unexpected console errors.
- Check the actual application's header with keyboard focus, reduced motion,
  page zoom, responsive layout, anchor navigation and back/forward navigation.
  Required controls must remain reachable and visible. Record visual/accessibility
  checks separately from class assertions; synthetic page events do not prove
  real back/forward-cache restoration.

## Required mobile checks

Use the same observable core checks plus touch scrolling, inertia/overscroll,
top/bottom boundaries, dynamic content/header size, toolbar expansion/collapse,
portrait/landscape changes and taps on header controls after rotation. Check
iPhone and iPad separately, and include their browser/OS versions and viewport
in the result. Android requires an actual selected Android environment too.

For Apple targets, first unblock [the Mac/Xcode environment](https://github.com/JHCodeQuest/headroom.js/issues/13).
Run the selected Safari versions in suitable iPhone/iPad Simulator runtimes, then
use physical devices for browser chrome, touch, scrolling or other behaviour the
Simulator cannot reproduce. Follow [Apple's device/Simulator guidance](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices).
Desktop responsive resizing, desktop WebKit and a Simulator alone do not establish
all physical-device behaviours. Track the reduced reproductions and fixes through
[#16](https://github.com/JHCodeQuest/headroom.js/issues/16) and the individual iOS
reports; defining this policy does not resolve those reports.

## Recording results and maintaining the window

For each tested combination record:

```text
Candidate commit and date:
Browser full version/channel; OS version:
Device or Simulator model/runtime; desktop or mobile; viewport/orientation:
Commands, fixture/reproduction and expected observable behaviour:
Actual result and status: passed / failed / unverified / blocked
Automated checks; manual checks; skipped checks and reason:
CI/artifact evidence; linked bug or environment blocker:
Physical-device follow-up and remaining limits:
```

Use synthetic page content in shared evidence; omit personal profiles, credentials
and private URLs. Record failures before fixing them, add relevant regression
coverage, then repeat the original scenario. A missing environment is blocked;
a check that was not run is unverified; neither is a pass. Mark a combination
passed only for the recorded checks, with manual gaps stated explicitly.

Review the rolling matrix at each compatibility-affecting change and before a
release compatibility claim. New stable majors update the target window; prior
results remain historical evidence and do not transfer to the new major. Changes
to scroll/lifecycle/events, bundles, CSS examples or test tooling require relevant
revalidation. Update this evidence table and the PR's results for changed areas.
Unresolved failures block a compatibility claim for that combination. A release
must either verify its advertised matrix or explicitly narrow its advertised
verified coverage and disclose the pending targets; never imply the whole target
matrix passed. This policy can be completed while environment blockers remain.
