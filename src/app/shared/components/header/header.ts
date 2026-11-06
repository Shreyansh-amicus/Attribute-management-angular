import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';
import { UserProfile } from '../user-profile/user-profile';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    UserProfile,
  ],
  templateUrl: './header.html',
})
export class Header {
  private readonly authService = inject(AuthService);

  readonly isAuthenticated$ = this.authService.isAuthenticated$;

  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}