import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorLogService } from '../services/error-log-service';
import { ToastService } from '../services/toast-service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorLogService = inject(ErrorLogService);
  private readonly toastService = inject(ToastService);

  handleError(error: unknown): void {
    console.log('[GlobalErrorHandler] Received error:', error);

    if (error instanceof HttpErrorResponse) {
      console.log('[GlobalErrorHandler] HTTP error handled by interceptor');
      return;
    }

    const message = 'Something went wrong. Please try again.';

    this.errorLogService
      .logError(message, 'Application')
      .subscribe({
        next: () => {
          console.log('[GlobalErrorHandler] Error log saved');
        },
        error: err => {
          console.error('[GlobalErrorHandler] Failed to save error:', err);
        },
        complete: () => {
          console.log('[GlobalErrorHandler] Logging request completed');
        }
      });

    this.toastService.error(message);

    console.error('Unhandled application error:', error);
  }
}