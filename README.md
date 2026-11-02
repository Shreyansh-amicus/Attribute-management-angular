# Angular assignment - Attribute management
## [GitHub](https://github.com/Shreyansh-amicus/Attribute-management-angular)

## Assignment - 1

### Task 1 - Create a new angular application

- Project initialization       
![Project initialization](screenshots/Initialize%20the%20project.png)

- Why does Angular offer both approaches?      
Angular offers both approaches because the ngModule approach has been present since a very long time and a lot of enterprise applications and packages are written in ngModule, whereas the standalone approach has been the default since Angular 17 making it backward compatible and easier to learn and use Angular.

- In what kind of project would you pick standalone over NgModule?      
Standalone has been the default approach that Angular has opted since Angular 17 because it reduces a lot of boilerplate code and makes development easier and faster as compared to NgModules. I would prefer standalone over NgModules in almost every situation where we don't have to explicity use the rigid, heavy modular approach provided by the NgModules.

### Task 2 - Create TypeScript interfaces

![Interfaces](screenshots/Interfaces.png)

### Task 3 - Create Attribute Service

- Create AttributeService
![Create AttributeService](screenshots/Create%20AttribueService.png)

- In-memory array of at least 8 diverse Attribute records
![In-memory array of at least 8 diverse Attribute records](screenshots/Mock%20attributes.png)

- What would change if you provided this service at component level? When would you choose that?             
If this service was provided at a component level, then we would have to describe the in memory attribute array and all the related methods to the attribute array in each and every component where it is used, whereas with the service AttributeService we have a global store through which all the components can share the data instead of repeating the same code at multiple places. I would choose the component level definition of the array and methods where only that specific component uses the data and methods of the service.

### Task 4 - Create AttributeListComponent

- Create AttributeListComponent
![Create AttributeListComponent](screenshots/Create%20AttributeList%20component.png)

- Attribute list
![Attribute list](screenshots/Attribute%20list.png)

### Task 5 - Create AttributeCardComponent 

- Create AttributeCardComponent 
![Create AttributeCardComponent](screenshots/Create%20AttributeCard%20Component.png)

- Attribute card view
![Attribute card view](screenshots/Card%20view.png)

- Attribute table view
![Attribute list view](screenshots/List%20view.png)

### Task 6 - Implement ngOnInit, ngOnChanges, ngOnDestroy in AttributeCardComponent

- Console.log() after switching to card layout         
![Console.log() after switching to card layout](screenshots/Hooks%20sequence%20after%20the%20card%20toggle.png)

- Console.log() after switching back to table layout          
![Console.log() after switching back to table layout](screenshots/Hooks%20sequence%20after%20the%20table%20toggle.png)

- In what order do hooks fire when the list loads?         
No hooks fire when the list loads since the table layout is the default layout in the attribute-list component.

- What fires when you switch between table/card view?              
When the toggle is switched from the table view to the card view, ngOnChanges and ngOnInit hooks are fired for each card with its id since the attribute-card component inherits the attributes as @Input from its parent attribute-list component and initializes the card view or layout.           
Whereas when the toggle is switched from the card view to the table view, the card layout no longer exists in the view, therefore the ngOnDestroy hook is fired for each attribute with its id.

- What fires when you remove an attribute? What real-world cleanup would you do in ngOnDestroy?           
When an attribute is removed from the list and its corresponding AttributeCard component is removed from the view, Angular calls ngOnDestroy() for that card instance. The console log displays the ID of the attribute associated with the destroyed component.         
Real world leanup that I would perform in ngOnDestroy hook is to clear up any tasks such as setTimeout and setInterval and clear up any resource which isn't needed any longer to avoid memory leak issues.

### Task 7 - Custom attribute directive appActiveStatus
![ custom attribute directive appActiveStatus](screenshots/Status%20badge%20with%20tooltip.png)

### Task 8 - Create a custom pipe RelativeTimePipe
![Create a custom pipe RelativeTimePipe](screenshots/Relative%20time.png)

### Task 9 - Add a search box

- Add a search box        
![Add a search box](screenshots/Search%20box.png)

