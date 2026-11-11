
import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ErrorLogService } from '../services/error-log-service';
import { getHttpErrorMessage } from '../services/error-message';
import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorLogService = inject(ErrorLogService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  // Do not intercept requests used to persist error logs.
  if (req.url.includes('/errorLogs')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message = getHttpErrorMessage(error);

        errorLogService
          .logError(
            message,
            `${req.method} ${req.url}`,
            error.status
          )
          .subscribe();

        toastService.error(message);

        // Redirect when the user's session is no longer valid.
        if (error.status === 401 && router.url !== '/login') {
          router.navigate(['/login'], {
            queryParams: {
              returnUrl: router.url,
            },
          });
        }
      }

      return throwError(() => error);
    })
  );
};
