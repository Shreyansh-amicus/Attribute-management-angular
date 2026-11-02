import { inject } from '@angular/core';
import {
  RedirectCommand,
  ResolveFn,
  Router,
} from '@angular/router';

import { IAttributeModel } from '../../shared/models/IAttribute.model';
import { AttributeService } from '../services/attribute-service';
import { ToastService } from '../services/toast-service';

export const attributeResolver: ResolveFn<IAttributeModel> = (route) => {
  const attributeService = inject(AttributeService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  // Check whether the route ID is valid.
  if (!Number.isInteger(id) || id <= 0) {
    toastService.error('Invalid attribute ID.');
    return new RedirectCommand(router.createUrlTree(['/attributes']));
  }

  // Fetch the attribute before loading the component.
  const attribute = attributeService.getAttributeById(id);

  if (!attribute) {
    toastService.error(`Attribute with ID ${id} was not found.`);

    return new RedirectCommand(
      router.createUrlTree(['/attributes']),
    );
  }

  // Pass the fetched attribute to the component.
  return attribute;
};