
import { Injectable, inject } from '@angular/core';
import { StoreService } from './store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly store = inject(StoreService);

  // Components can observe authentication state.
  readonly isAuthenticated$ = this.store.isAuthenticated$;

  // Keep this getter for synchronous route guard checks.
  get isAuthenticated(): boolean {
    return this.store.snapshot.isAuthenticated;
  }

  login(username: string, password: string): boolean {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    // Demo authentication only.
    this.store.setAuthenticated(true);

    return true;
  }

  logout(): void {
    this.store.setAuthenticated(false);
  }
}
