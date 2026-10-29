import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function attributeNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    // Allow letters, numbers, spaces and hyphens only.
    const validNamePattern = /^[a-zA-Z0-9 -]+$/;

    return validNamePattern.test(value) ? null : { invalidAttributeName: true };
  };
}
