
import { Injectable, inject } from '@angular/core';

import { StoreService, UserRole } from './store';
import { IdleService } from './idle-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly store = inject(StoreService);
  private readonly idleService = inject(IdleService);

  readonly isAuthenticated$ = this.store.isAuthenticated$;
  readonly role$ = this.store.role$;
  readonly isAdmin$ = this.store.isAdmin$;

  get isAuthenticated(): boolean {
    return this.store.snapshot.isAuthenticated;
  }

  get currentRole(): UserRole {
    return this.store.snapshot.role;
  }

  get isAdmin(): boolean {
    return this.currentRole === 'Admin';
  }

  login(
    username: string,
    password: string,
    role: UserRole
  ): boolean {
    if (
      !username.trim() ||
      !password.trim() ||
      (role !== 'Admin' && role !== 'Viewer')
    ) {
      return false;
    }

    this.store.setRole(role);
    this.store.setAuthenticated(true);

    // Start monitoring inactivity after successful login.
    this.idleService.startWatching();

    return true;
  }

  logout(): void {
    this.idleService.stopWatching();
    this.store.setAuthenticated(false);
  }
}
