
import { Directive, HostBinding, Input } from '@angular/core';
import { UserRole } from '../../core/services/store';

@Directive({
  selector: '[appRoleBadge]',
  standalone: true
})
export class RoleBadgeDirective {
  @Input() appRoleBadge: UserRole = null;

  @HostBinding('class')
  get badgeClasses(): string {
    const baseClasses =
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';

    if (this.appRoleBadge === 'Admin') {
      return `${baseClasses} bg-purple-100 text-purple-700`;
    }

    if (this.appRoleBadge === 'Viewer') {
      return `${baseClasses} bg-blue-100 text-blue-700`;
    }

    return `${baseClasses} bg-gray-100 text-gray-600`;
  }

  @HostBinding('attr.title')
  get tooltip(): string {
    return this.appRoleBadge
      ? `${this.appRoleBadge} role`
      : 'No role assigned';
  }
}
