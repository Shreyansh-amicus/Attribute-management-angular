import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';

  errorMessage = '';

  onLogin(): void {
    // Validate username and password.
    if (!this.username.trim() || !this.password.trim()) {
      return;
    }

    // Authenticate through AuthService and update centralized store.
    const isLoggedIn = this.authService.login(
      this.username,
      this.password
    );

    if (!isLoggedIn) {
      this.errorMessage = 'Invalid username or password.';
      return;
    }

    // Retrieve the originally requested URL.
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    // Only allow internal application URLs.
    const destination =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/attributes';

    // Navigate after successful authentication.
    void this.router.navigateByUrl(destination);
  }
}