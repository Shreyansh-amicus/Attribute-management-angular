# Architecture – Attribute Management System

## 1. Architecture Overview

The Attribute Management System is built using Angular standalone components and a feature-based folder structure.

The application is organized into three main areas:

- **Core:** Application-wide services, route guards, HTTP interceptors, resolvers and global error handling.
- **Features:** Feature-specific components and routes for attribute management and administration.
- **Shared:** Reusable components, directives, pipes, validators and application models.

The application uses Angular Router for navigation, RxJS for asynchronous operations and centralized state management, and JSON Server as its development API.

The application also includes Angular server-side rendering configuration and client hydration.

## 2. Actual Project Structure

```text
src/
│
├── app/
│   │
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   ├── app.config.ts
│   ├── app.config.server.ts
│   ├── app.routes.ts
│   └── app.routes.server.ts
│
├── core/
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── role.guard.ts
│   │   └── unsaved-changes.guard.ts
│   │
│   ├── handlers/
│   │   └── global-error-handler.ts
│   │
│   ├── interceptors/
│   │   ├── request.interceptor.ts
│   │   └── error.interceptor.ts
│   │
│   ├── resolvers/
│   │   └── attribute-resolver.ts
│   │
│   └── services/
│       ├── activity-log-service.ts
│       ├── attribute-service.ts
│       ├── auth-service.ts
│       ├── error-log-service.ts
│       ├── error-message.ts
│       ├── idle-service.ts
│       ├── loading-service.ts
│       ├── lookup.ts
│       ├── mapping.ts
│       ├── selected-attribute.ts
│       ├── store.ts
│       └── toast-service.ts
│
├── features/
│   │
│   ├── attributes/
│   │   ├── attribute.routes.ts
│   │   └── components/
│   │       ├── add-attribute/
│   │       ├── attribute-list/
│   │       ├── edit-attribute/
│   │       └── subject-demo/
│   │
│   └── admin/
│       ├── admin.routes.ts
│       └── components/
│           └── error-log/
│
└── shared/
    │
    ├── components/
    │   ├── attribute-card/
    │   ├── card-wrapper/
    │   ├── collapsible-section/
    │   ├── confirm-dialog/
    │   ├── dashboard/
    │   ├── data-table/
    │   ├── header/
    │   ├── loader/
    │   ├── login/
    │   ├── page-not-found/
    │   ├── toast-container/
    │   ├── user-profile/
    │   └── virtual-scroll/
    │
    ├── directives/
    │   ├── app-active-status.ts
    │   ├── filter-by.ts
    │   └── role-badge.ts
    │
    ├── models/
    │   ├── IAttribute.model.ts
    │   ├── IBusinessUnit.model.ts
    │   ├── ICompany.model.ts
    │   ├── ICustomerLocation.model.ts
    │   ├── ILookup.model.ts
    │   ├── activity-log-dto.ts
    │   ├── activity-log-model.ts
    │   └── attribute.dto.ts
    │
    ├── pipes/
    │   └── relative-time-pipe.ts
    │
    └── validator/
        └── attribute-name.validator.ts
```

The project also contains application bootstrap files, environment configurations, global styles and server-side rendering files outside `app/`.

## 3. Component Tree

This diagram reflects the actual routing and component composition in the uploaded project.

```text
App (app-root)
│
├── Header (app-header)
│   │
│   └── UserProfile (app-user-profile)
│       └── RoleBadgeDirective
│
├── Loader (app-loader)
│
├── RouterOutlet
│   │
│   ├── /login
│   │   └── Login
│   │
│   ├── /dashboard
│   │   └── Dashboard (app-dashboard)
│   │       │
│   │       ├── CardWrapper (4 summary cards)
│   │       │
│   │       └── CollapsibleSection
│   │           ├── Business Unit Distribution (SVG chart)
│   │           └── Recent Activity
│   │
│   ├── /attributes
│   │   │
│   │   ├── AttributeList (app-attribute-list)
│   │   │   │
│   │   │   ├── DataTable (table view)
│   │   │   │
│   │   │   ├── AttributeCard (card view)
│   │   │   │
│   │   │   ├── VirtualScrollDemo
│   │   │   │
│   │   │   └── ConfirmDialog
│   │   │
│   │   ├── /add
│   │   │   └── AddAttributePage
│   │   │
│   │   ├── /:id/edit
│   │   │   └── EditAttribute
│   │   │
│   │   └── /bug-test
│   │       └── SubjectDemo
│   │
│   ├── /admin
│   │   └── /errors
│   │       └── ErrorLogComponent
│   │
│   └── **
│       └── PageNotFound
│
└── ToastContainer (app-toast-container)
```

### Root application layout

