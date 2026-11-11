
import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { requestInterceptor } from './core/interceptors/request.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideClientHydration(),

    provideHttpClient(
      withInterceptors([
        requestInterceptor,
        errorInterceptor,
      ])
    ),

    // Register the custom global error handler.
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