- Why use a structural directive instead of a pipe?         
A structural directive controls whether an element exists in the DOM.
Here, it creates the row/card when the attribute matches the search
term and removes it when it doesn't.

A pipe would be more appropriate when the goal is to transform an
array into a filtered array for display.

### Task 10 - Create AddAttributeComponent
![Create AddAttributeComponent](screenshots/Add%20attribute%20component.png)

### Task 11 - Create EditAttributeComponent
![Create EditAttributeComponent](screenshots/Edit%20attribute%20component.png)

### Task 12 - Comparison: Reactive Forms vs Template-driven Forms

In this project, I implemented both Angular form approaches to understand their differences in implementation, validation, maintainability, and testing.

- **Add Attribute:** Implemented using Reactive Forms (`FormGroup`, `FormControl`, and `Validators`).
- **Edit Attribute:** Implemented using Template-driven Forms (`ngModel` and `NgForm`), with existing attribute data pre-populated into the form.

#### 1. What Was Easier and Harder in This Project?

| Aspect | Reactive Forms — Add Attribute | Template-driven Forms — Edit Attribute |
|---|---|---|
| **Form setup** | Required creating a `FormGroup` and defining each control in TypeScript. | Required importing `FormsModule` and connecting template fields using `ngModel`. |
| **Initial implementation** | Required more TypeScript setup, but the form structure was explicit. | Was quicker to get started with for a relatively simple form. |
| **Validation** | Validators were configured centrally using `Validators.required`, `Validators.minLength`, and a custom validator. | Validation was configured in the template using attributes such as `required`, `minlength`, and `maxlength`. |
| **Dependent dropdowns** | `valueChanges` made it straightforward to respond to Business Unit changes and filter Customer Locations. | Required handling template events and synchronizing the component's form model with dropdown selections. |
| **Pre-populating data** | Values can be set using methods such as `setValue()` and `patchValue()`. | Existing values can be assigned to the component model and displayed using `ngModel`. |
| **Form state** | Control values, validity, touched state, and dirty state are accessible through the form model. | `NgForm` exposes validity and dirty state, but controls must be registered and connected correctly. |
| **Maintainability** | Complex validation and dynamic form behavior can be organized in TypeScript. | Can become harder to manage when the template grows and contains extensive validation or conditional logic. |

**What I learned:**

Reactive Forms required more initial TypeScript setup, but they made validation and dependent dropdown behavior easier to organize and understand. Template-driven Forms were relatively quick to implement for the Edit form because the fields could be connected directly to the component model using `ngModel`.

However, the Template-driven approach requires careful management of form state, control registration, and changes to related dropdowns.

#### 2. When Would I Choose Each Approach in a Real Project?

##### Reactive Forms

I would choose Reactive Forms when:

- The form contains many fields or complex validation rules.
- Fields depend on other fields, such as Customer Location depending on Business Unit.
- The form requires dynamic controls or `FormArray`.
- Validation logic needs to be reused or maintained separately from the HTML template.
- The application requires explicit control over form state and validation.

**Examples:**
- Employee onboarding workflows.
- Product configuration forms.
- Registration workflows with complex validation.
- Multi-step forms with conditional fields.

##### Template-driven Forms

I would choose Template-driven Forms when:

- The form is relatively small and straightforward.
- Most validation can be expressed using standard HTML attributes and Angular template directives.
- The form has limited dynamic behavior.
- The team prefers keeping most of the form configuration in the template.

**Examples:**
- Simple contact forms.
- Basic feedback forms.
- Small settings forms with a few fields.

#### 3. Which Approach Is Easier to Unit Test, and Why?

**Reactive Forms are generally more convenient for unit testing complex form behavior.**

Reactive Forms expose their structure directly through TypeScript. A unit test can set control values, trigger validation, and check the form's validity without relying heavily on template interactions.

For example, to test whether the attribute name is valid:

```typescript
component.attributeForm.controls.AttributeName.setValue('Department');

expect(
  component.attributeForm.controls.AttributeName.valid
).toBeTrue();
```

To verify that the required validator works:

