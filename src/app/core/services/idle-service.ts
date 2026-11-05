
import { Injectable, inject } from '@angular/core';

import {
  fromEvent,
  merge,
  of,
  switchMap,
  timer,
  auditTime,
  Subscription
} from 'rxjs';

import { Router } from '@angular/router';

import { StoreService } from './store';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private readonly store = inject(StoreService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly IDLE_TIMEOUT = 10 * 60 * 1000;

  private idleSubscription?: Subscription;

  startWatching(): void {
    // Prevent multiple activity subscriptions.
    this.stopWatching();

    // Listen for user activity.
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseClick$ = fromEvent(document, 'click');
    const keyDown$ = fromEvent(document, 'keydown');
    const scroll$ = fromEvent(document, 'scroll');
    const touchStart$ = fromEvent(document, 'touchstart');

    // Combine all activity events.
    const activity$ = merge(
      mouseMove$,
      mouseClick$,
      keyDown$,
      scroll$,
      touchStart$
    ).pipe(
      // Avoid processing excessive mouse movement events.
      auditTime(1000)
    );

    this.idleSubscription = merge(
      of(null),
      activity$
    ).pipe(
      // Every activity event resets the 10-minute timer.
      switchMap(() => timer(this.IDLE_TIMEOUT))
    ).subscribe(() => {
      this.handleIdleTimeout();
    });
  }

  stopWatching(): void {
    this.idleSubscription?.unsubscribe();
    this.idleSubscription = undefined;
  }

  private handleIdleTimeout(): void {
    this.stopWatching();

    // Clear authentication and role from the store.
    this.store.setAuthenticated(false);

    // Notify the user.
    this.toastService.error(
      'Your session has expired due to inactivity. Please log in again.'
    );

    // Redirect to login.
    void this.router.navigate(['/login']);
  }
}
