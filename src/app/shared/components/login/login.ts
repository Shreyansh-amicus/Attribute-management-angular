
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';
import { UserRole } from '../../../core/services/store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';
  role: UserRole = 'Viewer';
  errorMessage = '';

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      return;
    }

    const isLoggedIn = this.authService.login(
      this.username,
      this.password,
      this.role
    );

    if (!isLoggedIn) {
      this.errorMessage = 'Invalid login details.';
      return;
    }

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    const destination =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/attributes';

    void this.router.navigateByUrl(destination);
  }
}
