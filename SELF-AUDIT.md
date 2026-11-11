# Self-Audit: Assignments 1-3

This audit reviews the current implementation across the three assignments. The first three improvements below have also been applied to the codebase.

## What I Did Well

1. **Separated feature routes and lazy-loaded route content.** The attributes and admin features load as route groups, while dashboard and login components load on demand. This keeps route ownership clear and avoids eagerly importing every page. [app.routes.ts](src/app/app.routes.ts#L11-L28)
2. **Centralized shared state with immutable updates.** `StoreService` publishes a read-only state stream and creates new state and attribute-array references when updating data, which works well with `OnPush`. [store.ts](src/app/core/services/store.ts#L115-L140)
3. **Handled changing list queries with latest-request semantics and teardown.** `switchMap` prevents an older query from winning over a newer one, and `takeUntilDestroyed` scopes the subscription to the list component. [attribute-list.ts](src/app/features/attributes/components/attribute-list/attribute-list.ts#L188-L213)
4. **Used stable identity for rendered attribute cards.** Tracking by `AttributeId` lets Angular reuse the matching card when API refreshes return new object instances. [attribute-list.html](src/app/features/attributes/components/attribute-list/attribute-list.html#L149)
5. **Kept API payload mapping and activity logging concerns separate.** Mapping translates DTOs at the service boundary, and activity-log failures are swallowed so they do not turn a successful attribute mutation into a failed operation. [mapping.ts](src/app/core/services/mapping.ts#L7-L26) [attribute-service.ts](src/app/core/services/attribute-service.ts#L163-L183)

## What I Would Improve

1. **Keep assignment-only diagnostics out of normal list runtime.** The list previously logged API payloads and object-identity comparisons on every load. I removed those diagnostics so normal use does not produce noisy console output; the list now only applies successful results. [attribute-list.ts](src/app/features/attributes/components/attribute-list/attribute-list.ts#L195-L219)
2. **Preserve visible data when a refresh fails.** The previous error fallback emitted an empty page, replacing the loaded rows, while the error state hid the table. The list now ends the failed request without replacing its data and displays the alert alongside any existing rows. [attribute-list.ts](src/app/features/attributes/components/attribute-list/attribute-list.ts#L195-L202) [attribute-list.html](src/app/features/attributes/components/attribute-list/attribute-list.html#L102-L145)
3. **Test behavior, not only service/component construction.** Several specs only assert that an instance can be created. I replaced the attribute-list smoke-only coverage with a regression test that verifies rows remain visible after refresh failure; service mapping, pagination, and CRUD behavior still need focused tests. [attribute-service.spec.ts](src/app/core/services/attribute-service.spec.ts#L1-L13) [attribute-list.spec.ts](src/app/features/attributes/components/attribute-list/attribute-list.spec.ts#L47-L60)
4. **Bound the Subject demo subscription to its component lifetime.** `SubjectDemo` subscribes directly to a long-lived `BehaviorSubject` and never unsubscribes. Use `takeUntilDestroyed` or consume the stream with `AsyncPipe`. [subject-demo.ts](src/app/features/attributes/components/subject-demo/subject-demo.ts#L21)
5. **Make pagination totals explicit when the API omits its count header.** Falling back to the current page's item count can understate the total number of records and make later pages unreachable. Treat the count header as a required API contract or retrieve a trustworthy total separately. [attribute-service.ts](src/app/core/services/attribute-service.ts#L209)

## Improvements Applied

- Removed temporary API and DOM-identity logging from the attribute list.
- Changed failed page loads to retain previously loaded rows and show the request error without hiding the table.
- Added a focused failed-refresh regression test.

Validation: `npm test -- --watch=false --include=src/app/features/attributes/components/attribute-list/attribute-list.spec.ts` passed (2 tests).