`App` is the root component.

Its template contains:

- `Header`
- `Loader`
- `RouterOutlet`
- `ToastContainer`

The header contains the user profile component when the user is authenticated. The loader and toast container are available across routed pages.

### Attribute feature

The attribute feature contains four routed components:

- `AttributeList`
- `AddAttributePage`
- `EditAttribute`
- `SubjectDemo`

The attribute list supports two display modes:

- Table mode using `DataTable`
- Card mode using `AttributeCard`

It also renders the virtual scrolling demonstration and delete confirmation dialog.

### Dashboard

The dashboard is located under `shared/components/dashboard`, not under the features directory.

It uses:

- `CardWrapper` for its four summary cards.
- `CollapsibleSectionComponent` for dashboard content sections.
- A hand-coded SVG chart for business-unit distribution.
- Observable data from `StoreService` and `ActivityLogService`.

### Admin feature

The admin feature currently contains the error-log page, which is loaded as a standalone component through the admin route configuration.

## 4. Routing Architecture

The root route configuration is defined in:

`src/app/app.routes.ts`

| Route | Component / Feature | Access |
|---|---|---|
| `/` | Redirects to `/attributes` | Public redirect |
| `/attributes` | AttributeList | Authenticated users |
| `/attributes/add` | AddAttributePage | Admin |
| `/attributes/:id/edit` | EditAttribute | Admin |
| `/attributes/bug-test` | SubjectDemo | No guard configured |
| `/dashboard` | Dashboard | Authenticated users |
| `/login` | Login | Public |
| `/admin/errors` | ErrorLogComponent | Admin |
| `**` | PageNotFound | Fallback |

### Lazy loading

The root routes use:

- `loadChildren` for the attributes feature.
- `loadChildren` for the admin feature.
- `loadComponent` for the dashboard and login pages.

The attributes feature uses its own route configuration in `attribute.routes.ts`.

The admin feature uses `admin.routes.ts`.

### Route protection

- `AuthGuard` checks whether a user is authenticated.
- `RoleGuard` checks whether the user's role matches the required route role.
- `UnsavedChangesGuard` prevents accidental navigation away from an unsaved edit form.
- `AttributeResolver` loads the requested attribute before the edit component is activated.

## 5. State Management

The application uses a custom RxJS-based state management implementation through `StoreService`.

The store uses a private `BehaviorSubject<AppState>` as its single source of truth.

### Application state

The `AppState` interface contains:

| State property | Description |
|---|---|
| `attributes` | List of attribute records |
| `lookups` | Business units, companies and customer locations |
| `isLoading` | Application loading state |
| `isAuthenticated` | Authentication status |
| `role` | Current user role (`Admin`, `Viewer` or `null`) |
| `username` | Current username |

### State flow

```text
Component
    |
    | User interaction
    v
Feature Service
    |
    | HTTP request
    v
JSON Server API
    |
    | Response
    v
MappingService
    |
    | Convert DTO to application model
    v
Feature Service
    |
    | Update application state
    v
StoreService
    |
    | BehaviorSubject emits new state
    v
Observable Selectors
    |
    v
Component Template
    |
    | async pipe
    v
Updated UI
```

### Store implementation principles

1. The internal `BehaviorSubject` is private.
2. The store exposes read-only observables such as `attributes$`, `lookups$`, `role$` and `isAuthenticated$`.
3. State updates are immutable, using object and array spread operations.
4. Feature services update the store after successful API operations.
5. Components consume state through observables and the `async` pipe.
6. A synchronous `snapshot` getter is available when a service or component needs the current state immediately.

### Activity log state

`ActivityLogService` maintains its own activity state rather than storing activity records inside `AppState`.

It uses:

- `ReplaySubject` to publish activity events.
- `BehaviorSubject` to expose the current recent-activity list.

The dashboard combines `StoreService.attributes$` and `ActivityLogService.activities$` using `combineLatest`.

### Toast state

`ToastService` uses Angular signals to maintain the current list of toast messages. The toast container reads this state and displays notifications.

## 6. Services and Responsibilities

All services are located in `src/app/core/services/`.

