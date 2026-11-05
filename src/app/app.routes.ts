import { Routes } from '@angular/router';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { Login } from './shared/components/login/login';
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
    component: Login,
    title: 'Login',
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page Not Found',
  },
];
