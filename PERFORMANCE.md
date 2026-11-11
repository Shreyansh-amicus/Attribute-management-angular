## 1. Objective

The objective of this task was to analyze the Angular application's production bundle, identify the largest modules contributing to the initial bundle size, apply at least one optimization, and compare the bundle sizes before and after optimization.

## 2. Build and Bundle Analysis

Generated the production build with bundle statistics using:

```bash
ng build --stats-json
```

Angular 22 uses the modern application build system based on **esbuild**, rather than the traditional Webpack builder. Therefore, the generated `stats.json` was analyzed using the esbuild bundle analysis information instead of relying on `webpack-bundle-analyzer`.

The analysis focused on the browser bundles, particularly the JavaScript files loaded during the initial application startup. Lazy-loaded chunks were examined separately.

## 3. Initial Bundle Analysis – Before Optimization

Before applying the optimization, the initial browser bundle contained the following files:

| Bundle | Size |
|---|---:|
| Main JavaScript | 401.36 kB |
| Stylesheet | 32.55 kB |
| **Total initial bundle** | **433.91 kB** |

The three largest modules contributing to the initial JavaScript bundle were:

| Module | Approximate Size |
|---|---:|
| Angular Debug Node (`_debug_node-chunk.mjs`) | 145.10 kB |
| Angular Router (`_router-chunk.mjs`) | 86.72 kB |
| Angular Forms (`forms.mjs`) | 61.49 kB |

These values represent the modules' contributions to the generated bundle, not separate downloadable files.

## 4. Optimization Applied – Lazy Loading

The application already used lazy loading for the Attributes and Dashboard routes. However, the Login component was initially imported directly into the root route configuration.

This caused the Login component and its dependencies to be included in the initial application bundle.

To optimize the application, the Login route was changed from eager loading to lazy loading using `loadComponent()`.

**Before:**

```typescript
import { Login } from './shared/components/login/login';

{
  path: 'login',
  component: Login,
  title: 'Login',
}
```

**After:**

```typescript
{
  path: 'login',
  loadComponent: () =>
    import('./shared/components/login/login')
      .then((m) => m.Login),
  title: 'Login',
}
```

The static import of the Login component was removed from the root route configuration.

This allows Angular to load the Login component only when the user navigates to the Login route.

## 5. Bundle Analysis – After Optimization

After applying the optimization, the application was built again:

```bash
ng build --stats-json
```

The generated browser bundles showed the following results:

| Bundle | Size |
|---|---:|
| Main JavaScript | 105.85 kB |
| Shared initial JavaScript chunk | 238.93 kB |
| Stylesheet | 32.55 kB |
| **Total initial JavaScript** | **344.78 kB** |
| **Total initial bundle including CSS** | **377.32 kB** |

The three largest modules contributing to the initial JavaScript bundle after optimization were:

| Module | Approximate Size |
|---|---:|
| Angular Debug Node (`_debug_node-chunk.mjs`) | 142.84 kB |
| Angular Router (`_router-chunk.mjs`) | 85.57 kB |
| Angular Pending Tasks (`_pending_tasks-chunk.mjs`) | 36.65 kB |

The Angular Forms module was moved out of the initial bundle and into a lazy-loaded shared chunk of approximately 49.80 kB. This chunk is loaded when a route requiring those dependencies is accessed.

## 6. Before and After Comparison

| Metric | Before Optimization | After Optimization |
|---|---:|---:|
| Main JavaScript file | 401.36 kB | 105.85 kB |
| Shared initial JavaScript | Not separately emitted | 238.93 kB |
| Total initial JavaScript | 401.36 kB | 344.78 kB |
| Stylesheet | 32.55 kB | 32.55 kB |
| **Total initial bundle** | **433.91 kB** | **377.32 kB** |

**Size reduction:**

- Initial JavaScript reduction: approximately **56.59 kB**.
- Initial JavaScript reduction percentage: approximately **14.10%**.
- Total initial bundle reduction, including CSS: approximately **13.04%**.

Note: The main JavaScript file became significantly smaller, but Angular also emitted a shared initial JavaScript chunk. Therefore, the comparison uses the combined initial JavaScript size rather than comparing the main file alone.

## 7. Lazy-Loaded Chunks

After optimization, the build output confirmed that the following routes were loaded through separate chunks:

| Route / Feature | Approximate Chunk Size |
|---|---:|
| Attributes | 80.75 kB |
| Dashboard | 9.69 kB |
| Login | 4.07 kB |

This confirms that these features are not required to be downloaded as part of the initial route bundle.

## 8. Conclusion

Bundle analysis helped identify the largest dependencies contributing to the application's initial JavaScript size.

The Login route was changed from eager loading to lazy loading using Angular's `loadComponent()` API. This reduced the initial JavaScript bundle from approximately **401.36 kB to 344.78 kB**, resulting in an improvement of approximately **14.10%**.

The optimization also confirmed that the Attributes, Dashboard, and Login features are loaded through separate lazy-loaded chunks.

The application now loads less JavaScript during initial startup, while loading feature-specific dependencies only when those routes are accessed.