```typescript
component.attributeForm.controls.AttributeName.setValue('');

expect(
  component.attributeForm.controls.AttributeName.hasError('required')
).toBeTrue();
```

Template-driven Forms can also be unit tested. However, Angular needs to initialize the template and register its `ngModel` controls before assertions can reliably inspect the form state. This can require additional fixture setup and asynchronous change detection.

Therefore, Reactive Forms are generally easier to test when a form contains complex validation rules, dynamic controls, or substantial programmatic behavior. Template-driven Forms remain testable and are suitable for simpler forms.

#### 4. Conclusion

Both approaches are useful, and neither is universally better.

In this project, Reactive Forms were a good fit for **Add Attribute** because the form uses a custom attribute-name validator and a dependent Customer Location dropdown. Template-driven Forms provided an opportunity to implement **Edit Attribute** using `ngModel` and `NgForm`.

For a production application with complex forms, I would generally prefer Reactive Forms because their explicit structure, centralized validation configuration, and programmatic control make them easier to maintain and test.

For smaller forms with minimal logic, Template-driven Forms can reduce the amount of setup required.

Ultimately, I would choose the approach based on the form's complexity, validation requirements, maintainability, and testing needs rather than using one approach for every form.

## Assignment 2
### Task 1 – Feature-Based Project Structure

#### 1. Overview

The objective of this task was to reorganize the Attribute Management application into a feature-based folder structure while maintaining the existing standalone component-based architecture.

The application is structured into three main areas:

- **Attribute:** Contains components related to attribute management.
- **Shared:** Contains reusable components, directives, and pipes.
- **Core:** Contains application-wide services and infrastructure such as HTTP interceptors.

#### 2. Project Structure

The application follows the following folder structure:

```text
src/
└── app/
    ├── core/
    │   └── services/
    │       ├── attribute-service.ts
    │       └── lookup-service.ts
    │ 
    │
    ├── shared/
    │   ├── components/
    │   │   └── attribute-card/
    │   ├── directives/
    │   │   ├── active-status.directive.ts
    │   │   └── filter-by.directive.ts
    │   └── pipes/
    │       └── relative-time.pipe.ts
    │
    ├── features/
    │   └── attributes/
    │       ├── components/
    │       │   ├── attribute-list/
    │       │   ├── add-attribute/
    │       │   └── edit-attribute/
    │       └── attribute.routes.ts
    │
    ├── app.routes.ts
    └── app.config.ts
```

#### 3. What Goes Where?

##### Attribute Feature

The Attribute feature contains components that implement the application's main business functionality.

It includes:

- **AttributeListPage:** Displays attributes in table and card views, with search and filtering functionality.
- **AddAttributePage:** Allows users to create new attributes using reactive forms.
- **EditAttributeComponent:** Allows users to update existing attributes using template-driven forms.

##### Shared

The Shared folder contains reusable functionality that can be used by multiple components or features.

It includes:

- **AttributeCard:** Reusable UI component for displaying attribute information.
- **AppActiveStatus:** Custom directive that displays active and inactive status.
- **FilterBy:** Custom structural directive for filtering attributes.
- **RelativeTimePipe:** Custom pipe for displaying dates in relative time format.

These declarations remain standalone and are imported directly into the components that require them.

##### Core

The Core folder contains application-wide services and infrastructure.

It includes:

- **AttributeService:** Manages attribute data and CRUD operations.
- **LookupService:** Provides lookup information such as business units, companies, and customer locations.
- **HTTP Interceptors:** Used for handling common HTTP request and response logic.

Services that should be application-wide singletons use Angular's `providedIn: 'root'` configuration.

#### 4. Why Separate Core from Shared?

Core and Shared have different responsibilities, so separating them improves application organization and maintainability.

| Core | Shared |
|---|---|
| Contains application-wide services | Contains reusable UI functionality |
| Manages application infrastructure | Provides components, directives, and pipes |
| Includes HTTP interceptors | Includes common UI utilities |
| Generally initialized at the application root | Used wherever required |
| Focuses on application-level functionality | Focuses on reusability |

Separating these responsibilities provides the following benefits:

