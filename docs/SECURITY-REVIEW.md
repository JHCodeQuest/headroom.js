# Security review

## Maintenance baseline

Baseline reviewed on 20 October 2026, before the event-API change. This covers the browser library, generated bundles,
package contents, local example server and CI configuration. No public demo,
backend service or npm package is being deployed by this update.

| Area | Evidence and result |
| --- | --- |
| Runtime injection/data access | The library changes DOM classes and calls consumer-supplied callbacks. No HTML rendering, eval, network requests, credentials, storage or runtime dependencies found. |
| Example | Uses synthetic text and `textContent`. Its server binds only `127.0.0.1` and serves three exact asset paths for GET/HEAD. Repository-file and traversal requests return404. |
| Public/package files | Source and generated artifacts inspected. npm's package list contains metadata, licence, README, bundles and declarations; no private notes, test screenshots, environment files or installed dependencies. |
| Dependencies | The baseline `npm audit --json --ignore-scripts` reported 0 vulnerabilities at review time. Advisory coverage is limited to npm's known advisory data; this is not a continuously refreshed result. |
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

## Element-event API review

Reviewed on 20 October 2026 for the unpublished callback-to-event update. Scope:
changed core/source declarations, generated core bundles, consumer package,
TypeScript example, regression fixtures and migration documentation. Independent
code review found no actionable correctness/security defects in that scope.

| Area | Evidence and result |
| --- | --- |
| Event surface | Six fixed event names dispatch after class changes. Detail contains the live instance, with no added network, storage or HTML-rendering path. Notifications bubble within the tree and are not composed across shadow roots. Programmatic events are not trusted user actions or authorisation boundaries. |
| Inputs and migration | Removed callback keys in supplied options/defaults raise value-free migration errors. Other option validation remains limited as documented. Listeners are application-owned; destroy cancels tracking and later obsolete states, not the event already dispatching. |
| Reentrancy/error handling | Regressions cover destruction/re-init, freeze during top/bottom listeners, active dispatch and browser-reported listener exceptions. Error suppression is restricted to the test fixture's deliberately thrown synthetic error. |
| Example/package privacy | Example uses static text and textContent. Packed contents contain only README, licence, package metadata and six generated bundle/declaration files; no private notes, screenshots, test fixtures or installed dependencies. |
| Dependencies and deployment | No dependency, CI permission, server-route or deployment changes. The baseline advisory scan is historical and was not repeated for this dependency-unchanged task. No npm publication, hosted demo or version tag is part of the update. |

No new exploitable path or sensitive disclosure was found in this change. This
review does not certify framework adapters, Safari/mobile behaviour, application
listeners or future changes. Consumers must migrate callbacks and explicitly
manage subscriptions; a passing event feature check is not a security guarantee.
