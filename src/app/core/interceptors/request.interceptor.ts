
import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  finalize,
  retry,
  throwError,
  timer,
} from 'rxjs';

import { ToastService } from '../services/toast-service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  const modifiedRequest = req.clone({
    setHeaders: {
      'X-Request-Id': requestId,
    },
  });

  console.log(
    `[HTTP Request] ${req.method} ${req.urlWithParams}`,
    `Request ID: ${requestId}`
  );

  return next(modifiedRequest).pipe(
    // Retry GET requests up to 2 times with a 1-second delay
    retry({
      count: req.method === 'GET' ? 2 : 0,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        console.warn(
          `[HTTP Retry] Attempt ${retryCount} for ${req.urlWithParams}`,
          error.status
        );

        return timer(1000);
      },
    }),

    // Handle errors after all retry attempts have failed
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('401 Unauthorized: Redirecting to login.');
        void router.navigate(['/login']);
      }

      if (error.status === 500) {
        console.error('500 Internal Server Error:', error);

        toastService.error(
          'Something went wrong on the server. Please try again later.'
        );
      }

      return throwError(() => error);
    }),

    // Log the total duration, including retries and delays
    finalize(() => {
      const duration = Date.now() - startTime;

      console.log(
        `[HTTP Completed] ${req.method} ${req.urlWithParams} - ${duration}ms`,
        `Request ID: ${requestId}`
      );
    })
  );
};
