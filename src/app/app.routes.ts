import { Routes } from '@angular/router';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'attributes',
    pathMatch: 'full',
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./features/attributes/attribute.routes').then((m) => m.ATTRIBUTE_ROUTES),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/components/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login').then((m) => m.Login),
    title: 'Login',
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page Not Found',
  },
];
