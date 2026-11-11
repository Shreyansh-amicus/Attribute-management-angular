# Design Decisions – Attribute Management System

This document explains the major technical decisions made during the development of the Attribute Management System, the alternatives considered and the reasoning behind the final choices.

## Decision 1: Standalone Components Instead of NgModules

**Decision:** Use Angular standalone components throughout the application.

**Alternatives considered:**
- Traditional Angular NgModules
- Standalone components

**Reasoning:**

Standalone components reduce the need for module declarations and make component dependencies explicit through their imports.

They also simplify lazy loading because individual components and feature route configurations can be loaded directly.

This makes the application easier to organize and maintain.

**Trade-offs:**

Dependencies must be imported into the components that use them. This requires careful management of component imports.

---

## Decision 2: Custom RxJS Store Instead of NgRx

**Decision:** Implement centralized state management using a custom `StoreService` backed by `BehaviorSubject`.

**Alternatives considered:**
- Component-level state
- Shared services without centralized state
- NgRx Store
- Custom RxJS-based store

**Reasoning:**

Multiple components require access to shared application data, particularly attributes, authentication information and lookup values.

A centralized store provides a single source of truth and allows components to react to state changes through observables.

NgRx would provide additional features such as reducers, actions, effects and DevTools integration, but it would also introduce additional setup and complexity.

For the current assignment's scope, a custom RxJS store provides sufficient functionality with less boilerplate.

**Trade-offs:**

As the application grows, custom state management requires consistent update patterns and careful separation of responsibilities to remain maintainable.

---

## Decision 3: Lazy Loading for Feature Routes

**Decision:** Use lazy loading for feature areas such as Attributes and Admin.

**Alternatives considered:**
- Eagerly load all application routes.
- Lazy-load feature routes.

**Reasoning:**

Not every user needs every feature immediately after opening the application.

Lazy loading allows Angular to download feature code only when the user navigates to that feature.

This helps reduce the initial JavaScript payload and can improve initial application loading performance.

**Trade-offs:**

The first navigation to a lazy-loaded feature may require an additional network request.

---

## Decision 4: Centralized Error Handling

**Decision:** Use HTTP interceptors together with Angular's global `ErrorHandler`.

**Alternatives considered:**
- Handle HTTP errors individually in components.
- Handle errors separately inside every service.
- Use centralized HTTP and application error handling.

**Reasoning:**

Handling errors independently in every component creates duplicated code and inconsistent user experiences.

The HTTP error interceptor centralizes API error handling, notifications, logging and unauthorized-response behavior.

The global error handler handles uncaught application errors that are outside normal HTTP request handling.

Together, they provide a consistent error-handling approach.

**Trade-offs:**

Interceptors must distinguish between different error types and avoid recursive error logging. Feature-specific errors may still require local handling.

---

## Decision 5: JSON Server Instead of Hardcoded Mock Data

**Decision:** Use JSON Server as the development API.

**Alternatives considered:**
- Hardcoded mock arrays inside Angular services.
- A custom backend API.
- JSON Server.

**Reasoning:**

Hardcoded arrays are useful for basic demonstrations but do not properly simulate HTTP communication or persistent CRUD operations.

JSON Server provides REST endpoints backed by `db.json`, allowing the application to demonstrate:

- GET requests
- POST requests
- PUT/PATCH requests
- DELETE requests
- HTTP interceptors
- Loading indicators
- Error handling
- Data persistence between application sessions

**Trade-offs:**

JSON Server is intended for development and testing. It does not provide the security, validation and business logic expected from a production backend.

---

## Decision 6: Reactive Forms Instead of Template-Driven Forms

**Decision:** Use Angular Reactive Forms for attribute creation and editing.

**Alternatives considered:**
- Template-driven forms
- Reactive forms

**Reasoning:**

Reactive forms provide explicit control over form state, validation and submission behavior.

They are particularly useful for the attribute forms because they contain multiple fields, required validation, custom name validation and dependent dropdown values.

Reactive forms also make it easier to test validation and control form submission programmatically.

**Trade-offs:**

Reactive forms require more initial setup than template-driven forms.

---

## Decision 7: OnPush Change Detection

**Decision:** Use `ChangeDetectionStrategy.OnPush` in suitable components.

**Alternatives considered:**
- Default change detection
- OnPush change detection

**Reasoning:**

OnPush reduces unnecessary change-detection work by checking components when relevant inputs change, observable values emit through mechanisms such as the `async` pipe, or other supported triggers occur.

It encourages predictable data flow and works well with immutable state updates.

**Trade-offs:**

Developers must understand how change detection is triggered and avoid relying on direct mutation of existing input objects.

---

## Decision 8: Reusable Components and Content Projection

**Decision:** Create reusable UI components such as card wrappers and collapsible sections using content projection.

**Alternatives considered:**
- Duplicate markup in every feature.
- Create reusable components with fixed internal content.
- Create reusable components with content projection.

**Reasoning:**

Duplicating the same markup across pages makes future UI changes harder.

Content projection allows reusable components to define layout and behavior while allowing parent components to provide their own content.

This makes components more flexible and reduces duplication.

**Trade-offs:**

Projection selectors and component contracts must be consistent. Incorrect selectors can result in projected content not rendering.

## Conclusion

The decisions were made to balance maintainability, performance, learning objectives and implementation complexity.

The application uses Angular standalone components, lazy-loaded features, a lightweight RxJS store, reactive forms and centralized error handling. These choices provide a structured foundation without introducing unnecessary dependencies for the current project scope.