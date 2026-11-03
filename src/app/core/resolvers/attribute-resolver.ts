import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import { AttributeService } from '../services/attribute-service';
import { ToastService } from '../services/toast-service';

export const attributeResolver: ResolveFn<IAttributeModel> = (route) => {
  const attributeService = inject(AttributeService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  // 1. Validate the route ID before making an API request.
  if (!Number.isInteger(id) || id <= 0) {
    toastService.error('Invalid attribute ID.');

    return new RedirectCommand(router.createUrlTree(['/attributes']));
  }

  return attributeService.getAttributeById(id).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error loading attribute:', error);

      if (error.status === 404) {
        toastService.error(`Attribute with ID ${id} was not found.`);
      } else {
        toastService.error('Unable to load the requested attribute.');
      }

      // 3. Redirect instead of opening the Edit component.
      return of(new RedirectCommand(router.createUrlTree(['/attributes'])));
    }),
  );
};
