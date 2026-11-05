import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth-service';
import { ToastService } from '../services/toast-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  // Redirect unauthenticated users to login.
  if (!authService.isAuthenticated) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });
  }

  // Read the required role from route data.
  const requiredRole = route.data['role'];

  // Check whether the current user has the required role.
  if (authService.currentRole !== requiredRole) {
    toastService.error('Access denied. Admin permission required.');

    return router.createUrlTree(['/attributes']);
  }

  return true;
};
