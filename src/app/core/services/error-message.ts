
import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400:
      return 'Invalid request';

    case 401:
      return 'Please log in';

    case 403:
      return 'Access denied';

    case 404:
      return 'Not found';

    default:
      if (error.status >= 500) {
        return 'Server error, try again';
      }

      return 'Something went wrong. Please try again';
  }
}
