# Security review of the maintenance update

Reviewed on 20 October 2026. This covers the browser library, generated bundles,
package contents, local example server and CI configuration. No public demo,
backend service or npm package is being deployed by this update.

| Area | Evidence and result |
| --- | --- |
| Runtime injection/data access | The library changes DOM classes and calls consumer-supplied callbacks. No HTML rendering, eval, network requests, credentials, storage or runtime dependencies found. |
| Example | Uses synthetic text and `textContent`. Its server binds only `127.0.0.1` and serves three exact asset paths for GET/HEAD. Repository-file and traversal requests return404. |
| Public/package files | Source and generated artifacts inspected. npm's package list contains metadata, licence, README, bundles and declarations; no private notes, test screenshots, environment files or installed dependencies. |
| Dependencies | Successful current `npm audit --json --ignore-scripts` reports0 vulnerabilities. Advisory coverage is limited to npm's known advisory data. |
| CI | `contents: read`, no publication/deployment steps or secrets. Checkout, setup-node and setup-chrome are pinned to commits resolved from official release tags. |
| Logging | Demo logs only its loopback URL. No user content or credentials are logged. |
| Authentication/ownership | Not applicable to this client-side widget or its local-only static example. |

The independent review identified unclear fork metadata and mutable action tags;
both were corrected. Its initial network-blocked audit was superseded by the
successful advisory check above. Runtime code review findings concerning
reentrant lifecycle cleanup were reproduced, fixed and covered by browser tests.

No launch-blocking issue was found within this scope after remediation. This
review is not a security guarantee. Applications using Headroom remain responsible
for their own authentication, data handling and safe callback code. A future
backend, hosted demo, release or security-relevant change requires a new review.
