# Install and consume this fork

The fork retains the package name `headroom.js` and baseline version `0.12.0`,
but is not published to npm. Installing that name from the registry or using
upstream CDN links installs upstream, not this maintenance update. `private: true`
prevents accidental npm publication; it does not prevent a local package archive.

The current fork replaces upstream callback options with element events. Read
the [breaking-change migration](API.md#migrating-callback-consumers) before
updating a consumer, even though the baseline metadata version is still `0.12.0`.

## Build the checkout

Use Node 22.13+, 24 or 26+ and npm:

```bash
git clone https://github.com/JHCodeQuest/headroom.js.git
cd headroom.js
npm ci
npm run build
```

The build generates:

| Artifact | Use |
| --- | --- |
| `dist/headroom.js` | UMD: CommonJS, AMD or browser global `Headroom`. |
| `dist/headroom.min.js` | Minified UMD with the same constructor export. |
| `dist/headroom.mjs` | Native ESM default export. |
| `dist/headroom.d.ts` | Declaration entry for tools using the package's `types` field. |
| `dist/headroom.d.mts` | Declaration selected by the package's ESM import condition. |
| `dist/headroom.d.cts` | Declaration selected by its CommonJS require condition. |

Generated bundles are not tracked source. Rebuild after changing source; do not
edit the generated files. This build does not generate the legacy jQuery or
AngularJS adapters.

## Install into a separate application

For this example, `headroom.js` and `app` are sibling directories:

```text
workspace/
  headroom.js/
  app/
```

From `headroom.js`, create the local package archive:

```bash
npm pack --pack-destination ..
```

The `prepack` script rebuilds the package. From the application's `app` directory:

```bash
npm install ../headroom.js-0.12.0.tgz
```

Use the resulting filename printed by `npm pack` if the package version changes.
For another directory layout, adjust the local archive path. This installs the
fork as the application's `headroom.js` dependency. It does not publish a package
or download upstream under that name. The package contains core bundles,
declarations and standard package metadata/licence/README; the complete guides,
source and developer example live in the checkout and GitHub repository.

## Bundled browser application: ESM

After the local archive is installed, use a normal bundler import:

```js
import Headroom from "headroom.js";

const header = document.querySelector("header");
if (header && Headroom.isSupported) {
  const headroom = new Headroom(header).init();
  window.addEventListener("pagehide", event => {
    if (!event.persisted) headroom.destroy();
  });
}
```

Run this after the DOM element exists. Include CSS for the state classes, as in
the [README](../README.md#quick-start-in-a-consumer-application). Component
integrations should also destroy the instance on unmount; `pagehide` alone does
not handle client-side component removal.

The full-page examples skip destruction when `pagehide.persisted` is true,
preserving the instance for back/forward-cache restoration. See the
[pagehide lifecycle reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event).
If a component registers its own page listener, remove that listener during
unmount as well as destroying its Headroom instance. Browser page events are
not guaranteed on every mobile shutdown and should not replace view cleanup.

## CommonJS

In a CommonJS application or browser bundle, require the constructor directly:

```js
const Headroom = require("headroom.js");

if (typeof document !== "undefined" && Headroom.isSupported) {
  const header = document.querySelector("header");
  if (header) {
    const headroom = new Headroom(header).init();
    window.addEventListener("pagehide", event => {
      if (!event.persisted) headroom.destroy();
    });
  }
}
```

Requiring/importing the module on a server is safe, but does not make header
behaviour run without a browser. Create client-side instances in the browser.
Legacy CommonJS paths `headroom.js/dist/headroom.js` and
`headroom.js/dist/headroom.min.js`, including their extensionless forms, retain
the constructor export and package type mappings.

## Browser without a bundler: native ESM

Copy the built `dist/headroom.mjs` into the web application's `vendor` directory
and preserve the licence attribution. Serve these files over HTTP. The following
is a complete `index.html` placed next to `vendor/`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Headroom ESM example</title>
    <style>
      body { margin: 0; padding-top: 5rem; min-height: 300vh; }
      header { position: fixed; inset: 0 0 auto; padding: 1rem; background: #173d33; color: white; }
      .headroom { transition: transform 200ms linear; }
      .headroom--pinned { transform: translateY(0); }
      .headroom--unpinned { transform: translateY(-100%); }
      @media (prefers-reduced-motion: reduce) { .headroom { transition: none; } }
    </style>
  </head>
  <body>
    <header>Scroll down, then up</header>
    <main><h1>Native ESM</h1></main>
    <script type="module">
      import Headroom from "./vendor/headroom.mjs";
      const header = document.querySelector("header");
      if (header && Headroom.isSupported) {
        const headroom = new Headroom(header).init();
        window.addEventListener("pagehide", event => {
          if (!event.persisted) headroom.destroy();
        });
      }
    </script>
  </body>
</html>
```

## Browser without a bundler: classic script

Copy `dist/headroom.min.js` into `vendor/`. This complete HTML example uses the
global constructor. The library script comes before the initialisation script,
both after the header element:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Headroom classic-script example</title>
    <style>
      body { margin: 0; padding-top: 5rem; min-height: 300vh; }
      header { position: fixed; inset: 0 0 auto; padding: 1rem; background: #173d33; color: white; }
      .headroom { transition: transform 200ms linear; }
      .headroom--pinned { transform: translateY(0); }
      .headroom--unpinned { transform: translateY(-100%); }
      @media (prefers-reduced-motion: reduce) { .headroom { transition: none; } }
    </style>
  </head>
  <body>
    <header>Scroll down, then up</header>
    <main><h1>Classic script</h1></main>
    <script src="./vendor/headroom.min.js"></script>
    <script>
      const header = document.querySelector("header");
      if (header && Headroom.isSupported) {
        const headroom = new Headroom(header).init();
        window.addEventListener("pagehide", event => {
          if (!event.persisted) headroom.destroy();
        });
      }
    </script>
  </body>
</html>
```

## TypeScript

No separate `@types` dependency is needed for this fork. A browser application
with a bundler can use:

```ts
import Headroom from "headroom.js";

const header = document.querySelector<HTMLElement>("header");
if (header && Headroom.isSupported) {
  const options: Headroom.Options = { offset: { up: 40, down: 80 }, tolerance: 5 };
  const headroom = new Headroom(header, options).init();
  window.addEventListener("pagehide", event => {
    if (!event.persisted) headroom.destroy();
  });
}
```

TypeScript CommonJS consumers can use `import Headroom = require("headroom.js")`.
The existing strict consumer checks exercise NodeNext resolution for both ESM
and CommonJS; the developer example uses Bundler resolution.

## Included example and checks

From the fork checkout, run `npm run build` followed by `npm run demo`, then open
`http://127.0.0.1:3333`. The server serves the compiled example and ESM bundle,
not repository internals. This example is local, not a hosted public demo.

`npm run check` runs lint, build, package/type checks and Chrome browser tests.
See the [maintenance evidence](MAINTENANCE.md#verification-evidence) and
[browser policy](BROWSER-SUPPORT.md) for verified environments, target version
windows and per-browser commands. The [roadmap](ROADMAP.md#mobile-validation-plan)
tracks the separate iOS validation prerequisites. A successful build or Node import
does not establish browser compatibility.
