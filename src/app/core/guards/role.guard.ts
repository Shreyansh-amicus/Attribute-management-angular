
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth-service';
import { ToastService } from '../services/toast-service';
import { ErrorLogService } from '../services/error-log-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const errorLogService = inject(ErrorLogService);

  // Redirect unauthenticated users to login.
  if (!authService.isAuthenticated) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Read the required role from route data.
  const requiredRole = route.data['role'] as string | undefined;

  // Check whether the current user has the required role.
  if (
    requiredRole &&
    authService.currentRole !== requiredRole
  ) {
    const message = 'Access denied. Admin permission required.';

    // Persist the authorization error.
    errorLogService
      .logError(message, `ROLE_GUARD: ${state.url}`, 403)
      .subscribe({
        error: error => {
          console.error('Unable to log authorization error:', error);
        }
      });

    // Display the toast notification.
    toastService.error(message);

    // Redirect unauthorized users.
    return router.createUrlTree(['/attributes']);
  }

  return true;
};
