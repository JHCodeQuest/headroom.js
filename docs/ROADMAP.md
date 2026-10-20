# Planned work and migration

This page describes work requested for this fork. It is not a list of shipped
features. The [current API](API.md) remains the reference for available behaviour.
The [public board](https://github.com/users/JHCodeQuest/projects/7/views/1) tracks
ownership, progress, bugs, blockers and completion through linked issues and PRs.

## Current and proposed behaviour

| Area | Available now | Tracked work |
| --- | --- | --- |
| Documentation | Guides for the existing API and unpublished fork. | [#1](https://github.com/JHCodeQuest/headroom.js/issues/1): keep documentation aligned with verified behaviour. |
| Initialisation | Constructor followed by `init()`; tracking starts after a 100 ms timer. | [#2](https://github.com/JHCodeQuest/headroom.js/issues/2): decide whether to make setup synchronous; [#3](https://github.com/JHCodeQuest/headroom.js/issues/3): evaluate a function API. |
| Support detection and policy | Static boolean `Headroom.isSupported`, with deprecated, synchronized `cutsTheMustard` alias; documented [browser/version policy](BROWSER-SUPPORT.md). | [#4](https://github.com/JHCodeQuest/headroom.js/issues/4): additive naming migration implemented; [#7](https://github.com/JHCodeQuest/headroom.js/issues/7): policy defined, with remaining platform verification explicitly pending. |
| State notifications | Six instance callbacks. | [#5](https://github.com/JHCodeQuest/headroom.js/issues/5): replace callbacks with events emitted on the element. |
| State naming | `pin`/`unpin` methods and pinned/unpinned classes. | [#22](https://github.com/JHCodeQuest/headroom.js/issues/22): plan the breaking `up`/`down` API change. |
| Freeze | All scroll-driven state changes stop while frozen. | [#8](https://github.com/JHCodeQuest/headroom.js/issues/8): freeze pin state independently of top/not-top changes. |
| Offsets | Numeric or separate `{ up, down }` values at construction. | [#10](https://github.com/JHCodeQuest/headroom.js/issues/10): dynamic configuration; [#21](https://github.com/JHCodeQuest/headroom.js/issues/21): investigate directional top/not-top reports. Existing Chrome tests cover both offset orderings; the reported bug has not been reproduced there. |
| Scrolling | Native window or element scrolling. | [#9](https://github.com/JHCodeQuest/headroom.js/issues/9): integration with Locomotive Scroll and its virtual scroll position. |
| jQuery | Legacy adapter source, without a current adapter build or verified module entry. | [#6](https://github.com/JHCodeQuest/headroom.js/issues/6): choose the adapter strategy; [#19](https://github.com/JHCodeQuest/headroom.js/issues/19): resolve ES/CommonJS integration. |
| Angular | Legacy AngularJS directive source, unverified. | [#20](https://github.com/JHCodeQuest/headroom.js/issues/20): reproduce directive bugs; [#15](https://github.com/JHCodeQuest/headroom.js/issues/15): evaluate and integrate ngx-headroom for modern Angular after source and compatibility review. |
| React | Core constructor and cleanup can be used in a component lifecycle; no packaged React wrapper. | [#18](https://github.com/JHCodeQuest/headroom.js/issues/18): design and verify React support. |
| Mobile Safari | No verified iOS fix in this maintenance baseline. | [#11](https://github.com/JHCodeQuest/headroom.js/issues/11): iPad bottom detection; [#12](https://github.com/JHCodeQuest/headroom.js/issues/12): landscape; [#17](https://github.com/JHCodeQuest/headroom.js/issues/17): pinning when browser chrome expands. |

The early/repeated `destroy()` exception is already covered by lifecycle
regressions in this fork. That does not establish that unrelated framework
adapter errors or historical mobile reports are fixed.

## Migration dependencies

Decide the event contract, state names and lifecycle changes before adapting
framework wrappers to them. Specify event names, payload, bubbling, callback
compatibility and removal policy in the relevant issue before implementation.
Existing consumers must continue to follow the current API until a documented
migration is delivered. No automatic callback-to-event or pin-to-up mapping
exists today.

Support detection has an additive migration: replace reads/writes of
`Headroom.cutsTheMustard` with `Headroom.isSupported` (no parentheses). Both names
remain writable aliases for one boolean; changing the name does not change the
feature check or retroactively disable existing instances. See the
[API contract](API.md#constructor-and-feature-detection) for snapshot and override
limits. No breaking removal is included in this update.

The jQuery strategy and its packaging bug should be resolved together. Modern
Angular and React wrappers should reuse the core and define mount/unmount
cleanup; they should not duplicate scroll tracking. AngularJS and modern Angular
are separate integrations.

[TypeCtrl/ngx-headroom](https://github.com/TypeCtrl/ngx-headroom) is an archived,
MIT-licensed project. Its source, dependencies, compatibility and attribution
need review before integration. Linking that project does not mean its code or
older build tools have already been incorporated into this fork.

## Mobile validation plan

[#16](https://github.com/JHCodeQuest/headroom.js/issues/16) covers verifying the
iOS reports before fixing them. [#13](https://github.com/JHCodeQuest/headroom.js/issues/13)
tracks the testing environment blocker: this Windows workspace cannot run
Apple's iOS Simulator. Testing needs an authorised Mac with Xcode and suitable
Simulator runtimes, or access to an equivalent approved remote Mac environment.
See [Apple's Simulator documentation](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device).

For each report:

1. Record the affected iOS/Safari version, device or Simulator model, orientation,
   page layout and exact reproduction steps. Resolve exact versions from the
   [browser-policy target matrix](BROWSER-SUPPORT.md#browser-and-version-targets).
2. Build a reduced fixture and compare expected classes/callbacks with actual
   behaviour. Exercise top/bottom boundaries, touch scrolling and inertia,
   portrait/landscape changes and browser toolbar expansion/collapse where the
   environment supports them.
3. Reproduce the failure before changing runtime code, then add a regression
   check or record a repeatable manual check with its coverage limits.
4. Repeat the original scenario after the fix and record the environment and
   results. Use a physical device for behaviours the Simulator cannot reproduce.

Desktop viewport resizing and desktop WebKit checks do not establish iOS Safari
compatibility. A missing Simulator environment remains a blocker, not a passing
mobile result.

## Board and completion

Actionable work has public repository issues. A discrepancy affecting visibility
of some historical/reference cards is tracked separately in
[#14](https://github.com/JHCodeQuest/headroom.js/issues/14); stored card membership
alone is not proof that every viewer can see a card.

Use a PR closing reference such as `Closes #1` and target this fork's default
branch, `master`. GitHub closes linked issues when a qualifying PR is merged;
the enabled project completion workflows move completed work to **Done** when
the appropriate merge/closure event occurs. Keep unfinished work open, explain blockers in its issue, and record
verification evidence before treating it as complete.
