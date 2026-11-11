import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'errors',
    loadComponent: () =>
      import('./components/error-log/error-log')
        .then((m) => m.ErrorLogComponent),
    title: 'Error Logs',
    canActivate : [authGuard, roleGuard],
    data:{
      role : "Admin"
    }
    // Add your existing Admin-only guard here.
  },
];