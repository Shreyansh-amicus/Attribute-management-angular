import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loggedIn = signal(false);

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  login(): void {
    this.loggedIn.set(true);
  }

  logout(): void {
    this.loggedIn.set(false);
  }
}