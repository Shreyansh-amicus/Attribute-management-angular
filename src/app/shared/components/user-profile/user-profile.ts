
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';
import { RoleBadgeDirective } from '../../directives/role-badge';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    AsyncPipe,
    RoleBadgeDirective
  ],
  templateUrl: './user-profile.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class UserProfile {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly username$ = this.authService.username$;
  readonly role$ = this.authService.role$;

  onLogout(): void {
    this.authService.logout();

    void this.router.navigate(['/login']);
  }
}