| Service | Responsibility |
|---|---|
| `AttributeService` | Performs attribute API operations, including fetching, searching, pagination, creation, updating and deletion. Updates the centralized store and records corresponding activity events. |
| `ActivityLogService` | Loads recent activity records, converts activity DTOs into application models, publishes activity events and maintains the recent activity list. |
| `AuthService` | Handles login and logout, exposes authentication information, username and role observables, and coordinates idle monitoring. |
| `StoreService` | Maintains the central application state using `BehaviorSubject`. Exposes state selectors and immutable state update methods. |
| `Lookup` | Retrieves business units, companies and customer locations from the API. |
| `MappingService` | Converts between backend DTOs and frontend application models, including full and partial attribute payloads. |
| `SelectedAttributeService` | Maintains and exposes the currently selected attribute name through a `BehaviorSubject`. |
| `ErrorLogService` | Loads, creates and clears error-log records through the error-log API. |
| `IdleService` | Monitors mouse, keyboard, scroll and touch activity. Logs the user out after the configured inactivity timeout. |
| `LoadingService` | Tracks the number of active HTTP requests and exposes loading state to the global loader. |
| `ToastService` | Manages success, error and informational toast messages using Angular signals. |

### Additional service-layer utility

`error-message.ts` is a utility module rather than an injectable service. It contains HTTP error-message handling logic used to translate HTTP errors into readable messages.

## 7. Guards and Resolver

### AuthGuard

Checks authentication before allowing access to protected routes. Unauthenticated users are redirected to the login page with a return URL.

### RoleGuard

Checks the required role in route metadata. It prevents users without the required role from accessing restricted pages and reports access-denied errors.

### UnsavedChangesGuard

Protects the edit form from accidental navigation when there are unsaved changes.

### AttributeResolver

Retrieves the attribute identified by the route parameter before the edit component is activated. This allows the edit component to receive the resolved attribute through route data.

## 8. HTTP Interceptors and Error Handling

The application registers its HTTP interceptors in `app.config.ts`.

### RequestInterceptor

Responsible for request-related processing, including:

- Adding request identification metadata.
- Tracking request duration.
- Applying retry behavior for eligible requests.
- Updating the global loading state.

### ErrorInterceptor

Handles HTTP errors centrally.

Responsibilities include:

- Converting HTTP errors into readable messages.
- Displaying toast notifications.
- Logging relevant HTTP errors.
- Handling unauthorized responses and navigation.
- Avoiding recursive logging of error-log endpoint failures.

### GlobalErrorHandler

`GlobalErrorHandler` is registered using Angular's `ErrorHandler` provider.

It handles uncaught application errors that are not already handled by the HTTP interceptor.

## 9. Shared Components, Directives and Pipes

### Reusable components

| Component | Responsibility |
|---|---|
| `AttributeCard` | Displays an attribute in card format. |
| `CardWrapper` | Provides a reusable card layout. |
| `CollapsibleSectionComponent` | Provides expandable and collapsible content sections using content projection. |
| `ConfirmDialogComponent` | Displays a reusable confirmation dialog. |
| `DataTableComponent` | Displays tabular data and supports sorting, pagination and row actions. |
| `VirtualScrollDemo` | Demonstrates virtual scrolling using Angular CDK. |
| `Header` | Displays application branding, navigation and authenticated user controls. |
| `UserProfile` | Displays username, role and logout functionality. |
| `Loader` | Displays the global loading indicator. |
| `ToastContainer` | Displays toast notifications. |
| `Dashboard` | Displays application statistics, business-unit distribution and recent activity. |
| `Login` | Provides the login interface. |
| `PageNotFound` | Displays the fallback page for unknown routes. |

### Directives

| Directive | Responsibility |
|---|---|
| `AppActiveStatus` | Displays attribute active/inactive status with corresponding styling and tooltip information. |
| `FilterBy` | Provides attribute filtering based on configured fields and search terms. |
| `RoleBadgeDirective` | Applies role-based badge styling to user role information. |

### Pipes

`RelativeTimePipe` converts dates into relative time descriptions for display in the UI.

### Validators

`attribute-name.validator.ts` contains the custom attribute-name validation logic used by the add form.

## 10. Forms

The application uses two different Angular form approaches:

- **AddAttributePage:** Uses Reactive Forms with `FormGroup`, `FormControl`, built-in validators and a custom attribute-name validator.
- **EditAttribute:** Uses Template-driven Forms through `FormsModule` and `NgForm`.

Both forms load lookup information and filter customer locations according to the selected business unit.

## 11. API Integration

The application uses JSON Server as its mock backend during development.

The API base URL is configured through the Angular environment configuration and is used by the API services.

The main API resources include:

- Attributes
- Business units
- Companies
- Customer locations
- Activity logs
- Error logs

The attribute service communicates with the attributes endpoint and updates the centralized state after successful operations.

The mapping service handles conversion between API DTOs and frontend models so that backend naming conventions remain separate from component-facing models.

## 12. Server-Side Rendering and Hydration

The project includes Angular server-side rendering configuration:

- `app.config.server.ts`
- `app.routes.server.ts`
- `main.server.ts`
- `server.ts`

The application configuration also registers `provideClientHydration()`.

This allows the application to use Angular's server-rendering and client-hydration setup.