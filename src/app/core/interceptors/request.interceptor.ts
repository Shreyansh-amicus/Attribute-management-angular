import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  finalize,
  retry,
  throwError,
  timer
} from 'rxjs';

import { ToastService } from '../services/toast-service';
import { LoadingService } from '../services/loading-service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const toastService = inject(ToastService);
  const loadingService = inject(LoadingService);

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  // Increment the active HTTP request counter.
  loadingService.requestStarted();

  // Add a unique request ID to every outgoing request.
  const modifiedRequest = req.clone({
    setHeaders: {
      'X-Request-Id': requestId
    }
  });

  console.log(
    `[HTTP Request] ${req.method} ${req.urlWithParams}`,
    `Request ID: ${requestId}`
  );

  return next(modifiedRequest).pipe(

    // Retry only GET requests and only for potentially temporary errors.
    retry({
      count: req.method === 'GET' ? 2 : 0,

      delay: (error: HttpErrorResponse, retryCount: number) => {

        const shouldRetry =
          error.status === 0 ||
          error.status === 408 ||
          error.status === 429 ||
          error.status >= 500;

        // Do not retry permanent errors such as 400, 401 or 404.
        if (!shouldRetry) {
          console.warn(
            `[HTTP Retry Skipped] ${req.urlWithParams}`,
            `Status: ${error.status}`
          );

          return throwError(() => error);
        }

        console.warn(
          `[HTTP Retry] Attempt ${retryCount} for ${req.urlWithParams}`,
          error.status
        );

        return timer(1000);
      }
    }),

    finalize(() => {

      // Decrement the counter after completion, error or cancellation.
      loadingService.requestFinished();

      const duration = Date.now() - startTime;

      console.log(
        `[HTTP Completed] ${req.method} ${req.urlWithParams} - ${duration}ms`,
        `Request ID: ${requestId}`
      );
    })
  );
};