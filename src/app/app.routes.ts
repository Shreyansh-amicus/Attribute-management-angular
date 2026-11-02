import { Routes } from '@angular/router';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { Login } from './shared/components/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'attributes',
    pathMatch: 'full'
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./features/attributes/attribute.routes')
        .then(m => m.ATTRIBUTE_ROUTES)
  },
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Dashboard'
  },
  {
    path: 'login',
    component: Login,
    title: 'Login'
  },
  {
    path: '**',
    component: PageNotFound,
    title: 'Page Not Found'
  }
];