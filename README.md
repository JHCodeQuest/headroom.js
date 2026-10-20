# Headroom.js

Hide a header while scrolling down and reveal it while scrolling up. Headroom
changes CSS classes; your stylesheet controls how the header looks and moves.
The core has no runtime dependencies.

This is [JHCodeQuest's maintained fork](https://github.com/JHCodeQuest/headroom.js),
based on [WickyNilliams/headroom.js](https://github.com/WickyNilliams/headroom.js)
0.12.0. Original MIT authorship is preserved. It is an independent maintenance
update, not an official upstream release.

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
if (header && Headroom.cutsTheMustard) {
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

- [Current API](docs/API.md): options, classes, callbacks, methods and lifecycle.
- [Installation](docs/INSTALLATION.md): packed dependency, ESM, CommonJS,
  classic scripts, TypeScript and local example.
- [Planned work and migration](docs/ROADMAP.md): requested changes and testing prerequisites.
- [Maintenance evidence](docs/MAINTENANCE.md) and [security review](docs/SECURITY-REVIEW.md).
- [Public project board](https://github.com/users/JHCodeQuest/projects/7/views/1)
  and [issues](https://github.com/JHCodeQuest/headroom.js/issues).

Current code retains callbacks and the `pin`/`unpin` API. Element events,
`up`/`down` naming, dynamic configuration, pin-only freeze and framework/virtual
scroll integrations are planned work. Legacy jQuery and AngularJS adapter source
is retained but is not built or verified as a supported integration.

## Development and verification

Chrome must be installed for the browser suite. From the checkout:

```bash
npm run check
```

This runs lint, builds the bundles and TypeScript example, checks CommonJS/ESM
imports and strict type consumers, then runs the Chrome browser tests.
`npm start` builds and opens the interactive Cypress runner.

The maintenance baseline at
[`777cd46`](https://github.com/JHCodeQuest/headroom.js/commit/777cd46797052881c09c8cb8340da998d811ff06)
passed [Linux CI on Node 22 and 24](https://github.com/JHCodeQuest/headroom.js/actions/runs/39442262856),
including 21 Chrome tests and two package-import tests. Local baseline checks ran
on Windows with Node 24 and Chrome. This evidence is specific to that revision;
check the current PR's CI for later changes. Firefox, Safari and physical iOS
remain unverified. Node requirements describe development tooling, not a promise
of equivalent browser support.

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