- **Separation of concerns:** Application infrastructure is kept separate from reusable UI functionality.
- **Maintainability:** Services and shared declarations are easier to locate and manage.
- **Reusability:** Shared components, directives, and pipes can be reused across features.
- **Scalability:** New features can be added without unnecessarily increasing the complexity of existing folders.

#### 5. What Happens If CoreModule Is Imported Inside a Lazy-Loaded Module?

In a traditional NgModule-based Angular application, CoreModule is generally imported only once, inside the root AppModule.

If CoreModule is imported inside a lazy-loaded feature module, Angular can create additional instances of providers registered in CoreModule.

This happens because lazy-loaded modules have their own child injectors.

Potential problems include:

- **Duplicate service instances:** Application-wide services may have separate instances.
- **Multiple interceptor registrations:** HTTP interceptors may be registered more than once.
- **Inconsistent application state:** Different parts of the application may work with different service instances.
- **Unexpected behavior:** Duplicate providers can cause issues with shared application data and infrastructure.

To prevent these problems:

1. Import CoreModule only once in the root AppModule.
2. Avoid importing CoreModule inside lazy-loaded feature modules.
3. Use `providedIn: 'root'` for application-wide singleton services.
4. Keep reusable components, directives, and pipes in SharedModule.

**Note:** This section explains the traditional NgModule-based architecture for conceptual understanding. The current Attribute Management application continues to use standalone components and does not implement actual CoreModule or SharedModule classes.

#### 6. Benefits of the Feature-Based Structure

The new folder organization provides several benefits:

- **Better organization:** Related components and services are grouped according to their responsibilities.
- **Separation of concerns:** Business functionality, shared UI functionality, and application infrastructure are kept separate.
- **Improved reusability:** Shared components, directives, and pipes can be imported wherever needed.
- **Lazy loading:** Attribute feature routes can be loaded on demand using Angular's standalone routing configuration.
- **Easier maintenance:** Changes to one feature are less likely to affect unrelated parts of the application.

#### 7. Conclusion

The Attribute Management application has been reorganized into Attribute, Shared, and Core areas while preserving its standalone component-based architecture.

The Attribute feature contains the main application components, Shared contains reusable UI elements, and Core contains application-wide services and infrastructure.

### Task 2 – Routing and Lazy Loading

#### 1. Overview

The objective of this task was to configure application routing for the Attribute Management application and implement lazy loading for the Attribute feature.

The application uses Angular's standalone component-based routing architecture.

The following routes were implemented:

| Route | Component | Description |
|---|---|---|
| `/attributes` | AttributeListPage | Displays the list of attributes |
| `/attributes/add` | AddAttributePage | Allows users to add attributes |
| `/attributes/:id/edit` | EditAttributeComponent | Allows users to edit an existing attribute |
| `/dashboard` | DashboardComponent | Displays a dashboard placeholder |
| `**` | PageNotFoundComponent | Handles unknown routes |

The root URL (`/`) redirects to `/attributes` by default.

#### 2. Lazy Loading Implementation

Lazy loading was implemented using Angular's `loadChildren` routing configuration.

Instead of loading all Attribute components when the application starts, Angular loads the Attribute feature's route configuration only when the user navigates to `/attributes`.

The feature routes are maintained separately in `attribute.routes.ts`.

This keeps the root routing configuration clean and separates feature-specific routing from application-level routing.

Since the application follows a standalone architecture, the implementation uses lazy-loaded route configurations rather than an actual AttributeModule NgModule.

#### 3. Why Use Lazy Loading?

Lazy loading improves application performance by avoiding the need to load every feature when the application initially starts.

Benefits include:

- **Reduced initial loading:** Feature code is downloaded only when required.
- **Better performance:** Smaller initial JavaScript payloads can improve application startup.
- **Code separation:** Feature-specific routes and components remain organized separately.
- **Scalability:** Additional features can be lazy-loaded independently.

#### 4. How Was Lazy Loading Verified?

Lazy loading was verified using the browser's Developer Tools Network tab.

The following steps were performed:

