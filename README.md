# Headroom.js

> Local revival of upstream 0.12.0. This checkout is not an official upstream release.
> It is marked private to prevent accidental npm publication. Original MIT
> authorship and the existing runtime API are preserved.

This revision adds native ESM and TypeScript declarations alongside the existing
UMD/CommonJS builds, updates the development toolchain, and makes lifecycle
cleanup safe before deferred initialisation and when called repeatedly.

Headroom.js is a lightweight, high-performance JS widget (with no dependencies) that allows you to react to the user's scroll. The header on [this site](http://wicky.nillia.ms/headroom.js) is a living example, it slides out of view when scrolling down and slides back in when scrolling up.

## Installation

Headroom.js is available on npm. To install:

```bash
npm install headroom.js --save

# or...
yarn add headroom.js
```

A a universal build (suitable for script tags, CommonJS, and AMD) is available from unpkg.com:

[https://unpkg.com/headroom.js](https://unpkg.com/headroom.js)

The npm/CDN commands above refer to upstream, not this local revision. To try
this checkout, run `npm ci` and `npm run build`. The generated files are:

- `dist/headroom.js` and `dist/headroom.min.js`: legacy UMD/CommonJS builds.
- `dist/headroom.mjs`: native ESM, selected by the package's import entry point.
- `dist/headroom.d.ts`, `.d.mts`, `.d.cts`: declarations for the respective consumers.

No runtime dependencies have been added. The jQuery and AngularJS source adapters
are retained; modern framework wrappers are outside this revision's scope.

## Documentation

For complete documentation please visit the [headroom.js website](http://wicky.nillia.ms/headroom.js).

## Quick start

After installing `headroom.js`. The following JS will create and initialise a headroom instance:

```js
import Headroom from "headroom.js";

// select your header or whatever element you wish
const header = document.querySelector("header");

const headroom = new Headroom(header);
headroom.init();
```

Then you can add the following CSS to your page:

```css
.headroom {
  will-change: transform;
  transition: transform 200ms linear;
}
.headroom--pinned {
  transform: translateY(0%);
}
.headroom--unpinned {
  transform: translateY(-100%);
}
@media (prefers-reduced-motion: reduce) {
  .headroom {
    transition: none;
  }
}
```

You should now see your header slide in and out in response to the user's scroll.

Call `headroom.destroy()` when the element is unmounted or no longer needed.
It cancels deferred setup, removes scroll listeners and pending animation work,
and removes Headroom classes. It is safe before `init()`, immediately after it,
and on repeated calls. The same instance can be initialised again.

### TypeScript example

After building, run:

```bash
npm run demo
```

Open `http://127.0.0.1:3333`. Scroll down and up, then use the button to disable
and re-enable the widget. The example uses native ESM, strict TypeScript,
keyboard-focus styling and reduced-motion CSS. Only the demo and its ESM bundle
are served, on the loopback interface. Set `PORT` to choose another local port.

## Contributions & Issues

Contributions are welcome. Please clearly explain the purpose of the PR and follow the current code style.

Issues can be resolved quickest if they are descriptive and include both a reduced test case and a set of steps to reproduce.

## Contributing Guide

### Setup

The following steps will get you setup to contribute changes to this repo:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of [this page](https://github.com/WickyNilliams/headroom.js))
2. Clone your fork locally

```bash
git clone https://github.com/<your_github_username>/headroom.js.git
cd headroom.js
```

3. Install dependencies. This repo uses `npm`, so you should too.

Development requires Node 22.13+ or 24 (also supports Node 26+) and an installed
Chrome browser for the browser suite. Node 24 was used for local verification.

```bash
npm ci
```

### Building

To build the project:

```bash
npm run build
```

To build and open the interactive Cypress test runner:

```bash
npm start
```

### Testing

To run the test suite in headless mode:

```bash
npm test
```

`npm test` builds the bundles and example, tests server-side package imports,
checks strict ESM/CommonJS TypeScript consumers, and runs the original browser
behaviour tests plus lifecycle and ESM-example regressions in Chrome.

```bash
npm run lint
npm run check
npm pack --dry-run
```

The workflow repeats `npm run check` on Node 22 and 24. Remote CI and browser
platforms other than those actually run locally remain unverified.

## License

Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
