# Headroom.js

Hide a header while scrolling down and reveal it while scrolling up. Headroom
changes CSS classes; your stylesheet controls how the header looks and moves.
The core has no runtime dependencies.

This is [JHCodeQuest's maintained fork](https://github.com/JHCodeQuest/headroom.js),
based on [WickyNilliams/headroom.js](https://github.com/WickyNilliams/headroom.js)
0.12.0. Original MIT authorship is preserved. It is an independent maintenance
update, not an official upstream release.

**Breaking fork change:** state notifications now use element events instead of
the upstream callback options. Existing callback consumers must follow the
[migration guide](docs/API.md#migrating-callback-consumers). Baseline package
metadata `0.12.0` does not imply callback compatibility; no npm release is claimed.

## Build and try this fork

Use Node **22.13+, 24, or 26+** for development:

```bash
git clone https://github.com/JHCodeQuest/headroom.js.git
cd headroom.js
npm ci
npm run build
npm run demo
```

Open `http://127.0.0.1:3333`. The TypeScript example lets you scroll, disable the
widget and re-enable it. Its server binds only to loopback. Set `PORT` to use
another local port.

**This fork is not published to npm.** `npm install headroom.js` and existing
upstream CDN URLs do not contain our changes. To use this fork in another
application, follow the [installation and module examples](docs/INSTALLATION.md).

## Quick start in a consumer application

After installing the locally packed fork as described in the installation guide,
use this in a browser application with a bundler:

```js
import Headroom from "headroom.js";

const header = document.querySelector("header");
if (header && Headroom.isSupported) {
  const headroom = new Headroom(header, {
    offset: { up: 60, down: 100 },
    tolerance: { up: 5, down: 5 }
  }).init();

  // In a component, also call destroy() when the component unmounts.
  window.addEventListener("pagehide", event => {
    if (!event.persisted) headroom.destroy();
  });
}
```

Include the corresponding CSS:

```css
header { position: fixed; inset: 0 0 auto; }
.headroom { will-change: transform; transition: transform 200ms linear; }
.headroom--pinned { transform: translateY(0); }
.headroom--unpinned { transform: translateY(-100%); }
header:focus-within { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .headroom { transition: none; }
}
```

`init()` adds the initial class immediately and starts tracking after about
100 ms. Call `destroy()` when the element is no longer needed. Early and repeated
destruction is safe. See the [lifecycle and method reference](docs/API.md#lifecycle)
for details, including re-initialisation and freeze behaviour.

## Documentation and status

- [Current API](docs/API.md): options, classes, element events, methods and lifecycle.
- [Installation](docs/INSTALLATION.md): packed dependency, ESM, CommonJS,
  classic scripts, TypeScript and local example.
- [Planned work and migration](docs/ROADMAP.md): requested changes and testing prerequisites.
- [Browser support policy](docs/BROWSER-SUPPORT.md): version targets, verified
  environments, required checks and mobile blockers.
- [Maintenance evidence](docs/MAINTENANCE.md) and [security review](docs/SECURITY-REVIEW.md).
- [Public project board](https://github.com/users/JHCodeQuest/projects/7/views/1)
  and [issues](https://github.com/JHCodeQuest/headroom.js/issues).

Current code emits six `headroom:*` events on its element; listen before `init()`
and use `event.detail.headroom` for the instance. Callback options are rejected
with migration guidance. The `pin`/`unpin` methods remain; `up`/`down` naming,
dynamic configuration, pin-only freeze and framework/virtual scroll integrations
are planned work. Legacy jQuery and AngularJS adapter source
is retained but is not built or verified as a supported integration.

Use the static boolean `Headroom.isSupported` for feature detection. The old
`Headroom.cutsTheMustard` name is retained as a deprecated, synchronized alias;
existing reads and overrides continue to work. See the
[support-flag migration](docs/API.md#constructor-and-feature-detection).

## Development and verification

Chrome must be installed for the browser suite. From the checkout:

```bash
npm run check
```

This runs lint, builds the bundles and TypeScript example, checks CommonJS/ESM
imports and strict type consumers, then runs the Chrome browser tests.
`npm start` builds and opens the interactive Cypress runner.

The pre-event baseline runtime at
[`a3eb455`](https://github.com/JHCodeQuest/headroom.js/commit/a3eb455a737a26e2731993e9862e1aefadcd2825)
passed [Linux CI on Node 22 and 24](https://github.com/JHCodeQuest/headroom.js/actions/runs/39452518979),
including 24 Chrome tests and four package tests. Local Chrome checks also passed
on Windows with Node 24. Evidence applies to the recorded revision/environment;
check the current PR's CI for later changes.

The element-event update passes the current 34 Chrome tests, five package tests,
strict types, lint and build locally on Windows/Node 24. This is new evidence for
the event API; the linked older Linux run does not verify the event changes.
The same 34 browser regressions also pass in local Edge 155.

Our rolling maintenance targets cover the latest two stable Chrome, Edge and
Firefox desktop majors, current/previous Safari majors on supported macOS,
current/previous iOS/iPadOS majors and the latest two Chrome majors on supported
Android. These are targets, not a claim the whole matrix has passed. See the
[policy and evidence table](docs/BROWSER-SUPPORT.md) for exact version rules,
unverified combinations and the iOS testing blocker. Development Node requirements
do not define browser runtime support.

## Contributing

Work from a branch of [this fork](https://github.com/JHCodeQuest/headroom.js).
Include a reduced reproduction for bugs and run the affected checks before
`npm run check`. Keep framework integrations optional and preserve shared core logic.

Implementation PRs should describe their verified behaviour and use a closing
reference such as `Closes #1` for the task they complete. Merging into `master`
allows GitHub to close the linked issue; the project's enabled completion
workflows move completed items to **Done**. Closing a PR without merging is not
evidence that its task is complete.

## Licence

[MIT](LICENSE), retaining Nick Williams and the original contributors' attribution.