1. Started the Angular application using `ng serve`.
2. Opened the browser Developer Tools.
3. Navigated to `/anything` first to load page-not-found page.
4. Navigated to `/attributes`.
5. Observed a new JavaScript chunk request in the Network tab.

**Observation:**

When navigating to `/anything`, the Attribute feature was not required.

When navigating to `/attributes`, Angular dynamically loaded the Attribute feature's route configuration and its required dependencies through a separate JavaScript chunk.

This confirms that the Attribute feature is configured for lazy loading.

**Screenshot Evidence:**

- Initial load(page not found)
![Initial load](screenshots/attribute%20components%20doesn't%20get%20loaded%20on%20page%20not%20found%20page.png)

- Lazy load(/attributes)
![Lazy load](screenshots/attribute%20components%20get%20loaded%20only%20on%20the%20attributes%20route.png)

#### 5. Conclusion

Application routing was successfully configured for Attribute List, Add Attribute, Edit Attribute, Dashboard, and Page Not Found.

Lazy loading was implemented using standalone route configuration with `loadChildren`.

The implementation maintains the existing component-based architecture while improving feature organization and avoiding unnecessary loading of feature code during application startup.

### Task 3 – Authentication Guard (CanActivate)

#### 1. Overview

The objective of this task was to implement route protection using Angular's functional `CanActivate` guard.

A simple authentication mechanism was created using an `AuthService` with a hardcoded login status flag.

No backend or actual credential verification is involved. The purpose is to understand how Angular route guards control navigation based on authentication status.

#### 2. AuthService Implementation

An `AuthService` was created to manage the authentication state of the application.

It maintains an `isLoggedIn` flag using an Angular Signal.

The service provides the following methods:

- **isLoggedIn():** Returns the current authentication status.
- **login():** Sets the authentication status to `true`.
- **logout():** Sets the authentication status to `false`.

The service uses `providedIn: 'root'` to ensure that the same service instance is available throughout the application.

#### 3. AuthGuard Implementation

A functional `CanActivate` guard was implemented to protect routes that require authentication.

The guard performs the following operations:

1. Injects AuthService and Angular Router.
2. Checks whether the user is logged in.
3. If the user is authenticated, it returns `true` and allows navigation.
4. If the user is not authenticated, it redirects them to the Login page.
5. The originally requested URL is passed as a `returnUrl` query parameter.

For example, if an unauthenticated user tries to access `/attributes/101/edit`, they are redirected to:

`/login?returnUrl=%2Fattributes%2F101%2Fedit`

After successful login, the application redirects them to their originally requested page.

#### 4. LoginComponent Implementation

A standalone LoginComponent was created with a simple username and password form.

The form uses Angular's template-driven forms through `FormsModule`.

The login process works as follows:

1. The user enters a username and password.
2. Required-field validation ensures both fields are provided.
3. When the Login button is clicked, the `login()` method of AuthService is called.
4. The authentication flag is updated to `true`.
5. The application reads the `returnUrl` query parameter.
6. The user is redirected to the requested page, or to `/attributes` if no valid return URL is available.

**Note:** This is a demonstration-only login mechanism. Any non-empty username and password are accepted. No real authentication or backend validation is performed.

#### 5. Route Protection

The AuthGuard was applied to the Add Attribute and Edit Attribute routes using `canActivate`.

| Route | Authentication Required |
|---|---|
| `/attributes` | No |
| `/attributes/add` | Yes |
| `/attributes/:id/edit` | Yes |
| `/dashboard` | No |
| `/login` | No |

The Attribute List and Dashboard remain publicly accessible, while Add and Edit operations require authentication.

The existing `CanDeactivate` guard on the Edit Attribute route was also retained to prevent users from accidentally leaving with unsaved changes.

#### 6. Testing and Verification

The following scenarios were tested:

| Test Scenario | Expected Result |
|---|---|
| Access `/attributes/add` without login | Redirect to Login |
| Access `/attributes/101/edit` without login | Redirect to Login |
| Submit login form with non-empty values | Authentication flag becomes `true` |
| Login after requesting Add Attribute | Redirect to `/attributes/add` |
| Login after requesting Edit Attribute | Redirect to the requested Edit URL |
| Access `/attributes` without login | Access allowed |
| Access `/dashboard` without login | Access allowed |

#### 7. Limitations

Since this task uses a hardcoded authentication flag:

- No backend authentication is implemented.
- Username and password are not verified against a database.
- Authentication state is maintained only in memory.
- Refreshing the browser resets the login status to `false`.
- The route guard provides client-side navigation control, not production-level security.

In a real-world application, authentication and authorization must also be enforced by the backend.

#### 8. Conclusion

A functional Angular AuthGuard was successfully implemented using `CanActivate`.

The AuthService manages the login state, and the LoginComponent provides a simple interface for changing that state.

The Add Attribute and Edit Attribute routes are now protected, while public routes remain accessible without authentication.

This task demonstrates how Angular route guards can be used to control navigation based on authentication status.

### Task 4 – Unsaved Changes Guard (CanDeactivate)

#### 1. Overview

The objective of this task was to implement an Angular `CanDeactivate` guard to prevent users from accidentally losing unsaved changes while editing an attribute.

The guard was integrated with the existing dirty-check functionality from Assignment 1.

Whenever a user attempts to navigate away from the Edit Attribute page, the application checks whether the form has unsaved changes.

If the form is dirty, a confirmation dialog is displayed before allowing navigation.

#### 2. Dirty Checking in EditAttributeComponent

The Edit Attribute component uses Angular template-driven forms through `NgForm`.

A template reference variable is used to access the form instance:

`#editForm="ngForm"`

The component accesses this form using Angular's `@ViewChild` decorator.

The form's `dirty` property is used to determine whether the user has modified any form controls.

- **Dirty:** The user has changed one or more form controls.
- **Pristine:** The user has not modified the form controls.

A `saved` flag is also maintained to identify whether the changes have been successfully saved.

#### 3. UnsavedChangesGuard Implementation

A functional `CanDeactivate` guard was created to control navigation away from the Edit Attribute component.

The guard calls the component's `canDeactivate()` method.

The method checks the following conditions:

1. If the changes have already been saved, navigation is allowed.
2. If the form is not dirty, navigation is allowed.
3. If the form is dirty, a confirmation dialog is displayed.
4. If the user confirms, navigation is allowed.
5. If the user cancels, navigation is prevented.

The browser's native `confirm()` function is used to display the confirmation dialog.

#### 4. Guard Integration with Routing

The `unsavedChangesGuard` was registered on the Edit Attribute route using `canDeactivate`.

The route also retains the `authGuard` implemented in Task 3.

Both guards serve different purposes:

| Guard | Responsibility |
|---|---|
| AuthGuard (CanActivate) | Prevents unauthenticated users from accessing the Edit page |
| UnsavedChangesGuard (CanDeactivate) | Prevents users from accidentally leaving the Edit page with unsaved changes |

#### 5. Save and Cancel Behavior

The guard is integrated with the existing save and cancel functionality.

**Save:**

- The attribute is updated through AttributeService.
- The `saved` flag is set to `true` after a successful update.
- The user is redirected to the Attribute List.
- No confirmation dialog is displayed.

**Cancel:**

- The user is redirected to the Attribute List.
- If the form is dirty, the confirmation dialog is displayed.
- The user can either confirm navigation or remain on the Edit page.

#### 6. Testing and Verification

The following scenarios were tested:

| Test Scenario | Expected Result |
|---|---|
| Navigate away without modifying the form | Navigation allowed |
| Modify a field and click Cancel | Confirmation dialog displayed |
| Confirm navigation | Navigation allowed |
| Cancel navigation | User remains on Edit page |
| Modify a field and save successfully | Changes saved without confirmation |
| Press browser Back after modifying a field | Confirmation dialog displayed |

#### 7. Conclusion

The UnsavedChangesGuard was successfully implemented using Angular's functional `CanDeactivate` guard.

It integrates with the existing `NgForm.dirty` property and the Edit Attribute component's save functionality.

This helps prevent accidental loss of user changes and improves the reliability of the application's navigation flow.