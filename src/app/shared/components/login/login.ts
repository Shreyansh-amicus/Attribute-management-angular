import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';

  onLogin(): void {
    if (!this.username.trim() || !this.password.trim()) {
      return;
    }

    this.authService.login();

    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl');

    // Only allow internal application URLs.
    const destination =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/attributes';

    void this.router.navigateByUrl(destination);
  }
}