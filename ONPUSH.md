# OnPush Change Detection

## 1. Objective

The objective of this task was to switch all components in the Attribute Management application to `ChangeDetectionStrategy.OnPush` and identify any components that stopped updating correctly.

The goal was to improve change-detection efficiency while maintaining application functionality without reverting any component to the Default change-detection strategy.

## 2. Implementation

Updated all standalone components to use:

```ts
changeDetection: ChangeDetectionStrategy.OnPush
```

Imported `ChangeDetectionStrategy` from `@angular/core` wherever required.

No components were reverted to the Default strategy.

## 3. Components Tested

The following components were tested after enabling OnPush:

- App component
- Header
- User profile
- Dashboard
- Attribute list
- Attribute card
- Add attribute
- Edit attribute
- Login
- Page not found
- Loader
- Card wrapper
- Collapsible section
- Confirm dialog
- Data table
- Toast component (if applicable)

## 4. Issues Observed

**No new component failures were observed after enabling OnPush.**

The existing application functionality continued to work as expected.

The application was tested for:

- Attribute creation, editing and deletion.
- Search, sorting and pagination.
- Switching between table and card views.
- Dashboard summary and chart updates.
- Recent activity updates.
- Authentication and role-based authorization.
- Lookup loading and form interactions.
- Global loader and confirmation dialog behavior.

## 5. Change Detection Approaches

Although no new failures were introduced during this task, the application uses several approaches that are compatible with OnPush.

### 5.1 Immutable Updates

The centralized StoreService uses immutable updates when modifying application state.

For example:

```ts
this.updateState({
  attributes: [...this.snapshot.attributes, attribute]
});
```

A new array reference is created instead of modifying the existing array.

This allows Angular to detect changed input references in OnPush child components.

### 5.2 markForCheck()

Some components use `ChangeDetectorRef.markForCheck()` after manually updating template-bound properties through subscriptions.

This explicitly marks the component for checking during the next change-detection cycle.

### 5.3 Async Pipe

Observable-based data is consumed using Angular's async pipe.

The async pipe automatically marks the component for checking when a new value is emitted and handles subscription cleanup.

## 6. Why OnPush Works

OnPush reduces unnecessary component checks by allowing Angular to check components when relevant changes are detected or when they are explicitly marked for checking.

The application benefits from:

- More predictable change detection.
- Better handling of immutable state updates.
- Reduced unnecessary checks in component subtrees.
- Improved compatibility with observable and signal-based data flows.

## 7. Conclusion

All application components were switched to `ChangeDetectionStrategy.OnPush`.

No new failures were observed during regression testing, so no additional component-specific fixes were required for this task.

The existing immutable state updates, async pipe usage and explicit `markForCheck()` calls provide appropriate mechanisms for updating component views while retaining the OnPush strategy.